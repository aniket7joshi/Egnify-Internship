import MasterResult from '../masterResult/masterResult.model';

const csvfile = require('csv-file-creator');

export function total(req, res, next) {
  MasterResult.find({}, (err, marks) => {
    const averageMarks = { total: 0, physics: 0, chemistry: 0, maths: 0 };
    console.log(averageMarks);
    for (let i = 0; i < marks.length; i++) {
      averageMarks.total += marks[i].markAnalysis.overall.obtainedMarks;
      averageMarks.maths += marks[i].markAnalysis.Maths.obtainedMarks;
      averageMarks.chemistry += marks[i].markAnalysis.Chemistry.obtainedMarks;
      averageMarks.physics += marks[i].markAnalysis.Physics.obtainedMarks;
    }
    averageMarks.total /= marks.length;
    averageMarks.maths /= marks.length;
    averageMarks.physics /= marks.length;
    averageMarks.chemistry /= marks.length;
    const csvfile = require('csv-file-creator');
    const testNames = [];
    let test = 0;
    let tflag = 0;
    for (let i = 0; i < marks.length; i++) {
      // console.log("Hello");
      tflag = 0;
      for (let j = 0; j < test; j++) {
        if (marks[i].testName == testNames[j]) {
          tflag = 1;
          break;
        } else {
          continue;
        }
      }
      if (!tflag) {
        // console.log("2nd if");
        testNames[test] = marks[i].testName;
        test++;
        // console.log('test' + test);
      }
    }
    for (let j = 0; j < test; j++) {
      const data = [
        [
          'Total Average',
          'Physics Average',
          'Chemistry Average',
          'Mathematics Average',
        ],
      ];
      data[0] = [
        'Total Average',
        'Physics Average',
        'Chemistry Average',
        'Mathematics Average',
      ];
      data[1] = [
        Math.round(averageMarks.total),
        Math.round(averageMarks.physics),
        Math.round(averageMarks.chemistry),
        Math.round(averageMarks.maths),
      ];
      const name = `./csvFiles/${testNames[j]}_Overall_Average.csv`;
      // console.log(data[1]);
      csvfile(name, data);
    }
    var arr = [];
    arr.push(averageMarks);
    if (err) {
      console.error(err);
      res.status(200).send(err);
    } else {
      res.status(200).send(arr);
    }
  });
}
export function campus(req, res, next) {
  MasterResult.find({}, (err, marks) => {
    const senddata = [];
    const campuses = [];
    let cl = 0;
    const final = [];
    const numberOfStudents = [];
    const csvFile = require('csv-file-creator');
    const students = [];
    let stucount = 0;
    for (let i = 0; i < marks.length; i++) {
      let flagstu = 0;
      for (let p = 0; p < stucount; p++) {
        if (marks[i].rollNumber == students[p]) {
          flagstu = 1;
          break;
        } else {
          continue;
        }
      }
      if (flagstu == 1) {
        continue;
      }
      students[stucount++] = marks[i].rollNumber;
      let flag = 0;
      let j = 0;
      for (j = 0; j < cl; j++) {
        if (campuses[j] == marks[i].campusId) {
          flag = 1;
          break;
        } else {
          continue;
        }
      }
      if (flag == 1) {
        numberOfStudents[j] += 1;
        senddata[j].total += marks[i].markAnalysis.overall.obtainedMarks;
        senddata[j].physics += marks[i].markAnalysis.Physics.obtainedMarks;
        senddata[j].chemistry += marks[i].markAnalysis.Chemistry.obtainedMarks;
        senddata[j].maths += marks[i].markAnalysis.Maths.obtainedMarks;
        senddata[j].name = marks[i].campusId;
      } else {
        campuses[cl] = marks[i].campusId;
        numberOfStudents[j] = 1;
        senddata[j] = { total: 0, physics: 0, chemistry: 0, maths: 0 };
        cl += 1;
        senddata[j].total += marks[i].markAnalysis.overall.obtainedMarks;
        senddata[j].physics += marks[i].markAnalysis.Physics.obtainedMarks;
        senddata[j].chemistry += marks[i].markAnalysis.Chemistry.obtainedMarks;
        senddata[j].maths += marks[i].markAnalysis.Maths.obtainedMarks;
        senddata[j].name = marks[i].campusId;
      }
    }

    for (let i = 0; i < cl; i++) {
      // console.log(senddata[i]);
      // console.log(numberOfStudents[i]);
      final[i] = { total: 0, physics: 0, chemistry: 0, maths: 0, campus_name: 'test' };
      final[i].total = senddata[i].total / numberOfStudents[i];
      final[i].physics = senddata[i].physics / numberOfStudents[i];
      final[i].chemistry = senddata[i].chemistry / numberOfStudents[i];
      final[i].maths = senddata[i].maths / numberOfStudents[i];
      final[i].campus_name = campuses[i];
      // console.log(final[i]);
    }
    const testNames = [];
    let test = 0;
    let tflag = 0;
    for (let i = 0; i < marks.length; i++) {
      // console.log("Hello");
      tflag = 0;
      for (let j = 0; j < test; j++) {
        if (marks[i].testName == testNames[j]) {
          tflag = 1;
          break;
        } else {
          continue;
        }
      }
      if (!tflag) {
        // console.log("2nd if");
        testNames[test] = marks[i].testName;
        test++;
        // console.log('test' + test);
      }
    }

    // console.log(testNames[0]);
    for (let j = 0; j < test; j++) {
      const data = [
        [
          'Campus Name',
          'Total Average',
          'Physics Average',
          'Chemistry Average',
          'Mathematics Average',
        ],
      ];
      data[0] = [
        'Campus Name',
        'Total Average',
        'Physics Average',
        'Chemistry Average',
        'Mathematics Average',
      ];
      console.log('Hello');
      for (let i = 0; i < cl; i++) {
        data[i + 1] = [
          campuses[i],
          final[i].total,
          final[i].physics,
          final[i].chemistry,
          final[i].maths,
        ];
      }
      const name = `./csvFiles/${testNames[j]}_Campus_Average.csv`;
      csvFile(name, data);
    }
    if (err) {
      console.error(err);
      res.status(200).send(err);
    } else {
      res.status(200).send(final);
    }
  });
}
export default {
  total,
  campus,
};
