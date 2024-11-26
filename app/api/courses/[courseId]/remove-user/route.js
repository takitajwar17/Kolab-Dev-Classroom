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

    // Only admins can remove users
    if (!course.admin.includes(userId)) {
      return NextResponse.json(
        { error: "Only admins can remove users from the course" },
        { status: 403 }
      );
    }

    // Get the user ID to remove from the request body
    const { userToRemoveId, userRole } = await request.json();
    
    if (!userToRemoveId || !userRole) {
      return NextResponse.json(
        { error: "User ID and role are required" },
        { status: 400 }
      );
    }

    // If removing an admin, only the creator (0th admin) can do it
    if (userRole === 'admin' && course.admin[0] !== userId) {
      return NextResponse.json(
        { error: "Only the course creator can remove teachers" },
        { status: 403 }
      );
    }

    // Cannot remove the creator (0th admin)
    if (userRole === 'admin' && userToRemoveId === course.admin[0]) {
      return NextResponse.json(
        { error: "Cannot remove the course creator" },
        { status: 400 }
      );
    }

    // Remove user from their respective array
    const updateQuery = userRole === 'admin' 
      ? { $pull: { admin: userToRemoveId } }
      : { $pull: { enrolledStudents: userToRemoveId } };

    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      updateQuery,
      { new: true }
    );

    return NextResponse.json(updatedCourse);
  } catch (error) {
    console.error("Error removing user:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
