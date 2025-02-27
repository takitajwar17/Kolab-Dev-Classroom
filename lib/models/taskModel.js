import mongoose from "mongoose";

const { Schema } = mongoose;

const taskSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: [true, 'Course ID is required']
    },
    type: {
      type: String,
      enum: ['assignment', 'quiz', 'material', 'project', 'lab'],
      default: 'assignment'
    },
    points: {
      type: Number,
      default: 0,
      min: 0
    },
    dueDate: {
      type: Date
    },
    createdBy: {
      type: String,
      ref: "User",
      required: true
    },
    submissions: [
      {
        studentId: {
          type: String,
          ref: "User"
        },
        submissionDate: Date,
        submissionLink: String,
        grade: Number
      }
    ]
  },
  {
    timestamps: true
  }
);

// Add a pre-save hook to convert courseId to ObjectId
taskSchema.pre('save', function(next) {
  if (this.courseId && typeof this.courseId === 'string') {
    try {
      this.courseId = new mongoose.Types.ObjectId(this.courseId);
    } catch (error) {
      return next(new Error('Invalid Course ID'));
    }
  }
  next();
});

const Task = mongoose.models.Task || mongoose.model("Task", taskSchema);

export default Task;