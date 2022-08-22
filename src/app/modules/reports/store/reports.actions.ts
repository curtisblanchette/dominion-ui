import { createAction, props } from '@ngrx/store';

export const ActionTypes = {
  SET_TIMEFRAME: '[Reports] Set Timeframe'
};

export const SetTimeframeAction = createAction(
  ActionTypes.SET_TIMEFRAME,
  props<{ startDate: string, endDate: string }>()
);
