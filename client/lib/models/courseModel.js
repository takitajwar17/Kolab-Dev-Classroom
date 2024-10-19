import mongoose from "mongoose";
const {Schema} =mongoose;
const courseSchema = new Schema({
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
    unique: true
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    // required: true
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



const Course = mongoose.models.Course || mongoose.model('Course', courseSchema);
module.exports = Course;