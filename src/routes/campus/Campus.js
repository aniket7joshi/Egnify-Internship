import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Campus.css';
import SingleButton from '../../components/Templates/SingleButton';

class Campus extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
  };

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

export default withStyles(s)(Campus);
