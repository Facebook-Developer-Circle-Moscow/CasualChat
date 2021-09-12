declare const mode: string;

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import {Provider} from 'react-redux';
import {BrowserRouter} from 'react-router-dom';

import {createStore} from 'store/index';

import Router from 'routers/index';

const store = createStore((window as any).__PRELOADED_STATE__);

import './scss/index.scss';

ReactDOM.hydrate(
    (
        <Provider store={store}>
          <BrowserRouter basename={mode === 'deployment' ? '/CasualChat' : '/'}>
            <Router/>
          </BrowserRouter>
        </Provider>
    ),
    document.getElementById('root'),
);