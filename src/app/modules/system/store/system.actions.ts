import { createAction, props } from '@ngrx/store';
import { DropdownItem } from '../../../common/components/interfaces/dropdownitem.interface';

export const ActionTypes = {
  GET_WORKSPACES: '[System] Get Workspaces',
  SET_WORKSPACES: '[System] Set Workspaces',
  SET_ACTING_FOR: '[System] Set Acting For',
  SEND_INVITATION: '[System] Send Invitation',
  SEND_INVITATION_SUCCESS: '[System] Invitation Sent Successfully',
  INVITATION_ERROR: '[System] Invation Error',
  CLEAR: '[System] Clear'
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
  props<{ workspaceId: string }>()
);

export const SendInvitationAction = createAction(
  ActionTypes.SEND_INVITATION,
  props<{ payload: { workspaceId: string; roleId:string; email: string; } }>()
);

export const SendInvitationSuccessAction = createAction(
  ActionTypes.SEND_INVITATION_SUCCESS,
  props<{ email: string; }>()
);

export const SendInvitationErrorAction = createAction(
  ActionTypes.INVITATION_ERROR
);

export const ClearAction = createAction(
  ActionTypes.CLEAR
);
