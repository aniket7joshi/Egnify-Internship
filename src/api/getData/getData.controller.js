import MasterResult from '../masterResult/masterResult.model';

export function allData(marks) {
  const senddata = {
    physics: { correct: 0, incorrect: 0, unattempted: 0 },
    chemistry: { correct: 0, incorrect: 0, unattempted: 0 },
    maths: { correct: 0, incorrect: 0, unattempted: 0 },
  };
  for (let i = 0; i < marks.length; i++) {
    senddata.physics.correct += marks[i].cwuAnalysis.Physics_C;
    senddata.physics.incorrect += marks[i].cwuAnalysis.Physics_W;
    senddata.physics.unattempted += marks[i].cwuAnalysis.Physics_U;
    senddata.chemistry.correct += marks[i].cwuAnalysis.Chemistry_C;
    senddata.chemistry.incorrect += marks[i].cwuAnalysis.Chemistry_W;
    senddata.chemistry.unattempted += marks[i].cwuAnalysis.Chemistry_U;
    senddata.maths.correct += marks[i].cwuAnalysis.Maths_C;
    senddata.maths.incorrect += marks[i].cwuAnalysis.Maths_W;
    senddata.maths.unattempted += marks[i].cwuAnalysis.Maths_U;
  }
  const finalData = [{ value: 0, name: '', group: '' }];
  finalData.push({
    value: Math.round(senddata.physics.correct / marks.length),
    name: 'Correct',
    group: 'Physics',
  });
  finalData.push({
    value: Math.round(senddata.physics.incorrect / marks.length),
    name: 'Incorrect',
    group: 'Physics',
  });
  finalData.push({
    value: Math.round(senddata.physics.unattempted / marks.length),
    name: 'Unattempted',
    group: 'Physics',
  });
  finalData.push({
    value: Math.round(senddata.chemistry.correct / marks.length),
    name: 'Correct',
    group: 'Chemistry',
  });
  finalData.push({
    value: Math.round(senddata.chemistry.incorrect / marks.length),
    name: 'Incorrect',
    group: 'Chemistry',
  });
  finalData.push({
    value: Math.round(senddata.chemistry.unattempted / marks.length),
    name: 'Unattempted',
    group: 'Chemistry',
  });
  finalData.push({
    value: Math.round(senddata.maths.correct / marks.length),
    name: 'Correct',
    group: 'Maths',
  });
  finalData.push({
    value: Math.round(senddata.maths.incorrect / marks.length),
    name: 'Incorrect',
    group: 'Maths',
  });
  finalData.push({
    value: Math.round(senddata.maths.unattempted / marks.length),
    name: 'Unattempted',
    group: 'Maths',
  });
  finalData.splice(0, 1);
  return finalData;
}
export function campusData(campusName, marks) {
  const senddata = {
    physics: { correct: 0, incorrect: 0, unattempted: 0 },
    chemistry: { correct: 0, incorrect: 0, unattempted: 0 },
    maths: { correct: 0, incorrect: 0, unattempted: 0 },
  };
  let count = 0;
  for (let i = 0; i < marks.length; i++) {
    if (marks[i].campusId === campusName) {
      senddata.physics.correct += marks[i].cwuAnalysis.Physics_C;
      senddata.physics.incorrect += marks[i].cwuAnalysis.Physics_W;
      senddata.physics.unattempted += marks[i].cwuAnalysis.Physics_U;
      senddata.chemistry.correct += marks[i].cwuAnalysis.Chemistry_C;
      senddata.chemistry.incorrect += marks[i].cwuAnalysis.Chemistry_W;
      senddata.chemistry.unattempted += marks[i].cwuAnalysis.Chemistry_U;
      senddata.maths.correct += marks[i].cwuAnalysis.Maths_C;
      senddata.maths.incorrect += marks[i].cwuAnalysis.Maths_W;
      senddata.maths.unattempted += marks[i].cwuAnalysis.Maths_U;
      count++;
    }
  }
  const finalData = [{ value: 0, name: '', group: '' }];
  finalData.push({
    value: Math.round(senddata.physics.correct / count),
    name: 'Correct',
    group: 'Physics',
  });
  finalData.push({
    value: Math.round(senddata.physics.incorrect / count),
    name: 'Incorrect',
    group: 'Physics',
  });
  finalData.push({
    value: Math.round(senddata.physics.unattempted / count),
    name: 'Unattempted',
    group: 'Physics',
  });
  finalData.push({
    value: Math.round(senddata.chemistry.correct / count),
    name: 'Correct',
    group: 'Chemistry',
  });
  finalData.push({
    value: Math.round(senddata.chemistry.incorrect / count),
    name: 'Incorrect',
    group: 'Chemistry',
  });
  finalData.push({
    value: Math.round(senddata.chemistry.unattempted / count),
    name: 'Unattempted',
    group: 'Chemistry',
  });
  finalData.push({
    value: Math.round(senddata.maths.correct / count),
    name: 'Correct',
    group: 'Maths',
  });
  finalData.push({
    value: Math.round(senddata.maths.incorrect / count),
    name: 'Incorrect',
    group: 'Maths',
  });
  finalData.push({
    value: Math.round(senddata.maths.unattempted / count),
    name: 'Unattempted',
    group: 'Maths',
  });
  console.log(count);
  finalData.splice(0, 1);
  return finalData;
}
export function sectionData(sectionName, campusName, marks) {
  const senddata = {
    physics: { correct: 0, incorrect: 0, unattempted: 0 },
    chemistry: { correct: 0, incorrect: 0, unattempted: 0 },
    maths: { correct: 0, incorrect: 0, unattempted: 0 },
  };
  let count = 0;
  for (let i = 0; i < marks.length; i++) {
    if (
      marks[i].sectionId === sectionName &&
      marks[i].campusId === campusName
    ) {
      senddata.physics.correct += marks[i].cwuAnalysis.Physics_C;
      senddata.physics.incorrect += marks[i].cwuAnalysis.Physics_W;
      senddata.physics.unattempted += marks[i].cwuAnalysis.Physics_U;
      senddata.chemistry.correct += marks[i].cwuAnalysis.Chemistry_C;
      senddata.chemistry.incorrect += marks[i].cwuAnalysis.Chemistry_W;
      senddata.chemistry.unattempted += marks[i].cwuAnalysis.Chemistry_U;
      senddata.maths.correct += marks[i].cwuAnalysis.Maths_C;
      senddata.maths.incorrect += marks[i].cwuAnalysis.Maths_W;
      senddata.maths.unattempted += marks[i].cwuAnalysis.Maths_U;
      count++;
    }
  }
  const finalData = [{ value: 0, name: '', group: '' }];
  finalData.push({
    value: Math.round(senddata.physics.correct / count),
    name: 'Correct',
    group: 'Physics',
  });
  finalData.push({
    value: Math.round(senddata.physics.incorrect / count),
    name: 'Incorrect',
    group: 'Physics',
  });
  finalData.push({
    value: Math.round(senddata.physics.unattempted / count),
    name: 'Unattempted',
    group: 'Physics',
  });
  finalData.push({
    value: Math.round(senddata.chemistry.correct / count),
    name: 'Correct',
    group: 'Chemistry',
  });
  finalData.push({
    value: Math.round(senddata.chemistry.incorrect / count),
    name: 'Incorrect',
    group: 'Chemistry',
  });
  finalData.push({
    value: Math.round(senddata.chemistry.unattempted / count),
    name: 'Unattempted',
    group: 'Chemistry',
  });
  finalData.push({
    value: Math.round(senddata.maths.correct / count),
    name: 'Correct',
    group: 'Maths',
  });
  finalData.push({
    value: Math.round(senddata.maths.incorrect / count),
    name: 'Incorrect',
    group: 'Maths',
  });
  finalData.push({
    value: Math.round(senddata.maths.unattempted / count),
    name: 'Unattempted',
    group: 'Maths',
  });
  console.log(count);
  finalData.splice(0, 1);
  return finalData;
}
export function studentData(studentName, marks) {
  const senddata = {
    physics: { correct: 0, incorrect: 0, unattempted: 0 },
    chemistry: { correct: 0, incorrect: 0, unattempted: 0 },
    maths: { correct: 0, incorrect: 0, unattempted: 0 },
  };
  const count = 1;
  for (let i = 0; i < marks.length; i++) {
    if (marks[i].name === studentName) {
      senddata.physics.correct = marks[i].cwuAnalysis.Physics_C;
      senddata.physics.incorrect = marks[i].cwuAnalysis.Physics_W;
      senddata.physics.unattempted = marks[i].cwuAnalysis.Physics_U;
      senddata.chemistry.correct = marks[i].cwuAnalysis.Chemistry_C;
      senddata.chemistry.incorrect = marks[i].cwuAnalysis.Chemistry_W;
      senddata.chemistry.unattempted = marks[i].cwuAnalysis.Chemistry_U;
      senddata.maths.correct = marks[i].cwuAnalysis.Maths_C;
      senddata.maths.incorrect = marks[i].cwuAnalysis.Maths_W;
      senddata.maths.unattempted = marks[i].cwuAnalysis.Maths_U;
      break;
    }
  }
  const finalData = [{ value: 0, name: '', group: '' }];
  finalData.push({
    value: Math.round(senddata.physics.correct / count),
    name: 'Correct',
    group: 'Physics',
  });
  finalData.push({
    value: Math.round(senddata.physics.incorrect / count),
    name: 'Incorrect',
    group: 'Physics',
  });
  finalData.push({
    value: Math.round(senddata.physics.unattempted / count),
    name: 'Unattempted',
    group: 'Physics',
  });
  finalData.push({
    value: Math.round(senddata.chemistry.correct / count),
    name: 'Correct',
    group: 'Chemistry',
  });
  finalData.push({
    value: Math.round(senddata.chemistry.incorrect / count),
    name: 'Incorrect',
    group: 'Chemistry',
  });
  finalData.push({
    value: Math.round(senddata.chemistry.unattempted / count),
    name: 'Unattempted',
    group: 'Chemistry',
  });
  finalData.push({
    value: Math.round(senddata.maths.correct / count),
    name: 'Correct',
    group: 'Maths',
  });
  finalData.push({
    value: Math.round(senddata.maths.incorrect / count),
    name: 'Incorrect',
    group: 'Maths',
  });
  finalData.push({
    value: Math.round(senddata.maths.unattempted / count),
    name: 'Unattempted',
    group: 'Maths',
  });
  console.log(count);
  finalData.splice(0, 1);
  return finalData;
}
export function fetchData(req, res, next) {
  console.dir(req);
  MasterResult.find({}, (err, marks) => {
    const senddata = [];
    const campuses = [];
    const sections = [];
    const finalSec = [];
    const data = [];
    const cl = 0;

    const numSec = [];
    const final = [];
    const numberOfStudents = [];
    let finalData;
    if (!req.query.campus) {
      finalData = allData(marks);
    } else if (!req.query.section) {
      const campus = req.query.campus;
      finalData = campusData(campus, marks);
    } else if (!req.query.student) {
      const sectionName = req.query.section;
      const campusName = req.query.campus;
      finalData = sectionData(sectionName, campusName, marks);
    } else {
      const student_name = req.query.student;
      finalData = studentData(student_name, marks);
    }
    if (err) {
      console.error(err);
      res.status(200).send(err);
    } else {
      res.status(200).send(finalData);
    }
  });
}
export default {
  fetchData,
  allData,
  campusData,
  sectionData,
  studentData,
};
