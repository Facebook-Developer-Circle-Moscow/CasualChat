import * as core from 'express-serve-static-core';

import {PassportStatic} from 'passport';

import {Strategy as YandexStrategy, Profile as YandexProfile} from 'passport-yandex';

import {User, DoneUser} from '../../src/models/user';

import * as CONFIG from '../../config/config.secret.json';

import {createUser, redirect} from 'server/passport';

export default (APP: core.Express, passport: PassportStatic) => {
  passport.use(
      new YandexStrategy(
          {
            clientID: CONFIG.yandex.clientID,
            clientSecret: CONFIG.yandex.clientSecret,
            callbackURL: `${CONFIG.domain}/login/yandex/callback`,
            passReqToCallback: true,
          } as any,
          ((req: core.Request, accessToken: string, refreshToken: string, profile: YandexProfile, done: DoneUser) => {
            createUser(
                req,
                {
                  'yandex.id': profile.id,
                },
                {
                  displayName: profile.displayName,
                  yandex: {
                    id: profile.id,
                    access: accessToken,
                    refresh: refreshToken,
                  }
                }
            )
            .then((user: User) => done(null, user))
            .catch((error) => done(error));
          }) as any
      )
  );

  APP.get(
      '/login/yandex',
      passport.authenticate('yandex')
  );

  APP.get(
      '/login/yandex/callback',
      passport.authenticate('yandex'),
      redirect
  );
};
