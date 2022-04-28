import { createAction, props } from '@ngrx/store';

export const ActionTypes = {
  GET_SETTINGS: '[App] Get Settings',
  SET_SETTINGS: '[App] Set Settings',
  CLEAR_SETTINGS: '[App] Clear Settings',
  GET_ROLES: '[App] Get Roles',
  SET_ROLES: '[App] Set Roles',
  CLEAR_ROLES: '[App] Clear Roles',
  INITIALIZED: '[App] State Initialized',
};

export const GetSettingsAction = createAction(
  ActionTypes.GET_SETTINGS,
);

export const SetSettingsAction = createAction(
  ActionTypes.SET_SETTINGS,
  props<{ payload: any }>()
);

export const ClearSettingsAction = createAction(
  ActionTypes.CLEAR_SETTINGS,
);

export const GetRolesAction = createAction(
  ActionTypes.GET_ROLES,
);

export const SetRolesAction = createAction(
  ActionTypes.SET_ROLES,
  props<{ payload: any }>()
);

export const ClearRolesAction = createAction(
  ActionTypes.CLEAR_ROLES,
);

export const AppInitializedAction = createAction(
  ActionTypes.INITIALIZED,
);
