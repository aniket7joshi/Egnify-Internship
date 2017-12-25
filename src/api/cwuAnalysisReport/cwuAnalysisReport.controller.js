/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/students              ->  index
 * POST    /api/students              ->  create
 * GET     /api/students/:id          ->  show
 * PUT     /api/students/:id          ->  upsert
 * PATCH   /api/students/:id          ->  patch
 * DELETE  /api/students/:id          ->  destroy
 */

import CWUAnalysisReport from './cwuAnalysisReport.model';
import MasterResult from '../masterResult/masterResult.model';

// Gets a list of Students
export function getCWUAnalysisReport(req, res) {
  CWUAnalysisReport.find({}, (err, docs) => {
    res.status(200).send(docs);
  });
}

// {
//   $match: {
//     testId: test,
//     academicYear: year,
//   },
// },
export function generateCWUAnalysisReport(test, year) {
  MasterResult.aggregate([
    {
      $project: {
        rollNumber: '$rollNumber',
        name: '$name',
        campusId: '$campusId',
        Physics_C: '$cwuAnalysis.Physics_C',
        Physics_W: '$cwuAnalysis.Physics_W',
        Physics_U: '$cwuAnalysis.Physics_U',

        Chemistry_C: '$cwuAnalysis.Chemistry_C',
        Chemistry_W: '$cwuAnalysis.Chemistry_W',
        Chemistry_U: '$cwuAnalysis.Chemistry_U',

        Maths_C: '$cwuAnalysis.Maths_C',
        Maths_W: '$cwuAnalysis.Maths_W',
        Maths_U: '$cwuAnalysis.Maths_U',
      },
    },
  ]).exec((err, docs) => {
    CWUAnalysisReport.create(
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
  getCWUAnalysisReport,
  generateCWUAnalysisReport,
};
