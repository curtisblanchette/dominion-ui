import { createFeatureSelector, createReducer, createSelector, on } from '@ngrx/store';
import * as appActions from './app.actions';
import { ISetting } from './app.effects';
import { getInitialStateByKey } from './util';
import { DropdownItem } from '../common/components/interfaces/dropdownitem.interface';

export interface AppState {
  settings: any;
  workspace: any;
  lookups: any;
  initialized: boolean;
  loading: boolean;
  errorMessage: string | undefined;
}

export const initialState: AppState = {
  settings: getInitialStateByKey('app.settings') || null,
  workspace: getInitialStateByKey('app.workspace') || null,
  lookups: getInitialStateByKey('app.lookups') || null,
  initialized: getInitialStateByKey('app.initialized') || false,
  loading: false,
  errorMessage: undefined
};

export const reducer = createReducer(
  initialState,

  on(appActions.FetchWorkspaceAction, (state) => ({...state, loading: true})),
  on(appActions.FetchWorkspaceSuccessAction, (state, {payload}) => {
    return {...state, workspace: payload, loading: false};
  }),
  on(appActions.FetchWorkspaceFailureAction, (state, {payload}) => ({
    ...state,
    errorMessage: 'Error fetching workspace.',
    loading: false
  })),

  on(appActions.FetchSettingsAction, (state) => ({...state, loading: true})),
  on(appActions.FetchSettingsSuccessAction, (state, {payload}) => ({...state, settings: payload, loading: false})),
  on(appActions.FetchSettingsFailureAction, (state, {payload}) => ({
    ...state,
    errorMessage: 'Error fetching settings.',
    loading: false
  })),

  on(appActions.SaveSettingsAction, (state) => ({...state, loading: true})),
  on(appActions.SaveSettingsSuccessAction, (state, {payload}) => ({
      ...state,
      ...{ settings: payload },
      loading: false
  })),
  on(appActions.SaveSettingsFailureAction, (state, {payload}) => ({
    ...state,
    errorMessage: 'Error saving settings',
    loading: false
  })),

  on(appActions.FetchLookupsAction, (state) => ({...state})),
  on(appActions.SetLookupsAction, (state, {payload}) => ({...state, lookups: payload})),

  on(appActions.ClearAction, (state) => ({...state, settings: null, workspace: null, initialized: false, loading: false})),
  on(appActions.AppInitializedAction, (state) => ({...state, loading: false, initialized: true}))
);

export const selectApp = createFeatureSelector<AppState>('app');


export const selectWorkspace = createSelector(selectApp, (state: AppState) => state.workspace);

export const selectSettings = createSelector(selectApp, (state: AppState) => state.settings);
export const selectSettingGroup = (group: string) => createSelector(selectSettings, (settings: ISetting[]) => settings.filter(setting => setting.group === group));
export const selectSettingByKey = (name: string) => createSelector(selectSettings, (settings: ISetting[]) => settings.find(setting => setting.name === name));

export const selectLookups = createSelector(selectApp, (state: AppState) => state.lookups);
export const selectLookupsByKey = (key: string) => createSelector(selectLookups, (state: { [key: string]: DropdownItem[] }) => state[key]);
export const selectLookupByLabel = (key: string, label: string) => createSelector(selectLookupsByKey(key), (lookup: DropdownItem[]) => {
  return lookup.find(lk => lk.label === label);
});

export const selectRoles = createSelector(selectApp, (state: AppState) => state.lookups.role);
export const selectPracticeAreas = createSelector(selectApp, (state: AppState) => state.lookups.practiceArea);
export const selectOffices = createSelector(selectApp, (state: AppState) => state.lookups.office);
export const selectCallObjections = createSelector(selectApp, (state: AppState) => state.lookups.callObjection);
export const selectTimezones = createSelector(selectApp, (state: AppState) => state.lookups.timezone);
export const selectUSStates = createSelector(selectApp, (state: AppState) => state.lookups.state);
export const selectLookupByKeyAndId = (key: string, id: string | number) => createSelector(selectApp, (state: AppState) => state.lookups[key].find((lk: DropdownItem) => lk.id === id));

export const selectInitialized = createSelector(selectApp, (state: AppState) => state.initialized);
export const loading = createSelector(selectApp, (state: AppState) => state.loading);

const findByKey = (obj: any, key: string): any => {
  if (key in obj) return obj[key];
  for (let n of Object.values(obj).filter(Boolean).filter(v => typeof v === 'object')) {
    let found = findByKey(n, key)
    if (found) return found
  }
}

const findByProperty = (obj: any, predicate: Function): any => {
  if (predicate(obj)) return obj
  for (let n of Object.values(obj).filter(Boolean).filter(v => typeof v === 'object')) {
    let found = findByProperty(n, predicate)
    if (found) return found
  }
}


