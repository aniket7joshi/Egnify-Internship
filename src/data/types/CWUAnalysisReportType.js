import {
  GraphQLObjectType as ObjectType,
  GraphQLString as StringType,
  GraphQLInt as IntType,
  GraphQLList as List,
} from 'graphql';

const CWUReportType = new ObjectType({
  name: 'CWUReport',
  fields: {
    rollNumber: { type: StringType },
    name: { type: StringType },
    campusId: { type: StringType },

    Physics_C: { type: IntType },
    Physics_W: { type: IntType },
    Physics_U: { type: IntType },

    Chemistry_C: { type: IntType },
    Chemistry_W: { type: IntType },
    Chemistry_U: { type: IntType },

    Maths_C: { type: IntType },
    Maths_W: { type: IntType },
    Maths_U: { type: IntType },
  },
});

const CWUAnalysisReportType = new ObjectType({
  name: 'CWUAnalysisReport',
  fields: {
    testId: { type: StringType },
    reports: { type: new List(CWUReportType) },
  },
});

export default CWUAnalysisReportType;
