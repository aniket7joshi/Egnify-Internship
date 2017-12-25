import React from 'react';
import Layout from '../../components/Layout';
import Students from './Students';

const title = 'Students';

function action() {
  return {
    chunks: ['students'],
    title,
    component: (
      <Layout>
        <Students title={title} />
      </Layout>
    ),
  };
}

export default action;
