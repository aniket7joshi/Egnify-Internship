import FilesList from './filesList.model';

export function getList(req, res) {
  FilesList.find({}, (err, docs) => {
    const a = [];
    console.log(docs.length);
    for (let i = 0; i < docs.length; i += 2) {
      const files = { testname: '', date: '', check: '' };
      files.testname = docs[i].testname;
      // files.filename = docs[i].filename;
      // console.log(i);
      files.date = docs[i].dateuploaded.toLocaleDateString();
      files.check = true;
      a.push(files);
      // console.log(files.date);
    }

    const senddata = { filedetails: a, allResults: [] };
    senddata.allResults.push([
      'Overall Average across all Campuses',
      '/api/overAllAverages/total',
    ]);
    senddata.allResults.push([
      'Overall Average across a particular Campus',
      '/api/overAllAverages/campus',
    ]);
    senddata.allResults.push([
      'Subject topper across a particular Campus',
      '/api/campusToppers/topper',
    ]);
    senddata.allResults.push([
      'Overall topper across a particular Campus',
      '/api/campusToppers/campusTopper',
    ]);
    senddata.allResults.push([
      'Overall Average across a particular Section',
      '/api/sectionAverages/section',
    ]);
    senddata.allResults.push([
      'Overall topper across a particular Section',
      '/api/sectionAverages/sectionToppers',
    ]);
    if (err) {
      console.error(err);
      res.status(200).send(err);
    } else {
      res.status(200).send(senddata);
    }
  });
}

export default {
  getList,
};
//
