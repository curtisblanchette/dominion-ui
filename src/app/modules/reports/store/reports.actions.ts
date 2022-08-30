import { createAction, props } from '@ngrx/store';
import { ReportData } from './reports.reducer';

export const ActionTypes = {
  SET_DATE_RANGE: '[Reports] Set Timeframe',
  FETCH_TOTAL_PIPELINE: '[Reports] FETCH Total Pipeline',
  FETCH_TOTAL_PIPELINE_SUCCESS: '[Reports] FETCH Total Pipeline Success',
  FETCH_TOTAL_PIPELINE_ERROR: '[Reports] FETCH Total Pipeline Error',
  FETCH_TEAM: '[Reports] FETCH Team Report',
  FETCH_TEAM_SUCCESS: '[Reports] FETCH Team Report Success',
  FETCH_TEAM_ERROR: '[Reports] FETCH Team Report Error',
  CLEAR: '[Reports] Clear'
};

export const SetDateRangeAction = createAction(
  ActionTypes.SET_DATE_RANGE,
  props<{ startDate?: string, endDate?: string }>()
);

export const FetchTotalPipeline = createAction(
  ActionTypes.FETCH_TOTAL_PIPELINE,
);

export const FetchTotalPipelineSuccess = createAction(
  ActionTypes.FETCH_TOTAL_PIPELINE_SUCCESS,
  props<{ data: any }>()
);

export const FetchTotalPipelineError = createAction(
  ActionTypes.FETCH_TOTAL_PIPELINE_ERROR,
  props<{ error: Error }>()
);

export const FetchTeam = createAction(
  ActionTypes.FETCH_TEAM,
);

export const FetchTeamSuccess = createAction(
  ActionTypes.FETCH_TEAM_SUCCESS,
  props<{ data: any }>()
);

export const FetchTeamError = createAction(
  ActionTypes.FETCH_TEAM_ERROR,
  props<{ error: Error }>()
);

export const ClearAction = createAction(
  ActionTypes.CLEAR
)
