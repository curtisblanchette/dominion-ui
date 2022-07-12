import { createAction, props } from '@ngrx/store';
import { FlowHostDirective, FlowLink, FlowRouter, FlowStep, FlowStepHistoryEntry } from '../index';

export const ActionTypes = {
  ADD_STEP: '[Flow] Add FlowStep',
  ADD_LINK: '[Flow] Add FlowLink',
  ADD_ROUTER: '[Flow] Add FlowRouter',
  ADD_VARIABLES: '[Flow] Add Variables',
  UPDATE_CURRENT_STEP: '[Flow] Update Current Step',
  SET_STEP_HISTORY: '[Flow] Set Step History',
  GO_TO_STEP: '[Flow] Go to step',
  RESET: '[Flow] Reset',
  SET_VALIDITY: '[Flow] Set Validity',

  NEXT_STEP: '[Flow] Next Step',
  PREV_STEP: '[Flow] Previous Step',
  UPDATE_BREADCRUMBS: '[Flow] Update Breadcrumbs',
  SET_PROCESS_ID: '[Flow] Set Process Id'
};

export const AddStepAction = createAction(
  ActionTypes.ADD_STEP,
  props<{ payload: FlowStep }>()
);

export const AddLinkAction = createAction(
  ActionTypes.ADD_LINK,
  props<{ payload: FlowLink }>()
);

export const SetProcessIdAction = createAction(
  ActionTypes.SET_PROCESS_ID,
  props<{ processId: string }>()
);

export const AddRouterAction = createAction(
  ActionTypes.ADD_ROUTER,
  props<{ payload: FlowRouter }>()
);

export const UpdateCurrentStepAction = createAction(
  ActionTypes.UPDATE_CURRENT_STEP,
  props<{ step: FlowStep, variables?: {[key: string]: any}, valid?: boolean }>()
);

export const SetStepHistoryAction = createAction(
  ActionTypes.SET_STEP_HISTORY,
  props<{ payload: FlowStepHistoryEntry }>()
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

export const SetValidityAction = createAction(
  ActionTypes.SET_VALIDITY,
  props<{ payload: boolean }>()
)

export const NextStepAction = createAction(
  ActionTypes.NEXT_STEP,
  props<{ stepId: string }>()
)

export const PrevStepAction = createAction(
  ActionTypes.PREV_STEP,
  props<{ stepId: string }>()
)
