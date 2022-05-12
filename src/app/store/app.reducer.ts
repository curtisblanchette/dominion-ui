import { createFeatureSelector, createReducer, createSelector, on } from '@ngrx/store';
import * as appActions from './app.actions';
import { INestedSetting } from './app.effects';

export interface AppState {
  settings: any;
  lookups: any;
  initialized: boolean;
}

export const initialState: AppState = {
  settings: localStorage.getItem('settings') && JSON.parse(localStorage.getItem('settings') || '') || null,
  lookups: localStorage.getItem('lookups') && JSON.parse(localStorage.getItem('lookups') || '' ) || null,
  initialized: localStorage.getItem('initialized') && JSON.parse(localStorage.getItem('initialized') || 'false' ) || false
};

export const reducer = createReducer(
  initialState,
  on(appActions.GetSettingsAction, (state) => ({ ...state })),
  on(appActions.SetSettingsAction, (state, {payload}) => ({ ...state, settings: payload })),
  on(appActions.ClearSettingsAction, (state) => ({ ...state, settings: null })),

  on(appActions.GetLookupsAction, (state) => ({ ...state })),
  on(appActions.SetLookupsAction, (state, {payload}) => ({ ...state, lookups: payload })),

  on(appActions.ClearRolesAction, (state) => ({ ...state, roles: null })),
  on(appActions.AppInitializedAction, (state) => ({...state, initialized: true}))
);

export const selectApp = createFeatureSelector<AppState>('app');

export const selectSettings = createSelector(selectApp, (state: AppState) => state.settings);
export const selectSettingGroup = (group: string) => createSelector(selectSettings, (settings: {[key: string]: INestedSetting}) => settings[group] || {});
export const selectSettingByKey = (name: string) => createSelector(selectSettings, (settings: {[key: string]: INestedSetting}) => findByKey(settings, name));

export const selectLookups = createSelector(selectApp, (state: AppState) => state.lookups);
export const selectRoles = createSelector(selectApp, (state: AppState) => state.lookups.roles);
export const selectPracticeAreas = createSelector(selectApp, (state: AppState) => state.lookups.practiceAreas);

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
