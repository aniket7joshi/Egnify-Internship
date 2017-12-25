/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/* eslint-disable global-require */

// The top-level (parent) route
const routes = {
  path: '/',

  // Keep in mind, routes are evaluated in order
  children: [
    {
      path: '/',
      load: () => import(/* webpackChunkName: 'home' */ './home'),
    },
    {
      path: '/reports',
      children: [
        {
          path: '',
          load: () => import(/* webpackChunkName: 'reports' */ './reports'),
        },
        {
          path: '/view',
          load: () => import(/* webpackChunkName: 'viewReports' */ './reports/view'),
        },
        {
          path: '/overAllAverages',
          children: [
            {
              path: '/total',
              load: () =>
                import(/* webpackChunkName: 'viewReport' */ './reports/overAllAverages/total'),
            },
            {
              path: '/campus',
              load: () =>
                import(/* webpackChunkName: 'viewReport' */ './reports/overAllAverages/campus'),
            },
          ],
        },
        {
          path: '/sectionAverages',
          children: [
            {
              path: '/section',
              load: () =>
                import(/* webpackChunkName: 'viewReport' */ './reports/sectionAverages/section'),
            },
            {
              path: '/sectionToppers',
              load: () =>
                import(/* webpackChunkName: 'viewReport' */ './reports/sectionAverages/sectionToppers'),
            },
          ],
        },
        {
          path: '/campusToppers',
          children: [
            {
              path: '/campusTopper',
              load: () =>
                import(/* webpackChunkName: 'viewReport' */ './reports/campusToppers/campusTopper'),
            },
            {
              path: '/topper',
              load: () =>
                import(/* webpackChunkName: 'viewReport' */ './reports/campusToppers/topper'),
            },
          ],
        },
      ],
    },
    {
      path: '/teachers',
      load: () => import(/* webpackChunkName: 'teachers' */ './teachers'),
    },
    {
      path: '/campus',
      load: () => import(/* webpackChunkName: 'campus' */ './campus'),
    },
    {
    	path: '/graphs',
      load: () => import(/* webpackChunkName: 'graphs' */ './graphs'),
    },
    {
      path: '/students',
      load: () => import(/* webpackChunkName: 'students' */ './students'),
    },
    {
      path: '/tests',
      children: [
        {
          path: '',
          load: () => import(/* webpackChunkName: 'tests' */ './tests'),
        },
        {
          path: '/newTest',
          load: () =>
            import(/* webpackChunkName: 'newTest' */ './tests/newTest'),
        },
        {
          path: '/uploaded',
          load: () =>
            import(/* webpackChunkName: 'testUploaded' */ './tests/uploaded'),
        },
        {
          path: '/uploadError',
          load: () =>
            import(/* webpackChunkName: 'uploadError' */ './tests/uploadError'),
        },
      ],
    },
    {
      path: '/settings',
      load: () => import(/* webpackChunkName: 'settings' */ './settings'),
    },

    // Wildcard routes, e.g. { path: '*', ... } (must go last)
    {
      path: '*',
      load: () => import(/* webpackChunkName: 'not-found' */ './not-found'),
    },
  ],

  async action({ next }) {
    // Execute each child route until one of them return the result
    const route = await next();

    // Provide default values for title, description etc.
    route.title = `${route.title || 'Untitled Page'}`;
    route.description = route.description || '';

    return route;
  },
};

// The error page is available by permanent url for development mode
if (__DEV__) {
  routes.children.unshift({
    path: '/error',
    action: require('./error').default,
  });
}

export default routes;
