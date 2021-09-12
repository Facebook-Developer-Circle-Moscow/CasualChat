import {createStore as createStoreRedux} from 'redux';

import {reducers} from 'reducers/index';
import {RouterState, initialState as RouterInitialState} from 'reducers/router';

export type State = {
  router: RouterState;
};

export const initialState: State = {
  router: RouterInitialState,
};

export const createStore = (state: State) => {
  return createStoreRedux(
      reducers,
      state,
      process.env.NODE_ENV === 'development' ? (window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__() : undefined
  );
};