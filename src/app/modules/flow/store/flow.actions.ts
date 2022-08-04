import { createAction, props } from '@ngrx/store';
import { FlowLink, FlowRouter, FlowStep, FlowStepHistoryEntry } from '../index';

export const ActionTypes = {
  SET_FIRST_STEP_ID: '[Flow] Set First Step Id',
  ADD_STEP: '[Flow] Add FlowStep',
  ADD_LINK: '[Flow] Add FlowLink',
  ADD_ROUTER: '[Flow] Add FlowRouter',

  UPDATE_STEP_VALIDITY: '[Flow] Update Step Validity',
  UPDATE_STEP_VARIABLES: '[Flow] Update Step Variables',

  UPDATE_CURRENT_STEP_ID: '[Flow] Update Current Step Id',
  SET_STEP_HISTORY: '[Flow] Set Step History',
  GO_TO_STEP: '[Flow] Go to step',
  RESET: '[Flow] Reset',
  SET_VALIDITY: '[Flow] Set Validity',

  NEXT_STEP: '[Flow] Next Step',
  PREV_STEP: '[Flow] Previous Step',
  UPDATE_BREADCRUMBS: '[Flow] Update Breadcrumbs',
  SET_PROCESS_ID: '[Flow] Set Process Id',

  CLEAR: '[Flow] Clear Store',

  ADD_MEDIATOR_ACTION: '[Flow] Add Mediator Action'
};
export const AddStepAction = createAction(
  ActionTypes.ADD_STEP,
  props<{ payload: FlowStep }>()
);
export const SetFirstStepIdAction = createAction(
  ActionTypes.SET_FIRST_STEP_ID,
  props<{ id: string }>()
);


export const UpdateStepValidityAction = createAction(
  ActionTypes.UPDATE_STEP_VALIDITY,
  props<{ id: string | undefined, valid: boolean; }>()
);

export const UpdateStepVariablesAction = createAction(
  ActionTypes.UPDATE_STEP_VARIABLES,
  props<{ id: string | undefined, variables: any; }>()
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

export const UpdateCurrentStepIdAction = createAction(
  ActionTypes.UPDATE_CURRENT_STEP_ID,
  props<{id: string}>()
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

export const NextStepAction = createAction(
  ActionTypes.NEXT_STEP,
  props<{ stepId: string }>()
)

export const PrevStepAction = createAction(
  ActionTypes.PREV_STEP,
  props<{ stepId: string }>()
)

export const ClearAction = createAction(
  ActionTypes.CLEAR
)

export const AddMediatorAction = createAction(
  ActionTypes.ADD_MEDIATOR_ACTION,
  props<{ action: string }>()
)

