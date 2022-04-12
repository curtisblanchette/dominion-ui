import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, mergeMap, tap } from 'rxjs';

import * as loginActions from './login.actions';
import { LoginService } from '../services/login.service';
import { User } from '../models/user';
import { CognitoUserSession } from 'amazon-cognito-identity-js';

@Injectable()
export class loginEffects {

  constructor(
    private actions$: Actions,
    private loginService: LoginService,
    private router: Router,
    private store: Store
  ) {

  }

  login$ = createEffect((): any =>
    this.actions$.pipe(
      ofType(loginActions.LogUserAction),
      mergeMap((action) => {
        return this.loginService.login(action.payload).then((response: any) => {
          const accessToken = response.accessToken.getJwtToken();
          const idToken = response.idToken.getJwtToken();
          const refreshToken = response.refreshToken.getToken();
          const cognitoGroup = response.idToken.payload['cognito:groups'];
          const cognitoUsername = response.idToken.payload['cognito:username'];
          const workspaceId = response.idToken.payload['custom:workspaceId'];

          const loggedUser = new User(
            'assets/img/default-avatar.png',
            accessToken,
            idToken,
            refreshToken,
            cognitoGroup,
            cognitoUsername
          );

          return loginActions.LogInSuccessfulAction({payload: loggedUser});
        });
      })
    )
  );

  loginSuccess$ = createEffect(
    (): any =>
      this.actions$.pipe(
        ofType(loginActions.LogInSuccessfulAction),
        map((action) => {
          localStorage.setItem('user', btoa(JSON.stringify(action.payload)));
          return action.payload;
        }),
        tap((user) => {
          switch (user.role[0]) {
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
    {dispatch: false}
  );

  updateUserSuccess$ = createEffect(
    (): any =>
      this.actions$.pipe(
        ofType(loginActions.UpdateUserAction),
        map((action) => {
          localStorage.setItem('user', btoa(JSON.stringify(action.payload)));
          return action.payload;
        })
      )
  )

}
