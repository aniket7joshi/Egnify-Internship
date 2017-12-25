import mongoose from 'mongoose';
import config from '../config';

const controller = require('../api/allIndiaMarksAnalysisReport/allIndiaMarksAnalysisReport.controller');

// const controller = require('./../api/allIndiaMarksAnalysisReport/allIndiaMarksAnalysisReport.controller');

mongoose.Promise = require('bluebird');

// Connect to MongoDB
mongoose.connect(config.mongo.uri, config.mongo.options);
mongoose.connection.on('error', err => {
  console.error(`MongoDB connection error: ${err}`);
  process.exit(-1); // eslint-disable-line no-process-exit
});

controller.generateAllIndiaMarksAnalysisReport('lol');
