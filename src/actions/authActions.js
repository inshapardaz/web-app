import userManager from "../services/userManager";
import { LOGIN, LOGOUT } from './actionTypes';

export function login(){
  userManager.signinRedirect();
  return {
    type: LOGIN,
  }
}

export function logout(){
  userManager.removeUser();
  return {
    type: LOGOUT,
  }
}
