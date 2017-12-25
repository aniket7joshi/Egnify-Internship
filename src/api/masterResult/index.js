// import mongoose from 'mongoose';
// import FilesList from '../filesList/filesList.model';
const multer = require('multer');
const express = require('express');

const controller = require('./masterResult.controller');

const router = express.Router();

const storage = multer.diskStorage({
  destination: './files',
  filename(req, file, cb) {
    cb(null, `${new Date()}-${file.originalname}`);
    // name(file);
  },
  // var Thing = mongoose.model('filesList', schema);
  // var m = new Thing;
  // m.filename = new Date();
  // m.fileuploaded = file.originalname;
  // m.save(callback);
});

const upload = multer({ storage });

// router.get('/', controller.index);
router.post(
  '/populateDb',
  upload.array('files', 2),
  controller.readFiles,
  controller.createMasterResults,
  controller.cwuAnalysis,
  controller.markAnalysis,
  controller.rankAnalysis,
  controller.createFileDetails,
  // controller.total,
  controller.populateDb,
);
// router.get('/lol', controller.lol);

module.exports = router;
