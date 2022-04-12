import { createAction, props } from '@ngrx/store';
import { User } from '../models/user';

export const ActionTypes = {
    LOGIN: 'Log user to app',
    LOGIN_SUCCESSFUL: 'Log in successful',
    LOGIN_ERROR:'Log in error',
    UPDATE_RECORD:'Update record',
    SET_AGENT_RECORD: 'Set agent record (if exists)',
    SET_WORKSPACE_RECORD: 'Set workspace record',
    START_PM_LOGIN: 'Log user using PM Login',
    LOGOUT_USER: 'Logout user',
    REFRESH_TOKEN: 'Refresh token'
};

export interface loginCredentials {
    username:string,
    password:string,
    remember_me:string
}

export const LoginAction = createAction(
    ActionTypes.LOGIN,
    props<{ payload: loginCredentials }>()
);

export const LoginSuccessfulAction = createAction(
    ActionTypes.LOGIN_SUCCESSFUL,
    props<{ payload: User }>()
);

export const LoginErrorAction = createAction(
    ActionTypes.LOGIN_ERROR,
    props<{ error: any }>()
);

export const UpdateUserAction = createAction(
    ActionTypes.UPDATE_RECORD,
    props<{ payload: User }>()
)

export const SetAgentRecord = createAction(
    ActionTypes.SET_AGENT_RECORD,
    props<{ payload: User }>()
);

export const SetWorkspaceRecord = createAction(
    ActionTypes.SET_WORKSPACE_RECORD,
    props<{ payload: User }>()
);

export const LogoutUserAction = createAction(
    ActionTypes.LOGOUT_USER
);

export const RefreshTokenAction = createAction(
  ActionTypes.REFRESH_TOKEN,
  props<{ payload: User }>()
);
