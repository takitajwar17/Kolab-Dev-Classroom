"use server";

import mongoose from "mongoose";
import { connect } from "../mongodb/mongoose";
import Task from "@/lib/models/taskModel";
import Course from "@/lib/models/courseModel";
import { revalidatePath } from "next/cache";

export async function createTask(formData) {
  try {
    // Connect to the database
    await connect();
    
    // Get courseId and check if it exists
    const courseIdString = formData.get('courseId');
    if (!courseIdString) {
      throw new Error("Course ID is required but was not provided");
    }
    
    console.log("Received courseId:", courseIdString);
    
    // Extract task data from formData
    const taskData = {
      title: formData.get('title'),
      description: formData.get('description'),
      type: formData.get('type'),
      points: Number(formData.get('points')),
      dueDate: new Date(formData.get('dueDate')),
      courseId: courseIdString,
      createdBy: formData.get('createdBy')
    };

    // Validate task data
    if (!taskData.title) throw new Error("Task title is required");
    if (!taskData.courseId) throw new Error("Course ID is required");
    if (!taskData.createdBy) throw new Error("Creator ID is required");

    // Console log the task data being created
    console.log('Creating task with data:', taskData);

    // Check if the course exists before creating the task
    const courseExists = await Course.findById(courseIdString);
    if (!courseExists) {
      throw new Error(`Course with ID ${courseIdString} not found`);
    }

    // Create new task
    const newTask = await Task.create(taskData);

    // Console log the created task
    console.log('Task created successfully:', newTask);

    // Update the course to include this task
    const updatedCourse = await Course.findByIdAndUpdate(
      courseIdString,
      { $push: { tasks: newTask._id } },
      { new: true }
    );

    console.log('Course updated with new task:', updatedCourse);

    // Revalidate the path to refresh the page data
    revalidatePath(`/courses/${courseIdString}`);

    return { 
      success: true, 
      task: newTask 
    };
  } catch (error) {
    // Enhanced error logging
    console.error("Detailed Error creating task:", {
      message: error.message,
      stack: error.stack,
      name: error.name
    });

    return { 
      success: false, 
      error: error.message 
    };
  }
}

// Rest of the file remains unchanged
export async function updateTask(taskId, updatedData) {
  try {
    await connect();

    const task = await Task.findByIdAndUpdate(
      taskId, 
      updatedData, 
      { new: true }
    );

    if (!task) {
      throw new Error("Task not found");
    }

    revalidatePath(`/courses/${task.courseId}`);

    return { 
      success: true, 
      task 
    };
  } catch (error) {
    console.error("Error updating task:", error);
    return { 
      success: false, 
      error: error.message 
    };
  }
}

export async function deleteTask(taskId, courseId) {
  try {
    await connect();

    // Delete the task
    const deletedTask = await Task.findByIdAndDelete(taskId);

    if (!deletedTask) {
      throw new Error("Task not found");
    }

    // Remove task reference from course
    await Course.findByIdAndUpdate(
      courseId,
      { $pull: { tasks: taskId } },
      { new: true }
    );

    revalidatePath(`/courses/${courseId}`);

    return { 
      success: true, 
      message: "Task deleted successfully" 
    };
  } catch (error) {
    console.error("Error deleting task:", error);
    return { 
      success: false, 
      error: error.message 
    };
  }
}

export async function getTasksByCourse(courseId) {
  try {
    await connect();

    const tasks = await Task.find({ courseId }).sort({ createdAt: -1 });

    return { 
      success: true, 
      tasks 
    };
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return { 
      success: false, 
      error: error.message 
    };
  }
}