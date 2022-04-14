import { createFeatureSelector, createReducer, createSelector, on } from '@ngrx/store';

import * as loginActions from './login.actions';
import { User } from '../models/user';

export interface LoginState {
  user: User | null;
  agent: any;
  workspace: any;
  error?: any
}

function isBase64(str: string) {
  try {
    return btoa(atob(str)) === str;
  } catch (err) {
    return false;
  }
}

function getUserInitialState() {
  const userData = localStorage.getItem('user');
  if (userData) {
    return isBase64(userData) && JSON.parse(atob(userData)) || null;
  }
  return null;
}

function getAgentInitialState() {
  const agentData = localStorage.getItem('agent');
  if (agentData && agentData !== 'undefined') {
    return JSON.parse(agentData);
  }
  return null;
}

function getWorkspaceInitialState() {
  const workspaceData = localStorage.getItem('workspace');
  if (workspaceData) {
    isBase64(workspaceData) && JSON.parse(atob(workspaceData)) || null;
  }
  return null;
}

export const initialState: LoginState = {
  user: getUserInitialState(),
  agent: getAgentInitialState(),
  workspace: getWorkspaceInitialState(),
  error: null
};

export const reducer = createReducer(
  initialState,
  on(loginActions.LoginAction, (state) => ({...state})),
  on(loginActions.LoginSuccessfulAction, (state, {payload}) => ({...state, user: payload, error: null})),
  on(loginActions.LoginErrorAction, (state, {error}) => ({...state, error: error})),
  on(loginActions.UpdateUserAction, (state, {payload}) => ({...state, user: payload, error: null})),
  on(loginActions.SetAgentRecord, (state, {payload}) => ({...state, agent: payload})),
  on(loginActions.SetWorkspaceRecord, (state, {payload}) => ({...state, workspace: payload})),
  on(loginActions.LogoutAction, (state) => ({user: null, agent: null, workspace: null})),
  on(loginActions.RefreshTokenAction, (state) => ({...state}))
);

export const selectLogin = createFeatureSelector<LoginState>('login');

export const selectLoginUser = createSelector(
  selectLogin,
  (state: LoginState) => state.user
);

export const getAgent = (state: LoginState) => state.agent;
export const getWorkspace = (state: LoginState) => state.workspace;
export const getLogin = (state: LoginState) => state.error;
