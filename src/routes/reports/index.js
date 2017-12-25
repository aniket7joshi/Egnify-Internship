import React from 'react';
import Layout from '../../components/Layout';
import Reports from './Reports';

const title = 'Reports';

function action() {
  return {
    chunks: ['reports'],
    title,
    component: (
      <Layout>
        <Reports title={title} />
      </Layout>
    ),
  };
}

export default action;
