import React from 'react';
import Layout from '../../../components/Layout';
import ViewReports from './ViewReports';

const title = 'Reports';

function action() {
  return {
    chunks: ['viewReports'],
    title,
    component: (
      <Layout>
        <ViewReports title={title} />
      </Layout>
    ),
  };
}

export default action;
