import mongoose from 'mongoose';
// import {registerEvents} from './student.events';

const MasterResultSchema = new mongoose.Schema({
  rollNumber: { type: String, required: true },
  name: { type: String, required: true },
  omrSheetId: { type: String, default: null },
  instituteId: { type: String, default: null },
  campusId: { type: String, default: null },
  sectionId: { type: String, default: null },
  batch: { type: String, default: null },
  courseType: { type: String, default: null },
  Qmap: {},
  questionResponse: {},
  questionMarks: {},
  cwuAnalysis: {},
  markAnalysis: {},
  rankAnalysis: {},
  active: Boolean,
  testName: { type: String, required: true },
});

// registerEvents(studentSchema);
export default mongoose.model('MasterResult', MasterResultSchema);
