import * as core from 'express-serve-static-core';

import {PassportStatic} from 'passport';

import {Strategy as GitHubStrategy, Profile as GitHubProfile} from 'passport-github';

import {User, DoneUser} from '../../src/models/user';

import * as CONFIG from '../../config/config.secret.json';

import {createUser, redirect} from 'server/passport';

export default (APP: core.Express, passport: PassportStatic) => {
  passport.use(
      new GitHubStrategy(
          {
            clientID: CONFIG.github.clientID,
            clientSecret: CONFIG.github.clientSecret,
            callbackURL: `${CONFIG.domain}/login/github/callback`,
            passReqToCallback: true,
          },
          (req: core.Request, accessToken: string, refreshToken: string, profile: GitHubProfile, done: DoneUser) => {
            createUser(
                req,
                {
                  'github.id': profile.id,
                },
                {
                  displayName: profile.displayName,
                  github: {
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
      '/login/github',
      passport.authenticate('github')
  );

  APP.get(
      '/login/github/callback',
      passport.authenticate('github'),
      redirect
  );
};
