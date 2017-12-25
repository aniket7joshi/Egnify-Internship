const express = require('express');

const controller = require('./allIndiaMarksAnalysisReport.controller');

const router = express.Router();

router.get('/', controller.index);
// router.get('/lol', controller.lol);

module.exports = router;
