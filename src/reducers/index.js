import { combineReducers } from 'redux';

import { reducer as oidcReducer } from 'redux-oidc';
import fuelSavings from './fuelSavingsReducer';
import authenticationReducer from './authenticationReducer';

const rootReducer = combineReducers({
  oidc: oidcReducer,
  fuelSavings,
  authenticationReducer
});

export default rootReducer;
