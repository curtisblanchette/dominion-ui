import { createAction, props } from '@ngrx/store';
import { User } from '../models/user';

export const ActionTypes = {
    LOG_USER: 'Log user to app',
    LOGIN_SUCCESSFULL: 'Log in successfull',
    LOGIN_ERROR:'Log in error',
    UPDATE_RECORD:'Update record',
    SET_AGENT_RECORD: 'Set agent record (if exists)',
    SET_WORKSPACE_RECORD: 'Set workspace record',
    START_PM_LOGIN: 'Log user using PM Login',
    LOGOUT_USER: 'Logout user'
};

export interface loginCredentials {
    username:string,
    password:string,
    remember_me:string
};

export const LogUserAction = createAction(
    ActionTypes.LOG_USER,
    props<{ payload:loginCredentials }>()
);

export const LogInSuccesfullAction = createAction(
    ActionTypes.LOGIN_SUCCESSFULL,
    props<{ payload:User }>()
);

export const LogInErrorAction = createAction(
    ActionTypes.LOGIN_ERROR,
    props<{error:any}>()
);

export const UpdateUserAction = createAction(
    ActionTypes.UPDATE_RECORD,
    props<{ payload:User }>()
)

export const SetAgentRecord = createAction(
    ActionTypes.SET_AGENT_RECORD,
    props<{ payload:User }>()
);

export const SetWorkspaceRecord = createAction(
    ActionTypes.SET_WORKSPACE_RECORD,
    props<{ payload:User }>()
);

export const LogoutUserAction = createAction(
    ActionTypes.LOGOUT_USER
);
