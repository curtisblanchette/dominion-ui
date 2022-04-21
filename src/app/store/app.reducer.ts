import { createReducer, createSelector, on } from '@ngrx/store';
import * as appActions from './app.actions';

export interface AppState {
  settings: any;
}

export const initialState: AppState = {
  settings: localStorage.getItem('settings') || null
};

export const reducer = createReducer(
  initialState,
  on(appActions.GetSettingsAction, (state) => ({ ...state })),
  on(appActions.SetSettingsAction, (state, {payload}) => ({ ...state, settings: payload })),
  on(appActions.ClearSettingsAction, (state) => ({ ...state, settings: null }))
);

export const selectState = (state: AppState) => state;

export const selectSettings   = createSelector(selectState, (state: AppState) => state.settings);
