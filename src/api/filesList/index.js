const express = require('express');
const controller = require('./filesList.controller');

const router = express.Router();

router.get('/getList', controller.getList);
module.exports = router;
