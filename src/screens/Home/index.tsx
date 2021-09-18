import * as React from 'react';

import {block as bem} from 'bem-cn';

import {Metadata} from 'models/metadata';

import {Props} from 'routers/index';

import App from 'components/App';

const Context = React.createContext({
  title: 'Pet project from Casual Chat video.',
  h1: 'CasualChat'
});

const block = bem('home');

import './index.scss';

export default ({ssr}: Props) => {
  return (
      <Context.Consumer>
        {(metadata: Metadata) => (
            <App ssr={ssr} metadata={metadata} page={block()} />
        )}
      </Context.Consumer>
  );
}