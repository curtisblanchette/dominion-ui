import { createFeatureSelector, createReducer, createSelector, on } from '@ngrx/store';
import * as reportsActions from './reports.actions';

export interface ReportsState {
  timeframe: {
    startDate: string;
    endDate: string;
  }
}

export const initialState: ReportsState = {
  timeframe: {
    startDate: '',
    endDate: ''
  }
};

export const reducer = createReducer(
  initialState,
  on(reportsActions.SetTimeframeAction, (state, {startDate, endDate}) => ({ ...state, timeframe: { startDate, endDate }}))
);

export const selectReports = createFeatureSelector<ReportsState>('reports');


