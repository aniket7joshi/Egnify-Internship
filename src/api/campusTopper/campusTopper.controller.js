import MasterResult from '../masterResult/masterResult.model';

export function topper(req, res, next) {
  MasterResult.find({}, (err, marks) => {
    const senddata = [];
    const campuses = [];
    const numberOfStudents = [];
    let cl = 0;
    const final = [];
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
        senddata[j].physics.push({
          marks: marks[i].markAnalysis.Physics.obtainedMarks,
          name: marks[i].name,
        });
        senddata[j].chemistry.push({
          marks: marks[i].markAnalysis.Chemistry.obtainedMarks,
          name: marks[i].name,
        });
        senddata[j].maths.push({
          marks: marks[i].markAnalysis.Maths.obtainedMarks,
          name: marks[i].name,
        });
      } else {
        campuses[cl] = marks[i].campusId;
        cl += 1;
        senddata[j] = {
          Name: '',
          physics: [{ marks: [], name: '' }],
          chemistry: [{ marks: [], name: '' }],
          maths: [{ marks: [], name: '' }],
        };
        senddata[j].Name = marks[i].campusId;
        senddata[j].physics.push({
          marks: marks[i].markAnalysis.Physics.obtainedMarks,
          name: marks[i].name,
        });
        senddata[j].chemistry.push({
          marks: marks[i].markAnalysis.Chemistry.obtainedMarks,
          name: marks[i].name,
        });
        senddata[j].maths.push({
          marks: marks[i].markAnalysis.Maths.obtainedMarks,
          name: marks[i].name,
        });
      }
    }
    var finalData = [{campus_name: "",student_name: "",subject: "",marks: 0}];  
    for (let i = 0; i < cl; i++) {
      final[i] = { campusName: '', physics: [], chemistry: [], maths: [] };
      final[i].campusName = campuses[i];
      senddata[i].physics.sort((a, b) => a.marks - b.marks);
      senddata[i].chemistry.sort((a, b) => a.marks - b.marks);
      senddata[i].maths.sort((a, b) => a.marks - b.marks);
      let k = 0;
      for (let j = senddata[i].physics.length - 1;j >= senddata[i].physics.length - 5;j--) 
      {
        final[i].physics[k] = senddata[i].physics[j];
        final[i].chemistry[k] = senddata[i].chemistry[j];
        final[i].maths[k] = senddata[i].maths[j];
        finalData.push({campus_name : campuses[i] ,student_name: senddata[i].physics[j].name,subject: "Physics",marks: senddata[i].physics[j].marks});
        k++;
      }
      for (let j = senddata[i].physics.length - 1;j >= senddata[i].physics.length - 5;j--) 
      {
        finalData.push({campus_name : campuses[i],student_name: senddata[i].chemistry[j].name,subject: "Chemistry",marks: senddata[i].chemistry[j].marks});
      }
      for (let j = senddata[i].physics.length - 1;j >= senddata[i].physics.length - 5;j--) 
      {
        finalData.push({campus_name : campuses[i],student_name: senddata[i].maths[j].name,subject: "Mathematics",marks: senddata[i].maths[j].marks});
      }

      // console.log(finalData);
    }
    finalData.splice(0,1);
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
    const csvFile = require('csv-file-creator');
    for (let k = 0; k < test; k++) {
      let l = 1;
      const data = [
        ['Campus Name', 'Name', 'Subject', 'Subject Rank', 'Subject Marks'],
      ];
      data[0] = [
        'Campus Name',
        'Name',
        'Subject',
        'Subject Rank',
        'Subject Marks',
      ];
      for (let i = 0; i < cl; i++) {
        for (let j = 0; j < 5; j++) {
          data[l++] = [
            final[i].campusName,
            final[i].physics[j].name,
            'Physics',
            j + 1,
            final[i].physics[j].marks,
          ];
        }
        for (let j = 0; j < 5; j++) {
          data[l++] = [
            final[i].campusName,
            final[i].chemistry[j].name,
            'Chemistry',
            j + 1,
            final[i].chemistry[j].marks,
          ];
        }
        for (let j = 0; j < 5; j++) {
          data[l++] = [
            final[i].campusName,
            final[i].maths[j].name,
            'Maths',
            j + 1,
            final[i].maths[j].marks,
          ];
        }
      }
      const name = `./csvFiles/${testNames[k]}_Campus_Subject_Topper.csv`;
      csvFile(name, data);
    }

    if (err) {
      console.error(err);
      res.status(200).send(err);
    } else {
      // console.log(final);
      res.status(200).send(finalData);
    }
  });
}
export function campusTopper(req, res, next) {
  MasterResult.find({}, (err, marks) => {
    const senddata = [];
    const campuses = [];
    const numberOfStudents = [];
    let cl = 0;
    const final = [];
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
        senddata[j].total.push({
          name: marks[i].name,
          marks: marks[i].markAnalysis.overall.obtainedMarks,
          physics: marks[i].markAnalysis.Physics.obtainedMarks,
          chemistry: marks[i].markAnalysis.Chemistry.obtainedMarks,
          maths: marks[i].markAnalysis.Maths.obtainedMarks,
        });
      } else {
        campuses[cl] = marks[i].campusId;
        cl += 1;
        senddata[j] = {
          Name: '',
          total: [
            { name: '', marks: [], physics: '', chemistry: '', maths: '' },
          ],
        };
        senddata[j].Name = marks[i].campusId;
        senddata[j].total.push({
          name: marks[i].name,
          marks: marks[i].markAnalysis.overall.obtainedMarks,
          physics: marks[i].markAnalysis.Physics.obtainedMarks,
          chemistry: marks[i].markAnalysis.Chemistry.obtainedMarks,
          maths: marks[i].markAnalysis.Maths.obtainedMarks,
        });
      }
    }
    var finalData = [{campus_name: "",student_name: "",rank: 0,physics: 0,chemistry: 0,maths: 0,total: 0}];  
    for (let i = 0; i < cl; i++) {
      final[i] = { campusName: '', topper: [{ rank: '', total: '' }] };
      final[i].campusName = campuses[i];
      senddata[i].total.sort((a, b) => b.marks - a.marks);
      let k = 0;
      final[i].topper.pop();
      for (let j = 0; j < 5; j++) {
        final[i].topper.push({ rank: j + 1, total: senddata[i].total[j] });
        k++;
        finalData.push({campus_name: campuses[i],student_name: final[i].topper[j].total.name,rank: j+1,physics: final[i].topper[j].total.physics, chemistry: final[i].topper[j].total.chemistry,maths: final[i].topper[j].total.maths,total: final[i].topper[j].total.marks})
      }
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
    const csvFile = require('csv-file-creator');
    for (let k = 0; k < test; k++) {
      let l = 1;
      const data = [
        [
          'Campus Name',
          'Rank',
          'Name',
          'Total Marks',
          'Physics Marks',
          'Chemistry Marks',
          'Maths Marks',
        ],
      ];
      data[0] = [
        'Campus Name',
        'Rank',
        'Name',
        'Total Marks',
        'Physics Marks',
        'Chemistry Marks',
        'Maths Marks',
      ];
      for (let i = 0; i < cl; i++) {
        for (let j = 0; j < 5; j++) {
          data[l++] = [
            final[i].campusName,
            final[i].topper[j].rank,
            final[i].topper[j].total.name,
            final[i].topper[j].total.marks,
            final[i].topper[j].total.physics,
            final[i].topper[j].total.chemistry,
            final[i].topper[j].total.maths,
          ];
        }
      }
      const name = `./csvFiles/${testNames[k]}_Campus_Topper.csv`;
      csvFile(name, data);
    }
    finalData.splice(0,1);
    if (err) {
      console.error(err);
      res.status(200).send(err);
    } else {
      // console.log(final);
      res.status(200).send(finalData);
    }
  });
}
export default {
  topper,
  campusTopper,
};
