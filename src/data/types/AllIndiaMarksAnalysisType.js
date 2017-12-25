import {
  GraphQLObjectType as ObjectType,
  GraphQLString as StringType,
  GraphQLInt as IntType,
  GraphQLList as List,
} from 'graphql';

const ReportType = new ObjectType({
  name: 'Report',
  fields: {
    rollNumber: { type: StringType },
    name: { type: StringType },
    campusId: { type: StringType },

    phyMarks120: { type: IntType },
    cheMarks120: { type: IntType },
    matMarks120: { type: IntType },

    phyRank: { type: IntType },
    cheRank: { type: IntType },
    matRank: { type: IntType },

    overallMarks: { type: IntType },
    overallRank: { type: IntType },
  },
});

const AllIndiaMarksAnalysisType = new ObjectType({
  name: 'AllIndiaMarksAnalysis',
  fields: {
    testId: { type: StringType },
    reports: { type: new List(ReportType) },
  },
});

export default AllIndiaMarksAnalysisType;
