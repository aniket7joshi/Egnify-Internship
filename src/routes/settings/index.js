import React from 'react';
import Layout from '../../components/Layout';
import Settings from './Settings';

const title = 'Settings';

function action() {
  return {
    chunks: ['settings'],
    title,
    component: (
      <Layout>
        <Settings title={title} />
      </Layout>
    ),
  };
}

export default action;
