import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './UploadError.css';
import SingleButton from '../../../components/Templates/SingleButton';

class UploadError extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
  };

  render() {
    return (
      <div className={s.root}>
        <div className={s.container}>
          <SingleButton
            title="There was some error with the uploaded files!"
            buttonTitle="View Details"
            buttonLink="/tests"
          />
        </div>
      </div>
    );
  }
}

export default withStyles(s)(UploadError);
