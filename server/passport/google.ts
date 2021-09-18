import * as core from 'express-serve-static-core';

import {PassportStatic} from 'passport';

import {OAuth2Strategy as GoogleStrategy, Profile as GoogleProfile} from 'passport-google-oauth';

import {User, DoneUser} from '../../src/models/user';

import * as CONFIG from '../../config/config.secret.json';

import {createUser, redirect} from 'server/passport';

export default (APP: core.Express, passport: PassportStatic) => {
  passport.use(
      new GoogleStrategy(
          {
            clientID: CONFIG.google.key,
            clientSecret: CONFIG.google.secret,
            callbackURL: `${CONFIG.domain}/login/google/callback`,
            passReqToCallback: true,
          },
          (req: core.Request, token: string, tokenSecret: string, profile: GoogleProfile, done: DoneUser) => {
            createUser(
                req,
                {
                  'google.id': profile.id,
                },
                {
                  displayName: profile.displayName,
                  google: {
                    id: profile.id,
                    token,
                    secret: tokenSecret,
                  }
                }
            )
            .then((user: User) => done(null, user))
            .catch((error) => done(error));
          }
      )
  );

  APP.get(
      '/login/google',
      passport.authenticate('google', {scope: 'email'})
  );

  APP.get(
      '/login/google/callback',
      passport.authenticate('google'),
      redirect
  );
};
