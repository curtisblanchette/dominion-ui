import { createFeatureSelector, createReducer, createSelector, on } from '@ngrx/store';
import * as appActions from './app.actions';
import { INestedSetting } from './app.effects';

export interface AppState {
  settings: any;
  roles: any;
  initialized: boolean;
}

export const initialState: AppState = {
  settings: localStorage.getItem('settings') && JSON.parse(localStorage.getItem('settings') || '') || null,
  roles: localStorage.getItem('roles') && JSON.parse(localStorage.getItem('roles') || '' ) || null,
  initialized: localStorage.getItem('initialized') && JSON.parse(localStorage.getItem('initialized') || 'false' ) || false
};

export const reducer = createReducer(
  initialState,
  on(appActions.GetSettingsAction, (state) => ({ ...state })),
  on(appActions.SetSettingsAction, (state, {payload}) => ({ ...state, settings: payload })),
  on(appActions.ClearSettingsAction, (state) => ({ ...state, settings: null })),

  on(appActions.GetRolesAction, (state) => ({ ...state })),
  on(appActions.SetRolesAction, (state, {payload}) => ({ ...state, roles: payload })),
  on(appActions.ClearRolesAction, (state) => ({ ...state, roles: null })),
  on(appActions.AppInitializedAction, (state) => ({...state, initialized: true}))
);

export const selectApp = createFeatureSelector<AppState>('app');

export const selectSettings = createSelector(selectApp, (state: AppState) => state.settings);
export const selectSettingGroup = (group: string) => createSelector(selectSettings, (settings: {[key: string]: INestedSetting}) => settings[group] || {});
export const selectSettingByKey = (name: string) => createSelector(selectSettings, (settings: {[key: string]: INestedSetting}) => findByKey(settings, name));

export const selectRoles = createSelector(selectApp, (state: AppState) => state.roles);
export const selectInitialized = createSelector(selectApp, (state: AppState) => state.initialized);

const findByKey = (obj: any, kee: string): any => {
  if (kee in obj) return obj[kee];
  for(let n of Object.values(obj).filter(Boolean).filter(v => typeof v === 'object')) {
    let found = findByKey(n, kee)
    if (found) return found
  }
}

const findByProperty = (obj: any, predicate: Function): any => {
  if (predicate(obj)) return obj
  for(let n of Object.values(obj).filter(Boolean).filter(v => typeof v === 'object')) {
    let found = findByProperty(n, predicate)
    if (found) return found
  }
}
