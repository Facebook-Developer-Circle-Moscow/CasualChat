declare const CONFIG: any;

import * as React from 'react';

import {block as bem} from 'bem-cn';

import {Metadata} from 'models/metadata';

import {Props} from 'routers/index';

import App from 'components/App';

const Context = React.createContext({
  title: 'Pet project from Casual Chat video.',
  h1: 'Login'
});

const block = bem('login');

import './index.scss';

export default ({ssr}: Props) => {
  return (
      <Context.Consumer>
        {(metadata: Metadata) => (
            <App ssr={ssr} metadata={{...metadata, h1: null}} page={block()} className={block()}>
              <div className={block('form')}>
                <h1 className={block('title')}>{metadata.h1}</h1>
                <div className={block('icons')}>
                  {CONFIG.facebook.clientID && CONFIG.facebook.clientSecret ? (
                      <a
                          className={block('icon', {facebook: true})}
                          href='/login/facebook'
                      />
                  ) : null}
                  {CONFIG.google.key && CONFIG.google.secret ? (
                      <a
                          className={block('icon', {google: true})}
                          href='/login/google'
                      />
                  ) : null}
                  {CONFIG.twitter.key && CONFIG.twitter.secret ? (
                      <a
                          className={block('icon', {twitter: true})}
                          href='/login/twitter'
                      />
                  ) : null}
                  {CONFIG.yandex.clientID && CONFIG.yandex.clientSecret ? (
                      <a
                          className={block('icon', {yandex: true})}
                          href='/login/yandex'
                      />
                  ) : null}
                  {CONFIG.vk.clientID && CONFIG.vk.clientSecret ? (
                      <a
                          className={block('icon', {vk: true})}
                          href='/login/vk'
                      />
                  ) : null}
                  {CONFIG.github.clientID && CONFIG.github.clientSecret ? (
                      <a
                          className={block('icon', {github: true})}
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