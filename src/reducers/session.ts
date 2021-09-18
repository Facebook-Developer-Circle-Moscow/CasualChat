import {ActionTypes, Update} from 'actions/session';

import {User} from 'models/user';

export type SessionState = {
  csrf: string;
  location: string;
  modified: string;
  user?: User;
};

export const initialState: SessionState = {
  csrf: '',
  location: '/',
  modified: ''
};

export const session = (state = initialState, action: Update) => {
  switch (action.type) {
    case ActionTypes.UPDATE:
      return {...state, location: action.location};
    default:
      return state;
  }
};