import initialState from './initialState';

export default function authenticationReducer(state = {}, action) {
  switch (action.type) {
    case 'LOGIN':
      return state;
    case 'LOGOUT':
      return state;
    default:
      return state
  }
}
