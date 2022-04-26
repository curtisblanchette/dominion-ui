import { createFeatureSelector, createReducer, createSelector, on } from '@ngrx/store';
import * as appActions from './app.actions';

export interface AppState {
  settings: any
}

export const initialState: AppState = {
  settings: localStorage.getItem('settings') && JSON.parse(localStorage.getItem('settings') || '') || null
};

export const reducer = createReducer(
  initialState,
  on(appActions.GetSettingsAction, (state) => ({ ...state })),
  on(appActions.SetSettingsAction, (state, {payload}) => ({ ...state, settings: payload })),
  on(appActions.ClearSettingsAction, (state) => ({ ...state, settings: null }))
);

export const selectApp = createFeatureSelector<AppState>('app');

export const selectSettings = createSelector(selectApp, (state: AppState) => state.settings);
export const selectSettingGroup = ( group: string ) => createSelector(selectSettings, (state: AppState) => state.settings[group] || {});
export const selectSettingById = ( id: number ) => createSelector(selectSettings, (state: AppState) => findByProperty(state.settings, (val: any) => val.id === id));


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
