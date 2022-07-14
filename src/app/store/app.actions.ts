import { createAction, props } from '@ngrx/store';
import { INestedSetting } from './app.effects';

export const ActionTypes = {
  GET_SETTINGS: '[App] Get Settings',
  SET_SETTINGS: '[App] Set Settings',
  UPDATE_SETTINGS: '[App] Update Settings',
  UPDATE_SETTINGS_SUCCESS: '[App] Update Settings Success',
  GET_LOOKUPS: '[App] Get Lookups',
  SET_LOOKUPS: '[App] Set Lookups',
  CLEAR: '[App] Clear Store',
  INITIALIZED: '[App] State Initialized'
};

export const GetSettingsAction = createAction(
  ActionTypes.GET_SETTINGS,
);

export const SetSettingsAction = createAction(
  ActionTypes.SET_SETTINGS,
  props<{ payload: any }>()
);

export const UpdateSettingsAction = createAction(
  ActionTypes.UPDATE_SETTINGS,
  props<{ payload: any, keys:Array<any> }>()
);

export const UpdateSettingsSuccessAction = createAction(
  ActionTypes.UPDATE_SETTINGS_SUCCESS
);

export const GetLookupsAction = createAction(
  ActionTypes.GET_LOOKUPS,
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

