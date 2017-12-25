const controller = require('./overAllAverage.controller');
const express = require('express');

const router = express.Router();
router.get('/total', controller.total);
router.get('/campus', controller.campus);
module.exports = router;
