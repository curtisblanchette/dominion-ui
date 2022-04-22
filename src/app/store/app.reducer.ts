import { createFeatureSelector, createReducer, createSelector, on } from '@ngrx/store';
import * as appActions from './app.actions';
import { ISettingResponse } from '@4iiz/corev2';

export interface AppState {
  settings: ISettingResponse[] | null;
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


