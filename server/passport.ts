import * as core from 'express-serve-static-core';
import * as passport from 'passport';

import PassportFacebook from './passport/facebook';
import PassportGoogle from './passport/google';
import PassportTwitter from './passport/twitter';
import PassportYandex from './passport/yandex';
import PassportVK from './passport/vk';
import PassportGitHub from './passport/github';

import * as CONFIG from '../config/config.secret.json';

import {ObjectId} from 'mongodb';

import {User, UserSearch, DoneUser, DoneId} from '../src/models/user';

import DB from './mongo';

async function create(search: UserSearch, insert: User): Promise<User> {
  const db = await DB();
  const users = db.collection('users');

  const user = await users.findOne(search);

  if (user) {
    return user;
  } else {
    const {acknowledged, insertedId} = await users.insertOne(insert);

    if (acknowledged) {
      return users.findOne(insertedId);
    } else {
      return null;
    }
  }
}

async function merge(loginUser?: User, sessionUser?: User): Promise<User> {
  if (!sessionUser && !loginUser) {
    return null;
  } else if (!sessionUser && loginUser) {
    return loginUser;
  } else if (sessionUser && !loginUser) {
    return sessionUser;
  } else if (sessionUser?._id.toString() === loginUser?._id.toString()) {
    return sessionUser;
  } else {
    const db = await DB();
    const users = db.collection('users');

    const mergedUser = {
      displayName: sessionUser.displayName || loginUser.displayName || '',
      ...Object.fromEntries(Object.entries({
        facebook: sessionUser.facebook || loginUser.facebook || null,
        google: sessionUser.google || loginUser.google || null,
        twitter: sessionUser.twitter || loginUser.twitter || null,
        yandex: sessionUser.yandex || loginUser.yandex || null,
        vk: sessionUser.vk || loginUser.vk || null,
        github: sessionUser.github || loginUser.github || null,
      }).filter(([_, value]) => value != null))
    };

    await users.deleteMany({_id: {$in: [sessionUser._id, loginUser._id]}});

    const {acknowledged, insertedId} = await users.insertOne(mergedUser);

    if (acknowledged) {
      return users.findOne(insertedId);
    } else {
      return null;
    }
  }
}

export async function createUser(req: core.Request, search: UserSearch, insert: User) {
  return merge(await create(search, insert), req.user);
}

export function redirect(req: core.Request, res: core.Response) {
  if (req.user) {
    res.redirect((req.session as any).returnTo || '/');
    delete (req.session as any).returnTo;
  } else {
    res.redirect('/login');
  }
}

async function serializeUser(user: User) {
  return user._id.toString();
}

async function deserializeUser(id: string) {
  const db = await DB();
  const users = db.collection('users');
  return users.findOne(new ObjectId(id))
}

passport.serializeUser((user: User, done: DoneId) => {
  serializeUser(user)
  .then((id) => done(null, id))
  .catch((error) => done(error));
});

passport.deserializeUser((id: string, done: DoneUser) => {
  deserializeUser(id)
  .then((user: User) => done(null, user))
  .catch((error) => done(error));
});

export default (APP: core.Express) => {
  APP.use(passport.initialize());
  APP.use(passport.session());

  if (CONFIG.facebook.clientID && CONFIG.facebook.clientSecret) {
    PassportFacebook(APP, passport);
  }

  if (CONFIG.google.key && CONFIG.google.secret) {
    PassportGoogle(APP, passport);
  }

  if (CONFIG.twitter.key && CONFIG.twitter.secret) {
    PassportTwitter(APP, passport);
  }

  if (CONFIG.yandex.clientID && CONFIG.yandex.clientSecret) {
    PassportYandex(APP, passport);
  }

  if (CONFIG.vk.clientID && CONFIG.vk.clientSecret) {
    PassportVK(APP, passport);
  }

  if (CONFIG.github.clientID && CONFIG.github.clientSecret) {
    PassportGitHub(APP, passport);
  }

  APP.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });
};