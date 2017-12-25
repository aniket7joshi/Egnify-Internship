import React from 'react';
import Layout from '../../components/Layout';
import Teachers from './Teachers';

const title = 'Teachers';

function action() {
  return {
    chunks: ['teachers'],
    title,
    component: (
      <Layout>
        <Teachers title={title} />
      </Layout>
    ),
  };
}

export default action;
