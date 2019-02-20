import { LOGIN, LOGOUT } from './actionTypes';
import AuthService from '../services/AuthService';

export function login(){
  AuthService.login();
  return {
    type: LOGIN,
  }
}

export function logout(){
  AuthService.logout();
  window.location.replace('/');
  return {
    type: LOGOUT,
  }
}
