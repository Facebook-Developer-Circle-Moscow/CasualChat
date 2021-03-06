import * as React from 'react';

import {block as bem} from 'bem-cn';

import {Metadata} from 'models/metadata';

import {Props} from 'routers/index';

import App from 'components/App';

import cat from 'images/cat.gif';

const Context = React.createContext({
  title: 'Page Not Found',
  h1: 'Page Not Found'
});

const block = bem('error');

import './index.scss';

export default ({ssr}: Props) => {
  return (
      <Context.Consumer>
        {(metadata: Metadata) => (
            <App ssr={ssr} metadata={{...metadata, h1: null}} page={block()}>
              {cat ? <img className={block('cat')} src={cat} /> : null}
              <h1 className={block('title')}>{metadata.h1}</h1>
            </App>
        )}
      </Context.Consumer>
  );
}