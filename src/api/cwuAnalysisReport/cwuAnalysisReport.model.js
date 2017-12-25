import mongoose from 'mongoose';
// import {registerEvents} from './student.events';

const ReportSchema = new mongoose.Schema({
  rollNumber: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  campusId: { type: String, required: true },

  Physics_C: { type: Number, default: 0 },
  Physics_W: { type: Number, default: 0 },
  Physics_U: { type: Number, default: 0 },

  Chemistry_C: { type: Number, default: 0 },
  Chemistry_W: { type: Number, default: 0 },
  Chemistry_U: { type: Number, default: 0 },

  Maths_C: { type: Number, default: 0 },
  Maths_W: { type: Number, default: 0 },
  Maths_U: { type: Number, default: 0 },

  active: Boolean,
});

const CWUAnalysisReportSchema = new mongoose.Schema({
  testId: { type: String, required: true },
  academicYear: { type: Number, required: true },
  reports: [ReportSchema],
  active: Boolean,
});

// registerEvents(studentSchema);
export default mongoose.model('CWUAnalysisReport', CWUAnalysisReportSchema);
