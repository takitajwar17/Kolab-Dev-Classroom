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

    console.log("Fetching courses for userId:", userId);

    // Fetch courses where user is an admin OR is the creator (for backward compatibility)
    const adminCourses = await Course.find({
      $or: [
        { admin: userId },
        { creator: userId } // Include old creator field during transition
      ]
    });
    console.log("Admin courses:", adminCourses);

    // For each course that still uses the old creator field, migrate it to use admin array
    for (const course of adminCourses) {
      if (course.creator && !course.admin?.includes(course.creator)) {
        await Course.findByIdAndUpdate(course._id, {
          $set: { admin: [course.creator] }
        });
      }
    }

    // Fetch enrolled courses
    const enrolledCourses = await Course.find({ 
      enrolledStudents: userId,
      _id: { $nin: adminCourses.map(c => c._id) } // Exclude admin courses
    });
    console.log("Enrolled courses:", enrolledCourses);

    // Combine both admin and enrolled courses
    const courses = {
      admin: adminCourses,
      enrolled: enrolledCourses,
    };

    console.log("Final courses object:", courses);

    // If the user has no courses at all, return a suitable message
    if (adminCourses.length === 0 && enrolledCourses.length === 0) {
      return NextResponse.json({
        message: "No courses found where user is enrolled or is an admin.",
      });
    }

    // Return the combined course details
    return NextResponse.json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
