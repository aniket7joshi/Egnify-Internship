/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/students              ->  index
 * POST    /api/students              ->  create
 * GET     /api/students/:id          ->  show
 * PUT     /api/students/:id          ->  upsert
 * PATCH   /api/students/:id          ->  patch
 * DELETE  /api/students/:id          ->  destroy
 */

import Student from './student.model';

const fs = require('fs');
const csvjson = require('csvjson');

// Gets a list of Students
export function index(req, res) {
  Student.find({}, (err, docs) => {
    res.send(docs);
  });
}

export function getStudent(studentData) {
  const student = {};

  student.rollNumber = studentData.rollNumber;
  student.name = studentData.name;

  student.academicDetails = {
    sectionId: studentData.sectionId,
    campusId: studentData.campusId,
    addmissionType: student.addmissionType,
    addmissionDate: student.addmissionDate,
  };

  return student;
}

export function populateDb(req, res) {
  const file = req.file; // file passed from client
  // const meta = req.body; // all other values passed from the client, like name, etc..

  const options = {
    delimiter: ',', // optional
    quote: '"', // optional
  };

  const studentFs = fs.readFileSync(file.path, { encoding: 'utf8' });
  const studentData = csvjson.toObject(studentFs, options);

  const students = [];
  for (let i = 0; i < studentData.length; ) {
    const tmp = getStudent(studentData[i]);
    students.push(tmp);
    i += 1;
  }

  Student.create(students, (err, docs) => {
    if (err) {
      console.error(err);
      res.status(200).send(err);
    } else {
      res.status(200).send(docs);
    }
  });
}

export default { index, populateDb };
