import { SILENT_RENEW_ERROR } from 'redux-oidc';

export default function authenticationReducer(state = {}, action) {
  switch (action.type) {
    case 'LOGIN':
      return state;
    case 'LOGOUT':
      return state;
    case SILENT_RENEW_ERROR:
      console.log('silent renew error');
      return state;
    default:
      return state;
  }
}
