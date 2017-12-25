const controller = require('./campusTopper.controller');
const express = require('express');

const router = express.Router();

router.get('/topper', controller.topper);
router.get('/campusTopper', controller.campusTopper);
module.exports = router;
