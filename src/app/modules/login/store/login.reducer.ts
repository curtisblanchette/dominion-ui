import { createFeatureSelector, createReducer, createSelector, on } from '@ngrx/store';
import { User } from '../models/user';
import * as loginActions from './login.actions';

export interface LoginState {
  user: User | null;
}

/**
 * Utility: test if localstorage is base64
 * @param str
 * @returns boolean
 */
const isBase64 = (str: string | null): boolean => { try { return btoa(atob(<string>str)) === str; } catch (err) { return false;}}

function getUserInitialState() {
  const userData = localStorage.getItem('user');
  return isBase64(userData) && JSON.parse(atob(<string>userData)) || null;
}

export const initialState: LoginState = {
  user: getUserInitialState()
};

export const reducer = createReducer(
  initialState,
  on(loginActions.LoginAction, (state) => ({...state})),
  on(loginActions.LoginSuccessfulAction, (state, {payload}) => ({...state, user: payload, error: null})),
  on(loginActions.LoginErrorAction, (state, {error}) => ({...state, error: error})),
  on(loginActions.UpdateUserAction, (state, {payload}) => ({...state, user: payload, error: null})),
  on(loginActions.SetAgentRecord, (state, {payload}) => ({...state, agent: payload})),
  on(loginActions.SetWorkspaceRecord, (state, {payload}) => ({...state, workspace: payload})),
  on(loginActions.LogoutAction, (state) => ({...state, user: null, agent: null, workspace: null})),
  on(loginActions.RefreshTokenAction, (state) => ({...state}))
);

export const selectLogin = createFeatureSelector<LoginState>('login');

export const selectLoginUser   = createSelector(selectLogin, (state: LoginState) => state.user);
