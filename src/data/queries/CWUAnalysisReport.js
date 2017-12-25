import {
  GraphQLString as StringType,
  GraphQLList as List,
  GraphQLInt as IntType,
} from 'graphql';

import CWUAnalysisReportType from '../types/CWUAnalysisReportType';
import CWUAnalysisReport from './../../api/cwuAnalysisReport/cwuAnalysisReport.model';

const cwuAnalysisReport = {
  args: {
    testId: { type: StringType },
    academicYear: { type: IntType },
  },
  type: new List(CWUAnalysisReportType),
  async resolve(obj, args) {
    const masterResults = await CWUAnalysisReport.find({
      testId: args.testId,
      academicYear: args.academicYear,
    }).exec();

    return masterResults;
  },
};

export default cwuAnalysisReport;
