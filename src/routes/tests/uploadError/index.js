import React from 'react';
import Layout from '../../../components/Layout';
import UploadError from './UploadError';

const title = 'Upload Error';

function action() {
  return {
    chunks: ['testUploaded'],
    title,
    component: (
      <Layout>
        <UploadError title={title} />
      </Layout>
    ),
  };
}

export default action;
