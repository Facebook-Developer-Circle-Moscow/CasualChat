import * as React from 'react';

import {Switch, Route} from 'react-router-dom';

import Home from 'screens/Home';
import ErrorPage from 'screens/ErrorPage';

export default function ({ssr}: { ssr?: boolean }) {
  return (
      <Switch>
        <Route
            path='/'
            exact={true}
            component={() => <Home ssr={ssr}/>}
        />
        <Route
            component={() => <ErrorPage ssr={ssr}/>}
        />
      </Switch>
  );
}