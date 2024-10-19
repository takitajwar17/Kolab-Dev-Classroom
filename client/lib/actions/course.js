"use server";

import Course from "../models/courseModel";
import { connect } from "../mongodb/mongoose";

export const createOrUpdateCourse = async (title, details, courseCode) => {
  try {
    await connect();
    console.log("Creating/updating course: ", { title, details, courseCode });

    const course = await Course.findOneAndUpdate(
      { title: title },
      {
        $set: {
          title: title,
          description: details,
          courseCode: courseCode,
        },
      },
      { new: true, upsert: true }
    );

    console.log("Course after update:", course);
    return course.toObject(); // Convert Mongoose document to plain object
  } catch (error) {
    console.error("Error creating or updating course:", error);
    throw error;
  }
};