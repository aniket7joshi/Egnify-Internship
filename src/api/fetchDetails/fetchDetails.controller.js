import MasterResult from '../masterResult/masterResult.model';

export function getAllCampuses(marks) {
  const campuses = [];
  let cl = 0;
  for (let i = 0; i < marks.length; i++) {
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
    } else {
      campuses[cl] = marks[i].campusId;
      cl += 1;
    }
  }
  // for (let i = 0;i<campuses.length;i++)
  // {
  // 	console.log(campuses[i] + 'inside campuses');
  // }
  return campuses;
}
export function getAllSections(campus, marks) {
  let numSec = 0;
  const sections = [];
  for (let i = 0; i < marks.length; i++) {
    let flag = 0;
    if (marks[i].campusId == campus) {
      flag = 1;
    } else {
      continue;
    }
    if (flag == 1) {
      let flagSec = 0;
      let k = 0;
      for (k = 0; k < numSec; k++) {
        if (marks[i].sectionId == sections[k]) {
          flagSec = 1;
          break;
        }
      }
      if (flagSec == 0) {
        sections[numSec] = marks[i].sectionId;
        numSec += 1;
      }
    }
  }
  // sections.shift();
  //    for(let i = 0;i<sections.length;i++)
  // {
  // 	console.log(sections[i] + 'inside function');
  // }
  return sections;
}
export function getStudentNames(campus, section, marks) {
  let numStu = 0;
  const students = [];
  for (let i = 0; i < marks.length; i++) {
    let flag = 0;
    if (marks[i].campusId == campus && marks[i].sectionId == section) {
      flag = 1;
    } else {
      continue;
    }
    if (flag == 1) {
      let flagStu = 0;
      let k = 0;
      for (k = 0; k < numStu; k++) {
        if (marks[i].rollNumber == students[k]) {
          flagStu = 1;
          break;
        }
      }
      if (flagStu == 0) {
        students[numStu] = marks[i].rollNumber;
        numStu += 1;
      }
    }
  }
  // students.shift();
  for (let i = 0; i < students.length; i++) {
    console.log(`${students[i]}inside function`);
  }
  return students;
}
export function getStudentDetails(roll, marks) {
  const studentDetails = { rollNumber: '', name: '', campus: '', section: '' };

  for (let i = 0; i < marks.length; i++) {
    if (marks[i].rollNumber == roll) {
      studentDetails.rollNumber = marks[i].rollNumber;
      studentDetails.name = marks[i].name;
      studentDetails.campus = marks[i].campusId;
      studentDetails.section = marks[i].sectionId;
    }
  }
  // console.log('inside function' + studentDetails.campus);
  return studentDetails;
}
export function data(req, res, next) {
  MasterResult.find({}, (err, marks) => {
    const allData = {
      campuses: [],
      sections: [],
      students: [],
      studentDetails: { rollNumber: '', name: '', campus: '', section: '' },
    };
    if (!req.body.campus) {
      // campus name is NULL
      allData.campuses = getAllCampuses(marks);
      // for(let i = 0;i<allData.campuses.length;i++)
      // {
      // 	console.log(allData.campuses[i]);
      // }
    } else if (!req.body.section) {
      // campus name is not NULL and section name is NULL
      var campus = req.body.campus;
      allData.sections = getAllSections(campus, marks);
      // for(let i = 0;i<allData.sections.length;i++)
      // {
      // 	console.log(allData.sections[i]);
      // }
    } else if (!req.body.rollno) {
      // campus name and section name are both not null and student roll number is null
      var campus = req.body.campus;
      const section = req.body.section;
      allData.students = getStudentNames(campus, section, marks);
    } else {
      const roll = req.body.roll;
      allData.studentDetails = getStudentDetails(roll, marks);
      // console.log('inside main' + allData.studentDetails.campus);
    }
    if (err) {
      console.error(err);
      res.status(200).send(err);
    } else {
      res.status(200).send(allData);
    }
  });
}

export default {
  data,
  getAllCampuses,
  getAllSections,
};
