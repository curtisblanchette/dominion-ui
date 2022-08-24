import { createAction, props } from '@ngrx/store';

export const ActionTypes = {
  SET_DATE_RANGE: '[Reports] Set Timeframe',
  FETCH_TOTAL_PIPELINE: '[Reports] FETCH Total Pipeline',
  FETCH_TOTAL_PIPELINE_SUCCESS: '`[Reports] FETCH Total Pipeline Success',
  FETCH_TOTAL_PIPELINE_ERROR: '`[Reports] FETCH Total Pipeline Error'
};

export const SetDateRangeAction = createAction(
  ActionTypes.SET_DATE_RANGE,
  props<{ startDate: string, endDate: string }>()
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
