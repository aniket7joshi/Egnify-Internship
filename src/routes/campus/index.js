import React from 'react';
import Layout from '../../components/Layout';
import Campus from './Campus';

const title = 'Campus';

function action() {
  return {
    chunks: ['campus'],
    title,
    component: (
      <Layout>
        <Campus title={title} />
      </Layout>
    ),
  };
}

export default action;
