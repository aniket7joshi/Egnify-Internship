/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/students              ->  index
 * POST    /api/students              ->  create
 * GET     /api/students/:id          ->  show
 * PUT     /api/students/:id          ->  upsert
 * PATCH   /api/students/:id          ->  patch
 * DELETE  /api/students/:id          ->  destroy
 */

import MasterResult from './masterResult.model';
import FilesList from './../filesList/filesList.model';

const fs = require('fs');
const csvjson = require('csvjson');
// Gets a list of Students
export function index(req, res) {
  MasterResult.find({}, (err, docs) => {
    res.status(200).send(docs);
  });
}

function getQuestionResponse(errorData) {
  const response = {};
  // let totalNumberQuestion = 0;

  // for (const key in error_data) {
  //   if(key.match(/^[Q]\d*/g)){
  //     total_no_question += 1
  //     response[key] = error_data[key]
  //   }
  // }

  Object.keys(errorData).forEach(key => {
    if (key.match(/^[Q]\d*/g)) {
      // totalNumberQuestion += 1;
      response[key] = errorData[key];
    }
  });

  return response;
}

function getQuestionWiseResponseMarks(errorData, Qmap) {
  const response = {};
  // let totalNumberQuestion = 0;

  // for (const key in error_data) {
  //   if(key.match(/^[Q]\d*/g)){
  //     total_no_question += 1
  //     response[key] = error_data[key]
  //   }
  // }

  Object.keys(errorData).forEach(key => {
    if (key.match(/^[Q]\d*/g)) {
      // totalNumberQuestion += 1;
      const tmpQmap = Qmap[key];
      response[key] = tmpQmap[errorData[key]];
    }
  });

  return response;
}

function getStudent(errorData, Qmap) {
  const result = {};

  result.rollNumber = errorData.STU_ID;
  result.name = errorData.NAME_OF_THE_STUDENT;
  result.campusId = errorData.CAMPUS_ID;
  result.sectionId = errorData.SECTION_ID;

  result.questionResponse = getQuestionResponse(errorData);
  result.questionMarks = getQuestionWiseResponseMarks(errorData, Qmap);
  return result;
}

function getQmap(markingSchemaData) {
  const Q = {};

  for (let l = 0; l < markingSchemaData.length; l += 1) {
    Q[markingSchemaData[l].Qs] = {
      C: markingSchemaData[l].C,
      W: markingSchemaData[l].U,
      U: markingSchemaData[l].W,
      ADD: markingSchemaData[l].ADD,
      subject: markingSchemaData[l].SUBJECT,
      topic: markingSchemaData[l].TOPIC,
      // sub_topic: markingSchemaData[l].SUB-TOPIC,
      concept: markingSchemaData[l].CONCEPT,
    };
  }

  return Q;
}

function getSubjects(markingSchemaData) {
  const subjects = [];

  for (let l = 0; l < markingSchemaData.length; l += 1) {
    if (!(markingSchemaData[l].SUBJECT in subjects)) {
      subjects.push(markingSchemaData[l].SUBJECT);
    }
  }

  const uSet = new Set(subjects);
  const uniqueSubjects = Array.from(uSet);
  return uniqueSubjects;
}

export function readFiles(req, res, next) {
  // console.log(req.files);
  const errorReportfile = req.files[0];
  const markingSchemafile = req.files[1]; // file passed from client

  // const meta = req.body; // all other values passed from the client, like name, etc..

  // console.log("files: ", req.files[0]);

  const options = {
    delimiter: ',', // optional
    quote: '"', // optional
  };

  const errorReportFs = fs.readFileSync(errorReportfile.path, {
    encoding: 'utf8',
  });
  const markingSchemaFs = fs.readFileSync(markingSchemafile.path, {
    encoding: 'utf8',
  });

  const errorReportData = csvjson.toObject(errorReportFs, options);
  const markingSchemaData = csvjson.toObject(markingSchemaFs, options);

  req.errorReportData = errorReportData;
  req.markingSchemaData = markingSchemaData;
  req.Qmap = getQmap(markingSchemaData);
  req.subjects = getSubjects(markingSchemaData);
  next();
}

