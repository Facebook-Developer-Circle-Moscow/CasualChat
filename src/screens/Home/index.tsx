import * as React from 'react';

import {Metadata} from 'models/metadata';

import App from 'components/App';

const Context = React.createContext({
  title: 'Pet project from Casual Chat video.',
  h1: 'CasualChat'
});

export default function ({ssr}: { ssr?: boolean }) {
  return (
      <Context.Consumer>
        {(metadata: Metadata) => (
            <App ssr={ssr} metadata={metadata} />
        )}
      </Context.Consumer>
  );
}