import { createAction, props } from '@ngrx/store';

export const ActionTypes = {
  GET_SETTINGS: '[App] Get Settings',
  SET_SETTINGS: '[App] Set Settings',
  CLEAR_SETTINGS: '[App] Clear Settings'
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

