import {createStore as createStoreRedux} from 'redux';

import {reducers} from 'reducers/index';
import {SessionState, initialState as SessionInitialState} from 'reducers/session';

export type State = {
  session: SessionState;
};

export const initialState: State = {
  session: SessionInitialState,
};

export const createStore = (state: State) => {
  return createStoreRedux(
      reducers,
      state,
      process.env.NODE_ENV === 'development' ? (window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__() : undefined
  );
};