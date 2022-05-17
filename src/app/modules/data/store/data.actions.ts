import { createAction, props } from '@ngrx/store';

export const ActionTypes = {
  SET_PER_PAGE: '[List] Set Per Page',
  GET_PER_PAGE: '[List] Get Per Page',
};


export const GetPerPageAction = createAction(
  ActionTypes.GET_PER_PAGE,
);

export const SetPerPageAction = createAction(
  ActionTypes.SET_PER_PAGE,
  props<{ payload: any }>()
);
