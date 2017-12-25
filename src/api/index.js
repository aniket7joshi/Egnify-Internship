/**
 * API
 */

// import path from 'path';
const student = require('./student');
const masterResult = require('./masterResult');
const overAllAverage = require('./overAllAverage');
const filesList = require('./filesList');
const sectionAverage = require('./sectionAverage');
const campusTopper = require('./campusTopper');
const fetchDetails = require('./fetchDetails');
const getData = require('./getData');
const Download = require('./Download');
const graphData = require('./graphData');

// const sectionTopper = require('./sectionTopper');
export default function(app) {
  //  Insert API below
  // use the same naming convention
  app.use('/api/students', student);
  app.use('/api/masterResults', masterResult);
  app.use('/api/filesList', filesList);
  app.use('/api/overAllAverages', overAllAverage);
  app.use('/api/sectionAverages', sectionAverage);
  app.use('/api/campusToppers', campusTopper);
  app.use('/api/fetchDetails', fetchDetails);
  app.use('/api/getData', getData);
  app.use('/api/download', Download);
  app.use('/api/graphData', graphData);
}
