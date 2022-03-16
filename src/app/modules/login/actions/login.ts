import { createAction, props } from '@ngrx/store';
import { User } from '../models/user';

export const ActionTypes = {
    LOG_USER: 'Log user to app',
    SET_AGENT_RECORD: 'Set agent record (if exists)',
    SET_WORKSPACE_RECORD: 'Set workspace record',
    START_PM_LOGIN: 'Log user using PM Login',
    LOGOUT_USER: 'Logout user'
};

export const LogUserAction = createAction(
    ActionTypes.LOG_USER,
    props<{ payload:User }>()
);

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