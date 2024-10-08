import { createFeatureSelector, createReducer, createSelector, on } from '@ngrx/store';
import { User } from '../models/user';
import * as loginActions from './login.actions';

export interface LoginState {
  user: User | null;
  loading: boolean;
  mfaRequired: boolean;
  challengeParameters: any;
  error: any;
  refreshFlag: boolean;
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
  user: getUserInitialState(),
  mfaRequired: false,
  loading: false,
  challengeParameters: null,
  error: null,
  refreshFlag: false
};

export const reducer = createReducer(
  initialState,
  on(loginActions.LoginAction, (state) => ({ ...state, loading: true })),
  on(loginActions.LoginSuccessfulAction, (state, {payload}) => ({...state, user: payload, loading: false, mfaRequired: false, error: null})),
  on(loginActions.LoginMFARequiredAction, (state, {mfaRequired, challengeParameters}) => ({...state, loading: false, mfaRequired, challengeParameters, error: null})),
  on(loginActions.LoginErrorAction, (state, {error}) => ({...state, user: null, loading: false, error: error})),
  on(loginActions.UpdateUserAction, (state, {payload}) => ({...state, user: payload, error: null})),
  on(loginActions.LogoutAction, (state) => ({...state, user: null, agent: null, workspace: null})),
  on(loginActions.RefreshTokenAction, (state) => ({...state})),
  on(loginActions.AcceptInvitationAction, (state) => ({ ...state, loading: true })),
  on(loginActions.InvitationErrorAction, (state) => ({...state, loading:false})),
  on(loginActions.RefreshFlagAction, (state, {payload}) => ({...state, refreshFlag: payload})),
);

export const selectLogin = createFeatureSelector<LoginState>('login');

export const selectUser = createSelector(selectLogin, (state: LoginState) => {
    if(!state.user) { return null; }
    return new User(state.user);
});

export const loading = createSelector(selectLogin, (state: LoginState) => state.loading);
export const error = createSelector(selectLogin, (state: LoginState) => state.error);
export const refreshed = createSelector(selectLogin, (state: LoginState) => state.refreshFlag);

export const selectMFARequired = createSelector(selectLogin, (state: LoginState) => state.mfaRequired);
export const selectMFAChallengeParameters = createSelector(selectLogin, (state: LoginState) => state.challengeParameters);
