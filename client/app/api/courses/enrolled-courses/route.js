// route.js
import Course from "@/lib/models/courseModel";
import { connect } from "@/lib/mongodb/mongoose";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connect();
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch courses where the user is enrolled
    const courses = await Course.find({
      enrolledStudents: userId,
    });

    // If the user is not enrolled in any courses, return a suitable message
    if (courses.length === 0) {
      return NextResponse.json({
        message: "No courses found where user is enrolled.",
      });
    }

    // Return the course details without populating task details
    return NextResponse.json(courses);
  } catch (error) {
    console.error("Error fetching enrolled courses:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
