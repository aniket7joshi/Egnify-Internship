export function campus(req, res, next) {
  MasterResult.find({}, (err, marks) => {
    const averageMarks = { total: 0, physics: 0, chemistry: 0, maths: 0 };
    const senddata = [];
    const campuses = [];
    let cl = 0;
    const final = [];
    const numberOfStudents = [];
    for (let i = 0; i < marks.length; i++) {
      let flag = 0;
      let j = 0;
      for (j = 0; j < cl; j++) {
        if (campuses[j] == marks.campusId) {
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
        campuses[cl] = marks.campusId;
        senddata[j] = { total: 0, physics: 0, chemistry: 0, maths: 0 };
        cl++;
        numberOfStudents[j] += 1;
        senddata[j].total += marks[i].markAnalysis.overall.obtainedMarks;
        senddata[j].physics += marks[i].markAnalysis.Physics.obtainedMarks;
        senddata[j].chemistry += marks[i].markAnalysis.Chemistry.obtainedMarks;
        senddata[j].maths += marks[i].markAnalysis.Maths.obtainedMarks;
        senddata[j].name = marks[i].campusId;
      }
    }
    for (let i = 0; i < cl; i++) {
      final[i] = { total: 0, physics: 0, chemistry: 0, maths: 0, name: '' };
      final[i].total = senddata[i].total / numberOfStudents[i];
      final[i].physics = senddata[i].physics / numberOfStudents[i];
      final[i].chemistry = senddata[i].chemistry / numberOfStudents[i];
      final[i].maths = senddata[i].maths / numberOfStudents[i];
      final[i].name = campuses[i];
    }
    if (err) {
      console.error(err);
      res.status(200).send(err);
    } else {
      res.status(200).send(final);
    }
  });
}
