import * as core from 'express-serve-static-core';

import {PassportStatic} from 'passport';

import {Strategy as FacebookStrategy, Profile as FacebookProfile} from 'passport-facebook';

import {User, DoneUser} from '../../src/models/user';

import * as CONFIG from '../../config/config.secret.json';

import {createUser, redirect} from 'server/passport';

export default (APP: core.Express, passport: PassportStatic) => {
  passport.use(
      new FacebookStrategy(
          {
            clientID: CONFIG.facebook.clientID,
            clientSecret: CONFIG.facebook.clientSecret,
            callbackURL: `${CONFIG.domain}/login/facebook/callback`,
            passReqToCallback: true,
          },
          (req: core.Request, accessToken: string, refreshToken: string, profile: FacebookProfile, done: DoneUser) => {
            createUser(
                req,
                {
                  'facebook.id': profile.id,
                },
                {
                  displayName: profile.displayName,
                  facebook: {
                    id: profile.id,
                    access: accessToken,
                    refresh: refreshToken,
                  }
                }
            )
            .then((user: User) => done(null, user))
            .catch((error) => done(error));
          }
      )
  );

  APP.get(
      '/login/facebook',
      passport.authenticate('facebook')
  );

  APP.get(
      '/login/facebook/callback',
      passport.authenticate('facebook'),
      redirect
  );
};
