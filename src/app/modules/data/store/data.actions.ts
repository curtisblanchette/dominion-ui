import { createAction, props } from '@ngrx/store';

export const ActionTypes = {
    GET_DATA : '[Data] Add FlowStep',
};

export const AddStepAction = createAction(
    ActionTypes.GET_DATA,
    props<{ payload:any }>()
);