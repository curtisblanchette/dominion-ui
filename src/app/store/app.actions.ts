import { createAction, props } from '@ngrx/store';

export const ActionTypes = {

  FETCH_WORKSPACE: '[App] Fetch Workspace',
  FETCH_WORKSPACE_SUCCESS: '[App] Fetch Workspace Success',
  FETCH_WORKSPACE_FAILURE: '[App] Fetch Workspace Failure',

  FETCH_SETTINGS: '[App] Fetch Settings',
  FETCH_SETTINGS_SUCCESS: '[App] Fetch Settings Success',
  FETCH_SETTINGS_FAILURE: '[App] Fetch Settings Failure',

  SAVE_SETTINGS: '[App] Save Settings',
  SAVE_SETTINGS_SUCCESS: '[App] Save Settings Success',
  SAVE_SETTINGS_FAILURE: '[App] Save Settings Failure',

  FETCH_LOOKUPS: '[App] Fetch Lookups',
  SET_LOOKUPS: '[App] Set Lookups',
  CLEAR: '[App] Clear Store',
  INITIALIZED: '[App] State Initialized'
};

export const FetchWorkspaceAction = createAction(
  ActionTypes.FETCH_WORKSPACE,
);

export const FetchWorkspaceSuccessAction = createAction(
  ActionTypes.FETCH_WORKSPACE_SUCCESS,
  props<{ payload: any }>()
);

export const FetchWorkspaceFailureAction = createAction(
  ActionTypes.FETCH_WORKSPACE_FAILURE,
  props<{ payload: any }>()
);


export const FetchSettingsAction = createAction(
  ActionTypes.FETCH_SETTINGS,
);

export const FetchSettingsSuccessAction = createAction(
  ActionTypes.FETCH_SETTINGS_SUCCESS,
  props<{ payload: any }>()
);

export const FetchSettingsFailureAction = createAction(
  ActionTypes.FETCH_SETTINGS_FAILURE,
  props<{ payload: any }>()
);


export const SaveSettingsAction = createAction(
  ActionTypes.SAVE_SETTINGS,
  props<{ payload: any }>()
);

export const SaveSettingsSuccessAction = createAction(
  ActionTypes.SAVE_SETTINGS_SUCCESS,
  props<{ payload: any }>()
);

export const SaveSettingsFailureAction = createAction(
  ActionTypes.SAVE_SETTINGS_FAILURE,
  props<{ payload: any }>()
);

export const FetchLookupsAction = createAction(
  ActionTypes.FETCH_LOOKUPS,
);

export const SetLookupsAction = createAction(
  ActionTypes.SET_LOOKUPS,
  props<{ payload: any }>()
);

export const ClearAction = createAction(
  ActionTypes.CLEAR,
);

export const AppInitializedAction = createAction(
  ActionTypes.INITIALIZED,
);

