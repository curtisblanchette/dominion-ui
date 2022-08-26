import { createAction, props } from '@ngrx/store';
import { FlowLink, FlowRouter, FlowStep, FlowStepHistoryEntry } from '../index';
import { FlowState } from './flow.reducer';

export const ActionTypes = {
  UPDATE_FLOW: '[Flow] Set First Step Id',
  ADD_STEP: '[Flow] Add FlowStep',
  ADD_LINK: '[Flow] Add FlowLink',
  ADD_ROUTER: '[Flow] Add FlowRouter',

  UPDATE_STEP: '[Flow] Update Step',

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

  ADD_MEDIATOR_ACTION: '[Flow] Add Mediator Action',
  ADD_NOTES: '[Flow] Add Notes'
};
export const AddStepAction = createAction(
  ActionTypes.ADD_STEP,
  props<{ payload: FlowStep }>()
);
export const UpdateFlowAction = createAction(
  ActionTypes.UPDATE_FLOW,
  props<Partial<FlowState>>()
);
export const UpdateStepAction = createAction(
  ActionTypes.UPDATE_STEP,
  props<{ id: string | undefined, changes: Partial<FlowStep>, strategy: 'merge'|'overwrite' }>()
);

export const AddLinkAction = createAction(
  ActionTypes.ADD_LINK,
  props<{ payload: FlowLink }>()
);

export const AddRouterAction = createAction(
  ActionTypes.ADD_ROUTER,
  props<{ payload: FlowRouter }>()
);

// export const SetStepHistoryAction = createAction(
//   ActionTypes.SET_STEP_HISTORY,
//   props<{ payload: FlowStepHistoryEntry }>()
// );

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

export const addNotesAction = createAction(
  ActionTypes.ADD_NOTES,
  props<{ notes:string }>()
);