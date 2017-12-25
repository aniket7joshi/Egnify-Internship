import React from 'react';
import Layout from '../../../components/Layout';
import NewTest from './NewTest';

const title = 'NewTest';

function action() {
  return {
    chunks: ['newTest'],
    title,
    component: (
      <Layout>
        <NewTest title={title} />
      </Layout>
    ),
  };
}

export default action;
