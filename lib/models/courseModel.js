import mongoose from "mongoose";

const { Schema } = mongoose;

// Delete the existing model if it exists
if (mongoose.models.Course) {
  delete mongoose.models.Course;
}

const courseSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    courseCode: {
      type: String,
      required: true,
      unique: true,
    },
    admin: {
      type: [String],
      required: true,
      validate: {
        validator: function(v) {
          return v && v.length > 0;
        },
        message: 'At least one admin is required'
      }
    },
    tasks: [
      {
        type: Schema.Types.ObjectId,
        ref: "Task",
      },
    ],
    enrolledStudents: [
      {
        type: String,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Course = mongoose.model("Course", courseSchema);
export default Course;
