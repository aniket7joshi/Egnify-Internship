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

// external-global styles must be imported in your JS.
import cx from 'classnames';
import normalizeCss from 'normalize.css';
import s from './Layout.css';
import NavigationBar from '../NavigationBar';
import Feedback from '../Feedback';
import Footer from '../Footer';

import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

class Layout extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
  };

  // TODO: Initialise window state
  constructor(props) {
    super(props);
    this.state = { width: '0', height: '0', isMobile: false };
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  updateWindowDimensions() {
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight,
      isMobile: window.innerWidth < 800,
    });
    // console.log(this.state);
  }

  render() {
    return (
      <MuiThemeProvider
        muiTheme={getMuiTheme({
          palette: {
            primary2Color: '#529dea',
            pickerHeaderColor: '#529dea',
          },
          lightBaseTheme,
        })}
      >
        <div className={s.root}>
          <NavigationBar isMobile={this.state.isMobile} />
          <div
            className={
              this.state.isMobile
                ? cx(s.content, s.mobile)
                : cx(s.content, s.web)
            }
          >
            {this.props.children}
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default withStyles(normalizeCss, s)(Layout);
