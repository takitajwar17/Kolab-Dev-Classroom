import { NextResponse } from "next/server";
import Course from "@/lib/models/courseModel";
import { connect } from "@/lib/mongodb/mongoose";
import { auth } from "@clerk/nextjs";

export async function POST(request, { params }) {
  try {
    await connect();
    const { userId } = auth();
    const { courseId } = params;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const course = await Course.findById(courseId);
    
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Check if the user making the request is the creator (0th admin)
    if (course.admin[0] !== userId) {
      return NextResponse.json(
        { error: "Only the course creator can demote admins" },
        { status: 403 }
      );
    }

    // Get the admin ID to demote from the request body
    const { adminId } = await request.json();
    
    if (!adminId) {
      return NextResponse.json(
        { error: "Admin ID is required" },
        { status: 400 }
      );
    }

    // Cannot demote the creator (0th admin)
    if (adminId === course.admin[0]) {
      return NextResponse.json(
        { error: "Cannot demote the course creator" },
        { status: 400 }
      );
    }

    // Check if the user is actually an admin
    if (!course.admin.includes(adminId)) {
      return NextResponse.json(
        { error: "User is not an admin in this course" },
        { status: 400 }
      );
    }

    // Remove admin from admin array and add to enrolledStudents
    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      {
        $pull: { admin: adminId },
        $addToSet: { enrolledStudents: adminId }
      },
      { new: true }
    );

    return NextResponse.json(updatedCourse);
  } catch (error) {
    console.error("Error demoting admin:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
