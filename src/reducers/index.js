import { combineReducers } from 'redux';

import { reducer as oidcReducer } from 'redux-oidc';
import authenticationReducer from './authenticationReducer';

const rootReducer = combineReducers({
  oidc: oidcReducer,
  authenticationReducer
});

export default rootReducer;
