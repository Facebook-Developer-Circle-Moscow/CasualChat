import * as core from 'express-serve-static-core';

import {PassportStatic} from 'passport';

import {
  Strategy as VKStrategy,
  Params as VKParams,
  Profile as VKProfile,
} from 'passport-vkontakte';

import {User, DoneUser} from '../../src/models/user';

import * as CONFIG from '../../config/config.secret.json';

import {createUser, redirect} from 'server/passport';

export default (APP: core.Express, passport: PassportStatic) => {
  passport.use(
      new VKStrategy(
          {
            clientID: CONFIG.vk.clientID,
            clientSecret: CONFIG.vk.clientSecret,
            callbackURL: `${CONFIG.domain}/login/vk/callback`,
            passReqToCallback: true,
          } as any,
          ((
              req: core.Request,
              accessToken: string,
              refreshToken: string,
              params: VKParams,
              profile: VKProfile,
              done: DoneUser
          ) => {
            createUser(
                req,
                {
                  'vk.id': profile.id,
                },
                {
                  displayName: profile.displayName,
                  vk: {
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
      '/login/vk',
      passport.authenticate('vkontakte')
  );

  APP.get(
      '/login/vk/callback',
      passport.authenticate('vkontakte'),
      redirect
  );
};