export function createMasterResults(req, res, next) {
  const masterResults = [];
  for (let l = req.errorReportData.length - 1; l >= 0; l -= 1) {
    let result = {};
    result = getStudent(req.errorReportData[l], req.Qmap);
    result.Qmap = req.Qmap;
    result.testName = req.body.testname;
    // result.test_name = req.params.name;
    // result.date = req.params.date;
    // result.test_type = req.params.type;

    // result.test_id = generate_test_id(req.params.name, req.params.date, req.params.type);
    // console.log('section id' + result.sectionId);
    masterResults.push(result);
  }

  req.masterResults = masterResults;
  next();
}

function getCwuAnalysis(questionResponse, Qmap, subjects) {
  const cwu = {};

  Object.keys(subjects).forEach(key => {
    cwu[''.concat(subjects[key], '_C')] = 0;
    cwu[''.concat(subjects[key], '_W')] = 0;
    cwu[''.concat(subjects[key], '_U')] = 0;
    cwu[''.concat(subjects[key], '_ADD')] = 0;
  });

  Object.keys(Qmap).forEach(key => {
    const map = Qmap[key];
    if (questionResponse[key] === 'ADD') {
      cwu[''.concat(map.subject, '_C')] += 1;
    } else {
      cwu[''.concat(map.subject, '_', questionResponse[key])] += 1;
    }
  });

  return cwu;
}

export function cwuAnalysis(req, res, next) {
  for (let l = 0; l < req.masterResults.length; l += 1) {
    req.masterResults[l].cwuAnalysis = getCwuAnalysis(
      req.masterResults[l].questionResponse,
      req.Qmap,
      req.subjects,
    );
  }

  next();
}

function getSubjectMark(questionResponse, Qmap, subjectName) {
  const subjectMark = {};

  let obtainedMarks = 0;
  let totalMarks = 0;

  Object.keys(Qmap).forEach(key => {
    const map = Qmap[key];
    if (map.subject === subjectName) {
      obtainedMarks += parseInt(map[questionResponse[key]], 10);
      totalMarks += parseInt(map.C, 10);
    }
  });

  subjectMark.obtainedMarks = obtainedMarks;
  subjectMark.totalMarks = totalMarks;

  // console.log(subject_mark);

  return subjectMark;
}

export function markAnalysis(req, res, next) {
  for (let l = 0; l < req.masterResults.length; l += 1) {
    const mark = {};
    const overall = {};
    overall.obtainedMarks = 0;
    overall.totalMarks = 0;

    for (let j = 0; j < req.subjects.length; j += 1) {
      const tmp = getSubjectMark(
        req.masterResults[l].questionResponse,
        req.masterResults[l].Qmap,
        req.subjects[j],
      );

      mark[req.subjects[j]] = tmp;
      overall.obtainedMarks += tmp.obtainedMarks;
      overall.totalMarks += tmp.totalMarks;
    }

    mark.overall = overall;
    req.masterResults[l].markAnalysis = mark;
  }

  next();
}

