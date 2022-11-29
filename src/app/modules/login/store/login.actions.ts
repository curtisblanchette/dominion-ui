import { createAction, props } from '@ngrx/store';
import { User } from '../models/user';

export const ActionTypes = {
  LOGIN: '[Login] Login',
  LOGIN_SUCCESSFUL: '[Login] Login Successful',
  MFA_REQUIRED: '[Login] MFA Required',
  SEND_MFA_CODE: '[Login] Send MFA Code',
  GET_USER: '[Login] Get User',
  LOGIN_ERROR: '[Login] Login Error',
  UPDATE_RECORD: '[Login] Update User',
  LOGOUT: '[Login] Logout',
  REFRESH_TOKEN: '[Login] Refresh Token',
  ACCEPT_INVITATION: '[Login] Accept Invitation',
  INVITATION_ERROR: '[Login] Invitation Error',
  REFRESH_FLAG: '[Login] Refresh Flag',
};

export interface ILoginCredentials {
  username: string,
  password: string,
}

export interface ISignup {
  email: string;
  workspaceId: string;
  firstName: string;
  lastName: string;
  password: string
  confirmPassword: string;
}

export interface IInvitationCode {
  id: string;
  workspaceId: string;
  email: string
}

export const LoginAction = createAction(
  ActionTypes.LOGIN,
  props<{ payload: ILoginCredentials }>()
);

export const SendMFACodeAction = createAction(
  ActionTypes.LOGIN,
  props<{ payload: { mfaCode: string } }>()
);

export const LoginSuccessfulAction = createAction(
  ActionTypes.LOGIN_SUCCESSFUL,
  props<{ payload: User | any }>()
);

export const LoginMFARequiredAction = createAction(
  ActionTypes.MFA_REQUIRED,
  props<{ payload: boolean }>()
);

export const GetUserAction = createAction(
  ActionTypes.GET_USER
);

export const LoginErrorAction = createAction(
  ActionTypes.LOGIN_ERROR,
  props<{ error: any }>()
);

export const UpdateUserAction = createAction(
  ActionTypes.UPDATE_RECORD,
  props<{ payload: User | any }>()
);

export const LogoutAction = createAction(
  ActionTypes.LOGOUT
);

export const AcceptInvitationAction = createAction(
  ActionTypes.ACCEPT_INVITATION,
  props<{ code: IInvitationCode, payload: ISignup }>()
);

export const RefreshTokenAction = createAction(
  ActionTypes.REFRESH_TOKEN,
  props<{ payload: User | string }>()
);

export const InvitationErrorAction = createAction(
  ActionTypes.INVITATION_ERROR
);

export const RefreshFlagAction = createAction(
  ActionTypes.REFRESH_FLAG,
  props<{ payload:boolean }>()
);
