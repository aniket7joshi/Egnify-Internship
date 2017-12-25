const controller = require('./sectionAverage.controller');
const express = require('express');

const router = express.Router();
const section = require;
router.get('/section', controller.section);
router.get('/sectionToppers', controller.sectionToppers);
module.exports = router;
