import { createAction, props } from '@ngrx/store';
import { FlowLink, FlowRouter, FlowStep } from '../_core';

export const ActionTypes = {
  ADD_STEP: '[Flow] Add FlowStep',
  ADD_LINK: '[Flow] Add FlowLink',
  ADD_ROUTER: '[Flow] Add FlowRouter',
  SET_CURRENT_STEP: '[Flow] Set Current Step',
  GO_TO_STEP: '[Flow] Go to step'
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

export const GoToStepByIdAction = createAction(
  ActionTypes.GO_TO_STEP,
  props<{ id: string }>()
);

