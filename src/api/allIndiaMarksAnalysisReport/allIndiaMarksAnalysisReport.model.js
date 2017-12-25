import mongoose from 'mongoose';
// import {registerEvents} from './student.events';

const ReportSchema = new mongoose.Schema({
  rollNumber: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  campusId: { type: String, required: true },

  phyMarks120: { type: Number, default: 0 },
  cheMarks120: { type: Number, default: 0 },
  matMarks120: { type: Number, default: 0 },

  phyRank: { type: Number, default: 0 },
  cheRank: { type: Number, default: 0 },
  matRank: { type: Number, default: 0 },

  overallMarks: { type: Number, default: 0 },
  overallRank: { type: Number, default: 0 },

  active: Boolean,
});

const AllIndiaMarksAnalysisReportSchema = new mongoose.Schema({
  testId: { type: String, required: true },
  academicYear: { type: Number, required: true },
  reports: [ReportSchema],
  active: Boolean,
});

// registerEvents(studentSchema);
export default mongoose.model(
  'AllIndiaMarksAnalysisReport',
  AllIndiaMarksAnalysisReportSchema,
);
