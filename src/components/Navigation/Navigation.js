/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Navigation.css';
import Link from '../Link';
import history from '../../history';

const pages = [
	{
		title: "Dashboard",
		route: '/',
	},
	{
		title: "Reports",
		route: '/reports',
	},
	{
		title: "Graphs",
		route: '/graphs',
	},
	{
		title: "Teachers",
		route: '/teachers',
	},
	{
		title: "Students",
		route: '/students',
	},
	{
		title: "Tests",
		route: '/tests',
	},
	{
		title: "Settings",
		route: '/settings',
	},
];

class Navigation extends React.Component {
  constructor(props) {
    super(props);
    this.state = { page: '' };
  }

 	componentDidMount() {
 		this.setState({ page: '/' + history.location.pathname.split('/')[1] });
 		let self = this;
 		history.listen(function(location) {
 			let path = location.pathname;
 			self.setState({page: '/' + path.split('/')[1]})
 		})
 	}

  handleClick(page) {
    this.setState({ page: page });
  }

  render() {
  	let self = this;
    return (
      <div className={s.root} role="navigation">
        <br />
       	{
       		pages.map(function(page, i) {
       			return (
        			<Link
        			  className={self.state.page === page.route ? cx(s.link, s.active) : s.link}
        			  onClick={() => self.handleClick(page.route)}
        			  to={page.route}
        			  key={i}
        			>
			          {page.title}
			        </Link>
       			);
       		})
       	}
      </div>
    );
  }
}

export default withStyles(s)(Navigation);
