import { createAction, props } from '@ngrx/store';
import { User } from '../models/user';

export const ActionTypes = {
    LOGIN: '[Login] Login',
    LOGIN_SUCCESSFUL: '[Login] Login Successful',
    LOGIN_ERROR:'[Login] Login Error',
    FETCH_USER: '[Login] Fetch User Record',
    UPDATE_RECORD:'[Login] Update User',
    LOGOUT: '[Login] Logout',
    REFRESH_TOKEN: '[Login] Refresh Token'
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
);

export const LogoutAction = createAction(
    ActionTypes.LOGOUT
);

export const RefreshTokenAction = createAction(
  ActionTypes.REFRESH_TOKEN,
  props<{ payload: User }>()
);
