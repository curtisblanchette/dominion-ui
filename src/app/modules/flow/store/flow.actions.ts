import { createAction, props } from '@ngrx/store';
import { FlowLink, FlowRouter, FlowStep } from '../_core';

export const ActionTypes = {
  ADD_STEP: '[Flow] Add FlowStep',
  ADD_LINK: '[Flow] Add FlowLink',
  ADD_ROUTER: '[Flow] Add FlowRouter',
  ADD_VARIABLES: '[Flow] Add Variables',
  SET_CURRENT_STEP: '[Flow] Set Current Step',
  SET_STEP_HISTORY: '[Flow] Set Step History',
  GO_TO_STEP: '[Flow] Go to step',
  RESET: '[Flow] Reset'
};

export const AddStepAction = createAction(
  ActionTypes.ADD_STEP,
  props<{ payload: FlowStep }>()
);

export const AddLinkAction = createAction(
  ActionTypes.ADD_LINK,
  props<{ payload: FlowLink }>()
);

export const AddRouterAction = createAction(
  ActionTypes.ADD_ROUTER,
  props<{ payload: FlowRouter }>()
);

export const SetCurrentStepAction = createAction(
  ActionTypes.SET_CURRENT_STEP,
  props<{ payload: FlowStep }>()
);

export const SetStepHistoryAction = createAction(
  ActionTypes.SET_STEP_HISTORY,
  props<{ payload: string[] }>()
);

export const GoToStepByIdAction = createAction(
  ActionTypes.GO_TO_STEP,
  props<{ id: string }>()
);

export const ResetAction = createAction(
  ActionTypes.RESET
);

export const AddVariablesAction = createAction(
  ActionTypes.ADD_VARIABLES,
  props<{ payload: any }>()
);