import MasterResult from '../masterResult/masterResult.model';

export function data(req, res, next) {
  MasterResult.find({}, (err, marks) => {
    const senddata = [];
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
      senddata.push({campus_name: marks[i].campusId, section_name:marks[i].sectionId, student_name: marks[i].name, student_roll_number:marks[i].rollNumber});
    }
    if (err) {
      console.error(err);
      res.status(200).send(err);
    } else {
      // console.log(final);
      res.status(200).send(senddata);
    }
  });
}
export default {
  data,
}