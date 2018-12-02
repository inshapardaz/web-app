import { createAction } from 'redux-act'
import { pendingTask, begin, end } from 'react-redux-spinner'
import ApiService from '../services/api';

const NS = `@@${REDUCER}/`
const REDUCER = 'app'

export const _setFrom = createAction(`${NS}SET_FROM`)
export const _setLoading = createAction(`${NS}SET_LOADING`)
export const _setHideLogin = createAction(`${NS}SET_HIDE_LOGIN`)

export const setUserState = createAction(`${NS}SET_USER_STATE`)
export const setUpdatingContent = createAction(`${NS}SET_UPDATING_CONTENT`)
export const setActiveDialog = createAction(`${NS}SET_ACTIVE_DIALOG`)
export const deleteDialogForm = createAction(`${NS}DELETE_DIALOG_FORM`)
export const addSubmitForm = createAction(`${NS}ADD_SUBMIT_FORM`)
export const deleteSubmitForm = createAction(`${NS}DELETE_SUBMIT_FORM`)
export const setLayoutState = createAction(`${NS}SET_LAYOUT_STATE`)

export const setLoading = isLoading => {
  const action = _setLoading(isLoading)
  action[pendingTask] = isLoading ? begin : end
  return action
}

export const resetHideLogin = () => (dispatch, getState) => {
  const state = getState()
  if (state.pendingTasks === 0 && state.app.isHideLogin) {
    dispatch(_setHideLogin(false))
  }
  return Promise.resolve()
}

export function getEntry(){
  return async (dispatch, getState) =>
	{
    const api = new ApiService(getState().oidc.user);
    const entry = await api.getEntry();

    dispatch({
      type: 'ENTRY',
      payload: entry
    });
  }
}
