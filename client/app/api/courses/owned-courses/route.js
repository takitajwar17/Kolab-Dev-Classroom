import { NextResponse } from "next/server";
import Course from "@/lib/models/courseModel";
import { connect } from "@/lib/mongodb/mongoose";
import { auth } from "@clerk/nextjs";

export async function GET() {
  try {
    await connect();
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const courses = await Course.find({ creator: userId });
    return NextResponse.json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

