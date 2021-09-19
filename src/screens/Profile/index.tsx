declare const CONFIG: any;

import * as React from 'react';

import {block as bem} from 'bem-cn';

import {Metadata} from 'models/metadata';

import {Props} from 'routers/index';

import App from 'components/App';

const Context = React.createContext({
  title: 'Pet project from Casual Chat video.',
  h1: 'Profile'
});

const block = bem('profile');

import './index.scss';

export default ({ssr, user}: Props) => {
  return (
      <Context.Consumer>
        {(metadata: Metadata) => (
            <App ssr={ssr} metadata={{...metadata, h1: null}} page={block()} className={block()}>
              <div className={block('form')}>
                <h1 className={block('title')}>{user.displayName}</h1>
                <p>Connect other accounts:</p>
                <div className={block('icons')}>
                  {CONFIG.facebook.clientID && CONFIG.facebook.clientSecret ? (
                      <a
                          className={block('icon', {facebook: true, active: !!user.facebook})}
                          href='/login/facebook'
                      />
                  ) : null}
                  {CONFIG.google.key && CONFIG.google.secret ? (
                      <a
                          className={block('icon', {google: true, active: !!user.google})}
                          href='/login/google'
                      />
                  ) : null}
                  {CONFIG.twitter.key && CONFIG.twitter.secret ? (
                      <a
                          className={block('icon', {twitter: true, active: !!user.twitter})}
                          href='/login/twitter'
                      />
                  ) : null}
                  {CONFIG.yandex.clientID && CONFIG.yandex.clientSecret ? (
                      <a
                          className={block('icon', {yandex: true, active: !!user.yandex})}
                          href='/login/yandex'
                      />
                  ) : null}
                  {CONFIG.vk.clientID && CONFIG.vk.clientSecret ? (
                      <a
                          className={block('icon', {vk: true, active: !!user.vk})}
                          href='/login/vk'
                      />
                  ) : null}
                  {CONFIG.github.clientID && CONFIG.github.clientSecret ? (
                      <a
                          className={block('icon', {github: true, active: !!user.github})}
                          href='/login/github'
                      />
                  ) : null}
                </div>
              </div>
            </App>
        )}
      </Context.Consumer>
  );
}