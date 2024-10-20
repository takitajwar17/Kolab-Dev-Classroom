"use server";

import Course from "../models/courseModel";
import { connect } from "../mongodb/mongoose";

export const createCourse = async (title, details, courseCode, creator) => {
  try {
    await connect();
    console.log("Creating course: ", { title, details, courseCode, creator });

    const course = await Course.create({
      title: title,
      description: details,
      courseCode: courseCode,
      creator: creator, // Ensure creator is passed as a string
    });

    console.log("Course created:", course);
    return course.toObject(); // Convert Mongoose document to plain object
  } catch (error) {
    console.error("Error creating course:", error);
    throw error;
  }
};