export function rankAnalysis(req, res, next) {
  //  For each subject
  for (let l = 0; l < req.subjects.length; l += 1) {
    // req.subjects[l]
    req.masterResults.sort(
      (a, b) =>
        a.markAnalysis[req.subjects[l]].obtainedMarks -
        b.markAnalysis[req.subjects[l]].obtainedMarks,
    );
    let skip = 1;
    let lastMark =
      req.masterResults[req.masterResults.length - 1].markAnalysis[
        req.subjects[l]
      ].obtainedMarks;

    if (
      req.masterResults[req.masterResults.length - 1].rankAnalysis === undefined
    ) {
      req.masterResults[req.masterResults.length - 1].rankAnalysis = {};
    }

    if (
      req.masterResults[req.masterResults.length - 1].rankAnalysis[
        req.subjects[l]
      ] === undefined
    ) {
      req.masterResults[req.masterResults.length - 1].rankAnalysis[
        req.subjects[l]
      ] = {};
    }

    req.masterResults[req.masterResults.length - 1].rankAnalysis[
      req.subjects[l]
    ].rank = 1;

    let lastRank = 1;

    for (let k = req.masterResults.length - 2; k >= 0; k -= 1) {
      if (req.masterResults[k].rankAnalysis === undefined) {
        req.masterResults[k].rankAnalysis = {};
      }
      if (req.masterResults[k].rankAnalysis[req.subjects[l]] === undefined) {
        req.masterResults[k].rankAnalysis[req.subjects[l]] = {};
      }

      if (
        req.masterResults[k].markAnalysis[req.subjects[l]].obtainedMarks ===
        lastMark
      ) {
        req.masterResults[k].rankAnalysis[req.subjects[l]].rank = lastRank;
        skip += 1;
      } else {
        req.masterResults[k].rankAnalysis[req.subjects[l]].rank =
          lastRank + skip;

        lastMark =
          req.masterResults[k].markAnalysis[req.subjects[l]].obtainedMarks;

        lastRank += skip;
        skip = 1;
      }
    }
  }

  // For Overll mark
  req.masterResults.sort(
    (a, b) =>
      a.markAnalysis.overall.obtainedMarks -
      b.markAnalysis.overall.obtainedMarks,
  );

  let skip = 1;
  let lastMark =
    req.masterResults[req.masterResults.length - 1].markAnalysis.overall
      .obtainedMarks;

  if (
    req.masterResults[req.masterResults.length - 1].rankAnalysis === undefined
  ) {
    req.masterResults[req.masterResults.length - 1].rankAnalysis = {};
  }

  if (
    req.masterResults[req.masterResults.length - 1].rankAnalysis.overall ===
    undefined
  ) {
    req.masterResults[req.masterResults.length - 1].rankAnalysis.overall = {};
  }

  req.masterResults[req.masterResults.length - 1].rankAnalysis.overall.rank = 1;

  let lastRank = 1;

  for (let k = req.masterResults.length - 2; k >= 0; k -= 1) {
    if (req.masterResults[k].rankAnalysis === undefined) {
      req.masterResults[k].rankAnalysis = {};
    }
    if (req.masterResults[k].rankAnalysis.overall === undefined) {
      req.masterResults[k].rankAnalysis.overall = {};
    }

    if (req.masterResults[k].markAnalysis.overall.obtainedMarks === lastMark) {
      req.masterResults[k].rankAnalysis.overall.rank = lastRank;
      skip += 1;
    } else {
      req.masterResults[k].rankAnalysis.overall.rank = lastRank + skip;

      lastMark = req.masterResults[k].markAnalysis.overall.obtainedMarks;

      lastRank += skip;
      skip = 1;
    }
  }

  // Let's go to populate db.
  next();
}
export function createFileDetails(req, res, next) {
  const array = [];
  for (let i = 0; i < 2; ++i) {
    const csvfile = {};
    csvfile.filename = req.files[i].originalname;
    csvfile.testname = req.body.testname;
    csvfile.dateuploaded = new Date();
    csvfile.check = true;
    // allfiles.push(csvfile);
    array.push(csvfile);
  }
  FilesList.create(array, err => {
    if (err) {
      console.error(err);
    }
  });
  // console.log(allfiles);

  next();
}
// export function total(req, res, next){
//   console.log("****************************");
//   console.log(req.masterResults[1].markAnalysis.overall.obtainedMarks);
//     console.log("****************************");
//   next();
// }
// Finally populate to db
export function populateDb(req, res) {
  MasterResult.create(req.masterResults, (err, docs) => {
    if (err) {
      console.error(err);
      res.status(200).send(err);
    } else {
      res.status(200).send(docs);
    }
  });
}

export default {
  readFiles,
  createMasterResults,
  createFileDetails,
  cwuAnalysis,
  markAnalysis,
  rankAnalysis,
  // total,
  populateDb,
};
