import React from 'react';
import Layout from '../../components/Layout';
import Graphs from './Graphs';

const title = 'Graphs | Egnify';

function action() {
  return {
    chunks: ['graphs'],
    title,
    component: (
      <Layout>
        <Graphs title={title} />
      </Layout>
    ),
  };
}

export default action;
