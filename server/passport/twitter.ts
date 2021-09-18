import * as core from 'express-serve-static-core';

import {PassportStatic} from 'passport';

import {Strategy as TwitterStrategy, Profile as TwitterProfile} from 'passport-twitter';

import {User, DoneUser} from '../../src/models/user';

import * as CONFIG from '../../config/config.secret.json';

import {createUser, redirect} from 'server/passport';

export default (APP: core.Express, passport: PassportStatic) => {
  passport.use(
      new TwitterStrategy(
          {
            consumerKey: CONFIG.twitter.key,
            consumerSecret: CONFIG.twitter.secret,
            callbackURL: `${CONFIG.domain}/login/twitter/callback`,
            passReqToCallback: true,
          },
          (req: core.Request, token: string, tokenSecret: string, profile: TwitterProfile, done: DoneUser) => {
            createUser(
                req,
                {
                  'twitter.id': profile.id,
                },
                {
                  displayName: profile.displayName,
                  twitter: {
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
      '/login/twitter',
      passport.authenticate('twitter')
  );

  APP.get(
      '/login/twitter/callback',
      passport.authenticate('twitter'),
      redirect
  );
};
