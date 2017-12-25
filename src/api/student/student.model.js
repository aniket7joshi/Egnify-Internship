import mongoose from 'mongoose';
// import {registerEvents} from './student.events';

const StudentSchema = new mongoose.Schema({
  rollNumber: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  addmissionNumber: { type: String, default: null },
  courseCode: { type: String, default: null },
  gender: { type: String, default: null },
  dateOfBirth: { type: Date, default: Date.now },
  addmissionDate: { type: Date, default: Date.now },
  emailAddress: { type: String, default: 'student@example.com' },
  contactNumber: { type: Number, default: null },
  academicDetails: Array,
  active: Boolean,
});

// registerEvents(studentSchema);
export default mongoose.model('Student', StudentSchema);
