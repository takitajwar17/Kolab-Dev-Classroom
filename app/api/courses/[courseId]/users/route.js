import { NextResponse } from "next/server";
import Course from "@/lib/models/courseModel";
import User from "@/lib/models/userModel";
import { connect } from "@/lib/mongodb/mongoose";
import { auth } from "@clerk/nextjs";

export async function GET(req, { params }) {
  try {
    await connect();
    const { userId } = auth();
    const { courseId } = params;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!courseId) {
      return NextResponse.json(
        { error: "Course ID is required" },
        { status: 400 }
      );
    }

    const course = await Course.findById(courseId);
    
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Check if user has access to this course (admin or enrolled student)
    const hasAccess = 
      course.admin.includes(userId) || 
      course.enrolledStudents.includes(userId);

    if (!hasAccess) {
      return NextResponse.json(
        { error: "You don't have access to this course" },
        { status: 403 }
      );
    }

    // Fetch admin users
    const adminUsers = await User.find({ 
      clerkId: { $in: course.admin }
    }).select('firstName lastName image_url email userName clerkId');

    // Fetch enrolled student users
    const enrolledStudentUsers = await User.find({ 
      clerkId: { $in: course.enrolledStudents }
    }).select('firstName lastName image_url email userName clerkId');

    return NextResponse.json({
      admin: adminUsers,
      enrolledStudents: enrolledStudentUsers
    });
  } catch (error) {
    console.error("Error fetching course users:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
