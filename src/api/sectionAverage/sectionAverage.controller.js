import MasterResult from '../masterResult/masterResult.model';

export function section(req, res, next) {
  MasterResult.find({}, (err, marks) => {
    const senddata = [];
    const campuses = [];
    const sections = [];
    const finalSec = [];
    let cl = 0;

    const numSec = [];
    const final = [];
    const numberOfStudents = [];
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
        let flagSec = 0;
        let k = 0;
        for (k = 0; k < numSec[j]; k++) {
          if (marks[i].sectionId == senddata[j].section[k].secName) {
            senddata[j].section[k].secTotal +=
              marks[i].markAnalysis.overall.obtainedMarks;
            senddata[j].section[k].secPhysics +=
              marks[i].markAnalysis.Physics.obtainedMarks;
            senddata[j].section[k].secChem +=
              marks[i].markAnalysis.Chemistry.obtainedMarks;
            senddata[j].section[k].secMath +=
              marks[i].markAnalysis.Maths.obtainedMarks;
            senddata[j].campusName = marks[i].campusId;
            senddata[j].section[k].numberOfStudents += 1;
            flagSec = 1;
          }
        }
        if (flagSec == 0) {
          // console.log('j = ' + j);
          // console.log('k = ' + k);
          // console.log(senddata[j]);

          senddata[j].section[k].secTotal +=
            marks[i].markAnalysis.overall.obtainedMarks;
          senddata[j].section[k].secPhysics +=
            marks[i].markAnalysis.Physics.obtainedMarks;
          senddata[j].section[k].secChem +=
            marks[i].markAnalysis.Chemistry.obtainedMarks;
          senddata[j].section[k].secMath +=
            marks[i].markAnalysis.Maths.obtainedMarks;
          // senddata[j].campusName = marks[i].campusId;
          senddata[j].section[k].numberOfStudents = 1;
          senddata[j].section[k].secName += marks[i].sectionId;

          numSec[j] += 1;
        }
      } else {
        campuses[cl] = marks[i].campusId;
        senddata[cl] = {
          campusName: '',
          section: [
            {
              secName: '',
              secTotal: 0,
              secChem: 0,
              secMath: 0,
              secPhysics: 0,
              numberOfStudents: 0,
            },
            {
              secName: '',
              secTotal: 0,
              secChem: 0,
              secMath: 0,
              secPhysics: 0,
              numberOfStudents: 0,
            },
            {
              secName: '',
              secTotal: 0,
              secChem: 0,
              secMath: 0,
              secPhysics: 0,
              numberOfStudents: 0,
            },
            {
              secName: '',
              secTotal: 0,
              secChem: 0,
              secMath: 0,
              secPhysics: 0,
              numberOfStudents: 0,
            },
            {
              secName: '',
              secTotal: 0,
              secChem: 0,
              secMath: 0,
              secPhysics: 0,
              numberOfStudents: 0,
            },
          ],
        };
        cl += 1;
        // senddata[cl-1][0].section.push({secName: marks[i].sectionId, secTotal:)
        senddata[cl - 1].section[0].secName = marks[i].sectionId;

        senddata[cl - 1].section[0].secTotal +=
          marks[i].markAnalysis.overall.obtainedMarks;
        senddata[cl - 1].section[0].secPhysics +=
          marks[i].markAnalysis.Physics.obtainedMarks;
        senddata[cl - 1].section[0].secChem +=
          marks[i].markAnalysis.Chemistry.obtainedMarks;
        senddata[cl - 1].section[0].secMath +=
          marks[i].markAnalysis.Maths.obtainedMarks;
        senddata[cl - 1].campusName = marks[i].campusId;

        //  	senddata[cl-1][0].numberOfStudents = 1;
        numSec[cl - 1] = 1;
      }
    }
    for (let i = 0; i < cl; i++) {
      for (let j = 0; j < numSec[i]; j++) {
        senddata[i].section[j].secTotal /=
          senddata[i].section[j].numberOfStudents;
        senddata[i].section[j].secPhysics /=
          senddata[i].section[j].numberOfStudents;
        senddata[i].section[j].secChem /=
          senddata[i].section[j].numberOfStudents;
        senddata[i].section[j].secMath /=
          senddata[i].section[j].numberOfStudents;
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
    var finalData = [{campus_name: "",section_name: "",total: 0,physics: 0,chemistry: 0,maths: 0,number_of_students: 0}];  
    for (let k = 0; k < test; k++) {
      let l = 1;
      const data = [
        [
          'Campus Name',
          'Section Name',
          'Total Average',
          'Physics Average',
          'Chemistry Average',
          'Maths Average',
        ],
      ];
      data[0] = [
        'Campus Name',
        'Section Name',
        'Total Average',
        'Physics Average',
        'Chemistry Average',
        'Maths Average',
      ];
      

      for (let i = 0; i < cl; i++) {
        finalSec[i] = { campusName: '', sectionData: [] };
        // senddata[i].section.splice(0, 1);
        finalSec[i].campusName = senddata[i].campusName;
        for (let j = 0; j < numSec[i]; j++) {
          finalSec[i].sectionData.push(senddata[i].section[j]);
          //finalData.push({campus_name: finalSec[i].campusName,section_name: senddata[i].section[j].secName,total: Math.round(senddata[i].section[j].secTotal),physics: Math.round(senddata[i].section[j].secPhysics),chemistry: Math.round(senddata[i].section[j].secChem),maths: Math.round(senddata[i].section[j].secMath),number_of_students: senddata[i].section[j].numberOfStudents});
          data[l++] = [
            finalSec[i].campusName,
            senddata[i].section[j].secName,
            Math.round(senddata[i].section[j].secTotal),
            Math.round(senddata[i].section[j].secPhysics),
            Math.round(senddata[i].section[j].secChem),
            Math.round(senddata[i].section[j].secMath),
          ];
        }
      }
      const name = `./csvFiles/${testNames[k]}_Section_Average.csv`;
      csvFile(name, data);
    }
    for (let i = 0; i < cl; i++) 
    {
      for (let j = 0; j < numSec[i]; j++) 
      {
          finalData.push({campus_name: finalSec[i].campusName,section_name: senddata[i].section[j].secName,total: Math.round(senddata[i].section[j].secTotal),physics: Math.round(senddata[i].section[j].secPhysics),chemistry: Math.round(senddata[i].section[j].secChem),maths: Math.round(senddata[i].section[j].secMath),number_of_students: senddata[i].section[j].numberOfStudents});
      }
    }
    finalData.splice(0,1);
    // console.log(finalSec[1] + 'finalsec');
    if (err) {
      console.error(err);
      res.status(200).send(err);
    } else {
      res.status(200).send(finalData);
    }
  });
}

