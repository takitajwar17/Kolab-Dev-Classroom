// api/courses/enroll/route.js

import Course from "@/lib/models/courseModel";
import { connect } from "@/lib/mongodb/mongoose";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    await connect();
    const { userId } = auth(); // This should be equivalent to the clerkId

    if (!userId) {
      console.log("Authentication failed: No user ID found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Extract the JSON body from the request
    const requestBody = await request.json();
    console.log("Received body:", requestBody);

    const { courseCode } = requestBody;

    // Check if courseCode is provided
    if (!courseCode) {
      console.log("Missing fields in the request body", {
        courseCode,
      });
      return NextResponse.json(
        { error: "Course code is required" },
        { status: 400 }
      );
    }

    // Find the course by the given courseCode and add the clerkId to enrolledStudents
    const updatedCourse = await Course.findOneAndUpdate(
      { courseCode: courseCode },
      { $addToSet: { enrolledStudents: userId } }, // Use $addToSet to prevent duplicate entries
      { new: true }
    );

    if (!updatedCourse) {
      console.log("No course found with the provided courseCode", {
        courseCode,
      });
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    console.log("Student enrolled successfully", {
      courseCode,
      clerkId: userId,
    });
    return NextResponse.json(updatedCourse);
  } catch (error) {
    console.error("Error enrolling student:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
