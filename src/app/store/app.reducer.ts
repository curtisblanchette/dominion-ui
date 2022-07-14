import { createFeatureSelector, createReducer, createSelector, on } from '@ngrx/store';
import * as appActions from './app.actions';
import { INestedSetting } from './app.effects';
import { getInitialStateByKey } from './util';

export interface AppState {
  settings: any;
  lookups: any;
  initialized: boolean;
  loading: boolean;
}

export const initialState: AppState = {
  settings: getInitialStateByKey('app.settings') || null,
  lookups: getInitialStateByKey('app.lookups') || null,
  initialized: getInitialStateByKey('app.initialized') || false,
  loading: false
};

export const reducer = createReducer(
  initialState,
  on(appActions.GetSettingsAction, (state) => ({ ...state })),
  on(appActions.SetSettingsAction, (state, {payload}) => ({ ...state, settings: payload })),
  on(appActions.UpdateSettingsAction, (state, {payload, keys} ) => {
    state.settings[keys[0]][keys[1]] = payload;
    return {...state, loading: true};
  }),
  on(appActions.UpdateSettingsSuccessAction, (state) => ({ ...state, loading: false })),

  on(appActions.GetLookupsAction, (state) => ({ ...state })),
  on(appActions.SetLookupsAction, (state, {payload}) => ({ ...state, lookups: payload })),

  on(appActions.ClearAction, (state) => ({ ...state, roles: null, settings: null, initialized: false, loading: false })),
  on(appActions.AppInitializedAction, (state) => ({...state, loading: false, initialized: true}))

);

export const selectApp = createFeatureSelector<AppState>('app');

export const selectSettings = createSelector(selectApp, (state: AppState) => state.settings);
export const selectSettingGroup = (group: string) => createSelector(selectSettings, (settings: {[key: string]: INestedSetting}) => settings[group] || {});
export const selectSettingByKey = (name: string) => createSelector(selectSettings, (settings: {[key: string]: INestedSetting}) => findByKey(settings, name));

export const selectLookups = createSelector(selectApp, (state: AppState) => state.lookups);
export const selectRoles = createSelector(selectApp, (state: AppState) => state.lookups.roles);
export const selectPracticeAreas = createSelector(selectApp, (state: AppState) => state.lookups.practiceAreas);
export const selectOffices = createSelector(selectApp, (state: AppState) => state.lookups.offices);

export const selectInitialized = createSelector(selectApp, (state: AppState) => state.initialized);
export const loading = createSelector(selectApp, (state: AppState) => state.loading);

const findByKey = (obj: any, key: string): any => {
  if (key in obj) return obj[key];
  for(let n of Object.values(obj).filter(Boolean).filter(v => typeof v === 'object')) {
    let found = findByKey(n, key)
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


