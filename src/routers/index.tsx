import * as React from 'react';
import {connect} from 'react-redux';

import {Switch, Route, Redirect} from 'react-router-dom';

import {State as StoreTree} from 'store/index';

import {User} from 'models/user';

import Home from 'screens/Home';
import Users from 'screens/Users';
import Login from 'screens/Login';
import Profile from 'screens/Profile';
import ErrorPage from 'screens/ErrorPage';

export interface OwnProps {
  ssr?: boolean
}

export interface Props extends OwnProps {
  csrf: string;
  user: User;
}

function Routs(props: Props) {
  return (
      <Switch>
        <Route
            path='/'
            exact={true}
            component={() => <Home {...props}/>}
        />
        <Route
            path='/login/'
            exact={true}
        >
          {props.user ? <Redirect to='/profile/'/> : <Login {...props}/>}
        </Route>
        <Route
            path='/profile/'
            exact={true}
            component={() => <Profile {...props}/>}
        />
        <Route
            path='/users/'
            exact={true}
            component={() => <Users {...props}/>}
        />
        <Route
            component={() => <ErrorPage {...props}/>}
        />
      </Switch>
  );
}

export default connect(
    (state: StoreTree, ownProps: OwnProps) => ({
      ...ownProps,
      csrf: state.session.csrf,
      user: state.session.user,
    }),
)(Routs);