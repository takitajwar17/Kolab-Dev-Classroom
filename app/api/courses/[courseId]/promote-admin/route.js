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

    // Check if the user making the request is an admin
    if (!course.admin.includes(userId)) {
      return NextResponse.json(
        { error: "Only admins can promote users to admin status" },
        { status: 403 }
      );
    }

    // Get the student ID from the request body
    const { studentId } = await request.json();
    console.log('Received studentId:', studentId);
    console.log('Course enrolledStudents:', course.enrolledStudents);
    
    if (!studentId) {
      return NextResponse.json(
        { error: "Student ID is required" },
        { status: 400 }
      );
    }

    // Check if the student is enrolled in the course
    if (!course.enrolledStudents.includes(studentId)) {
      return NextResponse.json(
        { error: "Student is not enrolled in this course" },
        { status: 400 }
      );
    }

    // Remove student from enrolledStudents and add to admin
    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      {
        $pull: { enrolledStudents: studentId },
        $addToSet: { admin: studentId }
      },
      { new: true }
    );

    return NextResponse.json(updatedCourse);
  } catch (error) {
    console.error("Error promoting student to admin:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
