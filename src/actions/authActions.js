import { LOGIN, LOGOUT, CHANGEPASSWORD } from './actionTypes';
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


export function changePassword(){
  AuthService.changePassword();
  window.location.replace('/');
  return {
    type: CHANGEPASSWORD,
  }
}
