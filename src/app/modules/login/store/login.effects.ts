import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, mergeMap, tap, withLatestFrom } from 'rxjs';

import * as loginActions from './login.actions';
import { LoginService } from '../services/login.service';
import { User } from '../models/user';

import * as fromLogin from './login.reducer';
import { CognitoService } from '../../../common/cognito/cognito.service';

@Injectable()
export class LoginEffects {

  constructor(
    private actions$: Actions,
    private loginService: LoginService,
    private router: Router,
    private store: Store<fromLogin.LoginState>,
    private cognito: CognitoService
  ) {

  }

  login$ = createEffect((): any =>
    this.actions$.pipe(
      ofType(loginActions.LoginAction),
      mergeMap((action) => {
        return this.loginService.login(action.payload).then((response: any) => {
          const accessToken = response.accessToken.getJwtToken();
          const idToken = response.idToken.getJwtToken();
          const refreshToken = response.refreshToken.getToken();
          const cognitoGroup = response.idToken.payload['cognito:groups'];
          const cognitoUsername = response.idToken.payload['cognito:username'];
          const workspaceId = response.idToken.payload['custom:workspaceId'];

          const user = new User(
            'assets/img/default-avatar.png',
            accessToken,
            idToken,
            refreshToken,
            cognitoGroup,
            cognitoUsername
          );
          localStorage.setItem('user', btoa(JSON.stringify(user)));
          return loginActions.LoginSuccessfulAction({ payload: user });
        });
      })
    )
  );

  loginSuccess$ = createEffect(
    (): any =>
      this.actions$.pipe(
        ofType(loginActions.LoginSuccessfulAction),
        map((action: { payload: User }) => action.payload),
        tap((action) => {
          switch (action.role[0]) {
            case 'system':
              this.router.navigate(['system'])
              break;
            case 'admin':
              this.router.navigate(['dashboard'])
              break;
            case 'owner':
              this.router.navigate(['dashboard'])
              break;
            case 'consultant':
              this.router.navigate(['dashboard'])
              break;
            case 'agent':
              this.router.navigate(['dashboard'])
              break;
          }
        })
      ),
    { dispatch: false }
  );

  updateUserSuccess$ = createEffect(
    (): any =>
      this.actions$.pipe(
        ofType(loginActions.UpdateUserAction),
        map((action) => {
          localStorage.setItem('user', btoa(JSON.stringify(action.payload)));
          return action.payload;
        })
      ),
    { dispatch: false }
  );

  refreshToken$ = createEffect(
    (): any =>
      this.actions$.pipe(
        ofType(loginActions.RefreshTokenAction),
        map(async (action) => {
          try {
            const session = await this.cognito.refreshSession();
            const access_token = session.accessToken.getJwtToken();
            const id_token = session.idToken.getJwtToken();
            const refresh_token = session.refreshToken.getToken();

            const user: User = {
              ...action.payload,
              access_token,
              id_token,
              refresh_token
            };

            return loginActions.UpdateUserAction({payload: user});

          } catch (error) {
            console.error('Error refreshing token', error);
          }
        })
      ),
    {dispatch: true}
  );

}

