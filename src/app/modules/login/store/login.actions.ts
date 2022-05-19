import { createAction, props } from '@ngrx/store';
import { User } from '../models/user';

export const ActionTypes = {
  LOGIN: '[Login] Login',
  LOGIN_SUCCESSFUL: '[Login] Login Successful',
  GET_USER: '[Login] Get User',
  LOGIN_ERROR: '[Login] Login Error',
  FETCH_USER: '[Login] Fetch User Record',
  UPDATE_RECORD: '[Login] Update User',
  LOGOUT: '[Login] Logout',
  REFRESH_TOKEN: '[Login] Refresh Token',
  ACCEPT_INVITATION: '[Login] Accept Invitation'
};

export interface ILoginCredentials {
  username: string,
  password: string,
  remember_me: string
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

export const LoginSuccessfulAction = createAction(
  ActionTypes.LOGIN_SUCCESSFUL,
  props<{ payload: User }>()
);

export const GetUserAction = createAction(
  ActionTypes.GET_USER,
  props<{ payload: User }>()
);

export const LoginErrorAction = createAction(
  ActionTypes.LOGIN_ERROR,
  props<{ error: any }>()
);

export const UpdateUserAction = createAction(
  ActionTypes.UPDATE_RECORD,
  props<{ payload: User }>()
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
  props<{ payload: User }>()
);
