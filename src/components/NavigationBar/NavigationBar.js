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
import s from './NavigationBar.css';
import Link from '../Link';
import Navigation from '../Navigation';
import Drawer from 'material-ui/Drawer';

import menuIcon from './menu.svg';
// TODO: get Mobile view or web view state from redux

class NavigationBar extends React.Component {
  static propTypes = {
    isMobile: PropTypes.bool,
  };

  constructor(props) {
    super(props);
    this.state = { open: false };
  }

  handleToggle = () => this.setState({ open: !this.state.open });

  handleClose = () => this.setState({ open: false });

  renderMobile() {
    return (
      <div>
        <Drawer
          docked={false}
          width={190}
          open={this.state.open}
          onRequestChange={open => this.setState({ open })}
        >
          <div className={s.root}>
            <div className={s.container}>
              <Navigation />
            </div>
          </div>
        </Drawer>
        <div
          style={{
            position: 'fixed',
            top: '20px',
            left: '20px',
            height: '30px',
            width: '30px',
            cursor: 'pointer',
            zIndex: '3',
          }}
          onClick={() => this.handleToggle()}
        >
          <img src={menuIcon} />
        </div>
      </div>
    );
  }

  render() {
    return (
      <div>
        {!this.props.isMobile && (
          <div className={s.root}>
            <div className={s.container}>
              <Navigation />
            </div>
          </div>
        )}
        {this.props.isMobile && this.renderMobile()}
      </div>
    );
  }
}

export default withStyles(s)(NavigationBar);
