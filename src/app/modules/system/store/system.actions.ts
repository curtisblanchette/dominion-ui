import { createAction, props } from '@ngrx/store';
import { DropdownItem } from '../../../common/components/ui/forms';

export const ActionTypes = {
  GET_WORKSPACES: '[System] Get Workspaces',
  SET_WORKSPACES: '[System] Set Workspaces',
  SET_ACTING_FOR: '[System] Set Acting For'
};


export const GetWorkspacesAction = createAction(
  ActionTypes.GET_WORKSPACES
);

export const SetWorkspacesAction = createAction(
  ActionTypes.SET_WORKSPACES,
  props<{ payload: DropdownItem[] }>()
);

export const SetActingForAction = createAction(
  ActionTypes.SET_ACTING_FOR,
  props<{ id: string }>()
);
