import userManager from "../utils/userManager";

export function login(){
  userManager.signinRedirect();
  return {
    type: 'LOGIN',
  }
}

export function logout(){
  userManager.removeUser();
  return {
    type: 'LOGOUT',
  }
}
