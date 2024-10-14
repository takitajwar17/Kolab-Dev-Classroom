import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  code: {
    type: String,
    required: true,
    unique: true
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tasks: [{
    type: Schema.Types.ObjectId,
    ref: 'Task'
  }],
  enrolledStudents: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

// Generate a random code for the course
// courseSchema.pre('save', function(next) {
//   if (!this.code) {
//     this.code = Math.random().toString(36).substring(2, 8).toUpperCase();
//   }
//   next();
// });

const Course = mongoose.models.Course || mongoose.model('Course', courseSchema);
module.exports = Course;