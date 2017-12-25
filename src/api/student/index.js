const multer = require('multer');

const express = require('express');
const controller = require('./student.controller');

const router = express.Router();

const storage = multer.diskStorage({
  destination: './files',
  filename(req, file, cb) {
    cb(null, `${new Date()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

router.get('/', controller.index);
router.post('/populateDb', upload.single('file'), controller.populateDb);
// router.get('/lol', controller.lol);

module.exports = router;
