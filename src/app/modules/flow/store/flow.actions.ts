import { createAction, props } from '@ngrx/store';
import { FlowLink, FlowRouter, FlowStep } from '../_core';

export const ActionTypes = {
  ADD_STEP: 'Add FlowStep',
  ADD_LINK: 'Add FlowLink',
  ADD_ROUTER: 'Add FlowRouter'
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
