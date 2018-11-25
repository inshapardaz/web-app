import { combineReducers } from 'redux';

import { reducer as oidcReducer } from 'redux-oidc';
import authenticationReducer from './authenticationReducer';
import apiReducer from './api';

const rootReducer = combineReducers({
  oidc: oidcReducer,
  authenticationReducer,
  apiReducer
});

export default rootReducer;
