import React from 'react';
import Layout from '../../../../components/Layout';
import ViewReport from '../../../../components/ViewReport/ViewReport';

const title = 'View Report';
const reportName = 'Campus Topper';

function action() {
  return {
    chunks: ['viewReport'],
    title,
    component: (
      <Layout>
        <ViewReport
          title={title}
          api="/api/campusToppers/campusTopper"
          reportName={reportName}
        />
      </Layout>
    ),
  };
}

export default action;
