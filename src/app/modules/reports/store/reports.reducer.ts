import { createFeatureSelector, createReducer, createSelector, on } from '@ngrx/store';
import * as reportsActions from './reports.actions';

import dayjs from 'dayjs';
import { FlowLink, FlowRouter, FlowStep } from '../../flow';
import { get, merge } from 'lodash';

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
  };
  totalPipeline: ReportData | undefined;
  team: ReportData | undefined;
}

export enum ViewStatus {
  INITIAL = 'initial',
  LOADING = 'loading',
  SUCCESS = 'success',
  FAILURE = 'failure'
}

export interface ReportData {
  data: any;
  status: ViewStatus | undefined;
  errorMessage?: string | undefined;
  cachedAt: Date | string | undefined;
}

export const initialState: ReportsState = {
  dateRange: {
    startDate: dayjs().subtract(7, 'days').format('YYYY-MM-DD'),
    endDate: dayjs().format('YYYY-MM-DD')
  },
  totalPipeline: getInitialStateByKey('reports.totalPipeline') || { data: undefined, status: ViewStatus.INITIAL, errorMessage: undefined, cachedAt: undefined},
  team: getInitialStateByKey('reports.team') || { data: undefined, status: ViewStatus.INITIAL, errorMessage: undefined, cachedAt: undefined},
};

export const reducer = createReducer(
  initialState,
  on(reportsActions.SetDateRangeAction, (state, {startDate, endDate}) => {
    let dateRange: any = {};
    if(startDate) {
      dateRange['startDate'] = startDate;
    }

    if(endDate) {
      dateRange['endDate'] = endDate;
    }

    return {...state, dateRange: { ...state.dateRange, ...dateRange} };
  }),
  on(reportsActions.FetchTotalPipeline, (state: any) => {
    return { ...state, totalPipeline: merge({...state.totalPipeline}, { status: ViewStatus.LOADING } )};
  }),
  on(reportsActions.FetchTotalPipelineSuccess, (state, {data}) => {
    return { ...state, totalPipeline: merge({...data}, { cachedAt: dayjs().format(), status: ViewStatus.SUCCESS } )};
  }),
  on(reportsActions.FetchTotalPipelineError, (state, {error}) => ({...state, totalPipeline: {...state.totalPipeline, data: undefined, errorMessage: error.message, cachedAt: undefined, status: ViewStatus.FAILURE }})),

  on(reportsActions.FetchTeam, (state: any) => {
    return { ...state, team: merge({...state.team}, { status: ViewStatus.LOADING } )};
  }),
  on(reportsActions.FetchTeamSuccess, (state, {data}) => {
    return {...state, team: {data: data, cachedAt: dayjs().format(), status: ViewStatus.SUCCESS  } };
  }),
  on(reportsActions.FetchTeamError, (state, {error}) => ({...state, team: {...state.team, data: undefined, errorMessage: error.message, cachedAt: undefined, status: ViewStatus.FAILURE }})),

  on(reportsActions.ClearAction, (state) => ({
    ...state,
    totalPipeline: {
      status: ViewStatus.INITIAL,
      data: undefined,
      errorMessage: undefined,
      cachedAt: undefined
    },
    team: {
      status: ViewStatus.INITIAL,
      data: undefined,
      errorMessage: undefined,
      cachedAt: undefined
    }
  }))
);

export const selectReports = createFeatureSelector<ReportsState>('reports');

export const selectDateRange = createSelector(selectReports, (reports) => reports.dateRange)
export const selectTotalPipeline = createSelector(selectReports, (reports) => reports.totalPipeline);
export const selectTeam = createSelector(selectReports, (reports) => reports.team);


