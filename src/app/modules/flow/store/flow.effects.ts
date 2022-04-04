import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, mergeMap, tap } from 'rxjs';

@Injectable()
export class loginEffects {

  constructor(
    private actions$: Actions,
    private router: Router,
    private store: Store
  ) {

  }

  // login$ = createEffect((): any =>
  //   this.actions$.pipe(
  //     ofType(loginActions.LogUserAction),
  //     mergeMap((action) => {
  //       return this.loginService.login(action.payload).then((response: any) => {
  //         const accessToken = response.accessToken.getJwtToken();
  //         const refreshToken = response.refreshToken.getToken();
  //         const cognitoGroup = response.idToken.payload['cognito:groups'];
  //         const cognitoUsername = response.idToken.payload['cognito:username'];
  //         const workspaceId = response.idToken.payload['custom:workspaceId'];
  //
  //         const loggedUser = new User(
  //           'assets/img/default-avatar.png',
  //           accessToken,
  //           refreshToken,
  //           cognitoGroup,
  //           cognitoUsername
  //         );
  //         console.log(loggedUser);
  //         return loginActions.LogInSuccesfullAction({payload: loggedUser});
  //       });
  //     })
  //   )
  // );

}
