import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './TestUploaded.css';
import SingleButton from '../../../components/Templates/SingleButton';

class TestUploaded extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
  };

  render() {
    return (
      <div className={s.root}>
        <div className={s.container}>
          <SingleButton
            title="Reports have been submitted successfully!"
            buttonTitle="View Details"
            buttonLink="/tests"
          />
        </div>
      </div>
    );
  }
}

export default withStyles(s)(TestUploaded);
