/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
// import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Home.css';
import SingleButton from '../../components/Templates/SingleButton';

class Home extends React.Component {
  // static propTypes = {
  //   news: PropTypes.arrayOf(
  //     PropTypes.shape({
  //       title: PropTypes.string.isRequired,
  //       link: PropTypes.string.isRequired,
  //       content: PropTypes.string,
  //     }),
  //   ).isRequired,
  // };
  handleTest = event => {
    const data = new FormData();
    // data.append('files', event.target.errorReport.files[0]);
    // data.append('files', event.target.markingSchema.files[0]);
    // data.append('testName', event.target.testName);
    data.append('description', 'some value user types');

    console.log('data: ', data);
    // '/files' is your node.js route that triggers our middleware
    axios.get('/api/graphData/data', data).then(response => {
      console.error(response); // do something with the response
    });
  }// });
  //   axios
  //     .get(
  //       '/api/pdf',
  //       (params: {
  //         testName: 'Joshi_Overall_Average',
  //       '/api/download',
  //       (params: {
  //         testName: 'Set A_Overall_Average',
  //       }),
  //     )
  //     .then(response => {
  //       console.error(response);
  //     })
  //     .catch(error => {
  //       console.log(error);
  //     });
  //   event.preventDefault();
  // };

  render() {
    return (
      <div className={s.root}>
        <div className={s.container}>
          <SingleButton
            title="Coming soon! This feature is scheduled for Release 2"
            buttonTitle="Visit Home"
            buttonLink="/tests"
          />
        </div>
      </div>
    );
  }
}

export default withStyles(s)(Home);
