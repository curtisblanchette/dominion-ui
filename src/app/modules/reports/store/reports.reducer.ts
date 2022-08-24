import { createFeatureSelector, createReducer, createSelector, on } from '@ngrx/store';
import * as reportsActions from './reports.actions';

import * as dayjs from 'dayjs';
import { FlowLink, FlowRouter, FlowStep } from '../../flow';
import { get } from 'lodash';

const getInitialStateByKey = (key: string): any | (FlowStep | FlowRouter | FlowLink)[] | undefined => {
  let state = localStorage.getItem('state') || '';

  if (state) {
    // Lodash _.get enables dot.notation objects queries
    const value = get(state, key);
    if (value) {
      return value;
    }
  }
}

export interface ReportsState {
  dateRange: {
    startDate: string;
    endDate: string;
  },
  totalPipeline: ReportData | undefined,
  team: ReportData | undefined,
}

export interface ReportData {
  data: any;
  cachedAt: Date | string | undefined
}

export const initialState: ReportsState = {
  dateRange: {
    startDate: dayjs().format('YYYY-MM-DD'),
    endDate: dayjs().subtract(7, 'days').format('YYYY-MM-DD')
  },
  totalPipeline: getInitialStateByKey('reports.totalPipeline'),
  team: getInitialStateByKey('reports.team')
};

export const reducer = createReducer(
  initialState,
  on(reportsActions.SetDateRangeAction, (state, {startDate, endDate}) => ({ ...state, dateRange: { startDate, endDate }})),
  on(reportsActions.FetchTotalPipelineSuccess, (state, {data}) => ({...state, totalPipeline: { data, cachedAt: dayjs().format() }}))
);

export const selectReports = createFeatureSelector<ReportsState>('reports');

export const getDateRange = createSelector(selectReports, (reports) => reports.dateRange)
export const getTotalPipeline = createSelector(selectReports, (reports) => {
  return reports.totalPipeline?.data;
});


