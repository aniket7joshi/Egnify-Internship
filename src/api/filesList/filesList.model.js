import mongoose from 'mongoose';

const FilesListSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  testname: { type: String, required: true },
  dateuploaded: { type: Date, required: true },
  check: { type: Boolean, required: true },
  active: Boolean,
});
export default mongoose.model('FilesList', FilesListSchema);
