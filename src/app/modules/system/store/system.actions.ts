import { createAction, props } from '@ngrx/store';
import { IWorkspace } from '@4iiz/corev2';
import { DropdownItem } from '../../../common/components/ui/forms';

export const ActionTypes = {
  GET_WORKSPACES: '[System] Get Workspaces',
  SET_WORKSPACES: '[System] Set Workspaces'
};


export const GetWorkspacesAction = createAction(
  ActionTypes.GET_WORKSPACES
);

export const SetWorkspacesAction = createAction(
  ActionTypes.SET_WORKSPACES,
  props<{ payload: DropdownItem[] }>()
);
