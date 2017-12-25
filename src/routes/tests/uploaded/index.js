import React from 'react';
import Layout from '../../../components/Layout';
import TestUploaded from './TestUploaded';

const title = 'Test Uploaded';

function action() {
  return {
    chunks: ['testUploaded'],
    title,
    component: (
      <Layout>
        <TestUploaded title={title} />
      </Layout>
    ),
  };
}

export default action;
