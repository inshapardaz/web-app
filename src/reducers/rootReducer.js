import {combineReducers} from 'redux';
import { reducer as oidcReducer } from 'redux-oidc';
import { connectRouter } from 'connected-react-router';

import authenticationReducer from './authenticationReducer';
import apiReducers from './apiReducer';

export default (history) => combineReducers({
    oidc: oidcReducer,
    authenticationReducer,
    apiReducers,
    router: connectRouter(history)
});