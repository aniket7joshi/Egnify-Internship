import React from 'react';
import Layout from '../../../../components/Layout';
import ViewReport from '../../../../components/ViewReport/ViewReport';

const title = 'View Report';
const reportName = 'Overall Average';

function action() {
  return {
    chunks: ['viewReport'],
    title,
    component: (
      <Layout>
        <ViewReport
          title={title}
          api="/api/overAllAverages/total"
          reportName={reportName}
        />
      </Layout>
    ),
  };
}

export default action;
