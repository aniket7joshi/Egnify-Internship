const controller = require('./fetchDetails.controller');
const express = require('express');

const router = express.Router();
router.get('/data', controller.data);
module.exports = router;
