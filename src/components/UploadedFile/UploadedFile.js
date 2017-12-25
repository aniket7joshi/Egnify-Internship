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
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './UploadedFile.css';
import cross from './cross.svg';
import tick from './tick.svg';

class UploadedFile extends React.Component {
  static propTypes = {
    text: PropTypes.string.isRequired,
    callback: PropTypes.func,
  };

  render() {
    return (
      <div className={s.chip} onClick={() => this.props.callback()}>
        <div className={s.tick}>
          <img
            src={tick}
            style={{
              position: 'relative',
              height: '9px',
              top: '-4px',
              left: '0px',
            }}
          />
        </div>
        {this.props.text}
        <div className={s.cross}>
          <img
            src={cross}
            style={{
              position: 'relative',
              height: '9px',
              top: '-4px',
              left: '0px',
            }}
          />
        </div>
      </div>
    );
  }
}

export default withStyles(s)(UploadedFile);