export function sectionToppers(req, res, next) {
  MasterResult.find({}, (err, marks) => {
    const senddata = [];
    const campuses = [];
    const sections = [];
    const finalSec = [];
    let cl = 0;

    const numSec = [];
    const final = [];
    const numberOfStudents = [];
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
        let flagSec = 0;
        let k = 0;
        for (k = 0; k < numSec[j]; k++) {
          if (marks[i].sectionId == senddata[j].section[k].secName) {
            senddata[j].section[k].toppers.push({
              stuTotal: marks[i].markAnalysis.overall.obtainedMarks,
              stuChem: marks[i].markAnalysis.Chemistry.obtainedMarks,
              stuMath: marks[i].markAnalysis.Maths.obtainedMarks,
              stuPhysics: marks[i].markAnalysis.Physics.obtainedMarks,
              stuName: marks[i].name,
            });

            flagSec = 1;
          }
        }
        if (flagSec == 0) {
          senddata[j].section[k].toppers.push({
            stuTotal: marks[i].markAnalysis.overall.obtainedMarks,
            stuChem: marks[i].markAnalysis.Chemistry.obtainedMarks,
            stuMath: marks[i].markAnalysis.Maths.obtainedMarks,
            stuPhysics: marks[i].markAnalysis.Physics.obtainedMarks,
            stuName: marks[i].name,
          });

          senddata[j].section[k].secName = marks[i].sectionId;

          numSec[j] += 1;
        }
      } else {
        campuses[cl] = marks[i].campusId;
        senddata[cl] = {
          campusName: '',
          section: [
            {
              secName: '',
              toppers: [
                {
                  stuTotal: 0,
                  stuChem: 0,
                  stuMath: 0,
                  stuPhysics: 0,
                  stuName: '',
                },
              ],
            },
            {
              secName: '',
              toppers: [
                {
                  stuTotal: 0,
                  stuChem: 0,
                  stuMath: 0,
                  stuPhysics: 0,
                  stuName: '',
                },
              ],
            },
            {
              secName: '',
              toppers: [
                {
                  stuTotal: 0,
                  stuChem: 0,
                  stuMath: 0,
                  stuPhysics: 0,
                  stuName: '',
                },
              ],
            },
            {
              secName: '',
              toppers: [
                {
                  stuTotal: 0,
                  stuChem: 0,
                  stuMath: 0,
                  stuPhysics: 0,
                  stuName: '',
                },
              ],
            },
            {
              secName: '',
              toppers: [
                {
                  stuTotal: 0,
                  stuChem: 0,
                  stuMath: 0,
                  stuPhysics: 0,
                  stuName: '',
                },
              ],
            },
          ],
        };
        cl += 1;
        senddata[cl - 1].campusName = marks[i].campusId;
        senddata[cl - 1].section[0].secName = marks.sectionId;

        senddata[cl - 1].section[0].toppers.push({
          stuTotal: marks[i].markAnalysis.overall.obtainedMarks,
          stuChem: marks[i].markAnalysis.Chemistry.obtainedMarks,
          stuMath: marks[i].markAnalysis.Maths.obtainedMarks,
          stuPhysics: marks[i].markAnalysis.Physics.obtainedMarks,
          stuName: marks[i].name,
        });
        numSec[cl - 1] = 1;
      }
    }
    var finalData = [{campus_name: "",section_name: "",student_name: "",rank: 0,physics: 0,chemistry: 0,maths: 0,total: 0}];  

    for (let i = 0; i < cl; i++) {
      for (let j = 0; j < numSec[i]; j++) {
        senddata[i].section[j].toppers.sort((a, b) => b.stuTotal - a.stuTotal);
      }
    }
    for (let i = 0; i < cl; i++) {
      finalSec[i] = { campusName: '' };
      finalSec[i].campusName = senddata[i].campusName;
      const sectionData = [];
      for (let j = 0; j < numSec[i]; j++) {
        sectionData[j] = [];
        let ptr = 0;
        if (senddata[i].section[j].secName) {
          ptr++;
          sectionData[j].push({
            sectionName: senddata[i].section[j].secName,
            topperDetails: [],
          });
          for (let k = 0; k < 5; k++) {
            sectionData[j][ptr - 1].topperDetails.push(
              senddata[i].section[j].toppers[k],
            );
          }
        }
      }
      finalSec[i].sectionData = sectionData;
      finalSec[i].sectionData.splice(0, 1);
    }
    const testNames = [];
    let test = 0;
    let tflag = 0;
    for (let i = 0; i < marks.length; i++) {
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
        testNames[test] = marks[i].testName;
        test++;
      }
    }
    const csvFile = require('csv-file-creator');
    for (let k = 0; k < test; k++) {
      let l = 1;
      const data = [
        [
          'Campus Name',
          'Section Name',
          'Student Name',
          'Total',
          'Physics',
          'Chemistry',
          'Maths',
          'Rank',
        ],
      ];
      data[0] = [
        'Campus Name',
        'Section Name',
        'Student Name',
        'Total',
        'Physics',
        'Chemistry',
        'Maths',
        'Rank',
      ];
      for (let i = 0; i < cl; i++) {
        for (let j = 0; j < numSec[i] - 1; j++) {
          for (let m = 0; m < 5; m++) {
            data[l++] = [
              finalSec[i].campusName,
              finalSec[i].sectionData[j][0].sectionName,
              finalSec[i].sectionData[j][0].topperDetails[m].stuName,
              finalSec[i].sectionData[j][0].topperDetails[m].stuTotal,
              finalSec[i].sectionData[j][0].topperDetails[m].stuPhysics,
              finalSec[i].sectionData[j][0].topperDetails[m].stuChem,
              finalSec[i].sectionData[j][0].topperDetails[m].stuMath,
              m + 1,
            ];
            if(k == 0)
            finalData.push({campus_name: finalSec[i].campusName,section_name: (finalSec[i].sectionData[j][0].sectionName),
              student_name: (finalSec[i].sectionData[j][0].topperDetails[m].stuName),rank: m+1,physics: Math.round(finalSec[i].sectionData[j][0].topperDetails[m].stuPhysics),
              chemistry: Math.round(finalSec[i].sectionData[j][0].topperDetails[m].stuChem),maths: Math.round(finalSec[i].sectionData[j][0].topperDetails[m].stuMath),total: Math.round(finalSec[i].sectionData[j][0].topperDetails[m].stuTotal)});

          }
        }
      }
      const name = `./csvFiles/${testNames[k]}_Section_Overall_Topper.csv`;
      csvFile(name, data);
    }
    finalData.splice(0,1);
    if (err) {
      console.error(err);
      res.status(200).send(err);
    } else {
      res.status(200).send(finalData);
    }
  });
}

export default {
  section,
  sectionToppers,
};
