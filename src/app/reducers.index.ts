import * as fromLogin from './modules/login/store/login.reducer';

export interface AppState {
  login: fromLogin.LoginState;
}

/**
 * add Root level state selectors here
 * anything feature related should be contained
 * within feature reducers using proper createFeatureSelector()
 */
