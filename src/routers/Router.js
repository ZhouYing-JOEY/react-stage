import React, { Suspense } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

import Loading from '../components/Loading';
import config from './Router.config.js';

const renderRoutes = (routes) => {
  if (!Array.isArray(routes)) {
    return null;
  }

  return (
    <Switch>
      {routes.map((route, index) => {
        if (route.redirect) {
          return (
            <Redirect
              key={route.path || index}
              exact={route.exact}
              strict={route.strict}
              from={route.path}
              to={route.redirect}
            />
          );
        }

        return (
          <Route
            key={route.path || index}
            path={route.path}
            exact={route.exact}
            strict={route.strict}
            render={() => {
              const renderChildRoutes = renderRoutes(route.childRoutes);
              if (route.component) {
                return (
                  <Suspense fallback={<Loading />}>
                    <route.component route={route}>{renderChildRoutes}</route.component>
                  </Suspense>
                );
              }
              return renderChildRoutes;
            }}
          />
        );
      })}
    </Switch>
  );
};

const RootRouter = () => <Router>{renderRoutes(config)}</Router>;

export default RootRouter;
