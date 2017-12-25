/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/students              ->  index
 * POST    /api/students              ->  create
 * GET     /api/students/:id          ->  show
 * PUT     /api/students/:id          ->  upsert
 * PATCH   /api/students/:id          ->  patch
 * DELETE  /api/students/:id          ->  destroy
 */

import AllIndiaMarksAnalysisReport from './allIndiaMarksAnalysisReport.model';
import MasterResult from '../masterResult/masterResult.model';

// Gets a list of Students
export function getAllIndiaMarksAnalysisReport(req, res) {
  AllIndiaMarksAnalysisReport.find({}, (err, docs) => {
    res.status(200).send(docs);
  });
}

// {
//   $match: {
//     testId: test,
//     academicYear: year,
//   },
// },
export function generateAllIndiaMarksAnalysisReport(test, year) {
  MasterResult.aggregate([
    {
      $project: {
        rollNumber: '$rollNumber',
        name: '$name',
        campusId: '$campusId',
        phyMarks120: '$markAnalysis.Physics.obtainedMarks',
        cheMarks120: '$markAnalysis.Chemistry.obtainedMarks',
        matMarks120: '$markAnalysis.Maths.obtainedMarks',

        phyRank: '$rankAnalysis.Physics.rank',
        cheRank: '$rankAnalysis.Chemistry.rank',
        matRank: '$rankAnalysis.Maths.rank',

        overallMarks: '$markAnalysis.overall.obtainedMarks',
        overallRank: '$rankAnalysis.overall.rank',
      },
    },
  ]).exec((err, docs) => {
    AllIndiaMarksAnalysisReport.create(
      { testId: test, academicYear: year, reports: docs },
      (rerr, rdocs) => {
        if (rerr) {
          console.error(rerr);
        } else {
          console.error('Report Generated', rdocs.length);
        }
      },
    );
  });
}
export default {
  getAllIndiaMarksAnalysisReport,
  generateAllIndiaMarksAnalysisReport,
};
