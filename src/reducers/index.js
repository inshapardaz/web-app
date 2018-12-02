import { combineReducers } from 'redux';

import { reducer as oidcReducer } from 'redux-oidc';
import authenticationReducer from './authenticationReducer';
import { pendingTasksReducer } from 'react-redux-spinner'
import { routerReducer } from 'react-router-redux'
import apiReducer from './apiReducer';
import app from './uiReducer';

const rootReducer = combineReducers({
  oidc: oidcReducer,
  routing: routerReducer,
  authenticationReducer,
  pendingTasksReducer,
  app,
  apiReducer
});

export default rootReducer;
