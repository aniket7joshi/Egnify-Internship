import {
  GraphQLString as StringType,
  GraphQLList as List,
  GraphQLInt as IntType,
} from 'graphql';

import AllIndiaMarksAnalysisType from '../types/AllIndiaMarksAnalysisType';
import AllIndiaMarksAnalysisReport from './../../api/allIndiaMarksAnalysisReport/allIndiaMarksAnalysisReport.model';

const allIndiaMarksAnalysisReport = {
  args: {
    testId: { type: StringType },
    academicYear: { type: IntType },
  },
  type: new List(AllIndiaMarksAnalysisType),
  async resolve(obj, args) {
    const masterResults = await AllIndiaMarksAnalysisReport.find({
      testId: args.testId,
      academicYear: args.academicYear,
    }).exec();

    return masterResults;
  },
};

export default allIndiaMarksAnalysisReport;
