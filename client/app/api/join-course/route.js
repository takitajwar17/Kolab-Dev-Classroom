import { NextResponse } from "next/server";
import Course from "@/lib/models/courseModel";
import { connect } from "@/lib/mongodb/mongoose";

export async function POST(req) {
  try {
    await connect();
    const { courseCode } = await req.json();

    if (!courseCode) {
      return NextResponse.json({ error: "Course code is required" }, { status: 400 });
    }

    const course = await Course.findOne({ courseCode });
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Add logic to join the course (e.g., add user to enrolledStudents)
    // For now, we'll just return a success response

    return NextResponse.json({ message: "Joined course successfully" });
  } catch (error) {
    console.error("Error joining course:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}