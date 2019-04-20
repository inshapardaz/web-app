import {combineReducers} from 'redux';
import { reducer as oidcReducer } from 'redux-oidc';
import { connectRouter } from 'connected-react-router';

import authenticationReducer from './authenticationReducer';
import apiReducers from './apiReducer';
import uiReducer from './uiReducers';
import {reducer as toastrReducer} from 'react-redux-toastr'

export default (history) => combineReducers({
    oidc: oidcReducer,
    authenticationReducer,
    apiReducers,
    uiReducer,
    router: connectRouter(history),
    toastr: toastrReducer
});