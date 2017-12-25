/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './SingleButton.css';
import Link from '../../Link';

class SingleButton extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    buttonTitle: PropTypes.string.isRequired,
    buttonLink: PropTypes.string,
  };

  render() {
    return (
      <div className={s.root}>
        <div className={s.container}>
          <div className={s.title}>{this.props.title}</div>
        </div>
        <div className={s.container}>
          <Link className={s.link} to={this.props.buttonLink}>
            <div className={s.button}>{this.props.buttonTitle}</div>
          </Link>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(SingleButton);
