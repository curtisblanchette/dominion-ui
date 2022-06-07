import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { firstValueFrom, map, mergeMap, tap, throwError } from 'rxjs';

import * as appActions from '../../../store/app.actions';
import * as loginActions from './login.actions';
import { LoginService } from '../services/login.service';
import { User } from '../models/user';

import * as fromLogin from './login.reducer';
import { CognitoService } from '../../../common/cognito/cognito.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../environments/environment';
import { HttpBackend, HttpClient, HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class LoginEffects {

  private httpNoAuth: HttpClient;

  constructor(
    private actions$: Actions,
    private loginService: LoginService,
    private router: Router,
    private store: Store<fromLogin.LoginState>,
    private cognito: CognitoService,
    private toastr: ToastrService,
    private http: HttpClient,
    private httpBackend: HttpBackend,
  ) {
    this.httpNoAuth = new HttpClient(httpBackend);
  }

  login$ = createEffect(
    (): any =>
      this.actions$.pipe(
        ofType(loginActions.LoginAction),
        mergeMap((action) => {

            return this.loginService.login(action.payload).then((response: any) => {
              const access_token = response.accessToken.getJwtToken();
              const id_token = response.idToken.getJwtToken();
              const refresh_token = response.refreshToken.getToken();
              const roles = response.idToken.payload['cognito:groups'];
              const email = response.idToken.payload['cognito:email'];
              const id = response.idToken.payload['cognito:username'];
              const workspaceId = response.idToken.payload['custom:workspaceId'];
              const user = new User({
                picture: 'assets/img/default-avatar.png',
                access_token,
                id_token,
                refresh_token,
                roles,
                id,
                username: email,
              });
              localStorage.setItem('user', btoa(JSON.stringify(user)));
              return loginActions.LoginSuccessfulAction({payload: user});
            }).catch(e => {
              switch(e.code) {
                case 'UserNotFoundException':
                case 'NotAuthorizedException': {
                  this.toastr.error('', 'Invalid username or password.');
                  return loginActions.LoginErrorAction({error: e.message});
                }
                default:
                  return throwError(e);
              }
            });


        }),
      )
  );

  logout$ = createEffect(
    (): any =>
      this.actions$.pipe(
        ofType(loginActions.LogoutAction),
        tap((action) => {
          localStorage.clear();
          // preserve the queryString
          // for case: accepting an invitation_code while logged in
          this.router.navigate(['login'], { queryParamsHandling: 'preserve' });
        }),
        tap(async () => {
          this.store.dispatch(appActions.ClearRolesAction());
          this.store.dispatch(appActions.ClearSettingsAction());
        })
      ),
    { dispatch: false }
  );

  getUser$ = createEffect(
    (): any =>
      this.actions$.pipe(
        ofType(loginActions.GetUserAction),
        map((action: any) => action.payload ),
        mergeMap((user: User) =>{
          return this.http.get(environment.dominion_api_url + '/users/me').pipe(
            map((res: any) => {
              // merge the two user records
              res.roles = res.roles.map((role: {id: string, name: string}) => role.name);
              return loginActions.UpdateUserAction({payload: new User({...user, ...res })});
            })
          );
        })
      )
  );

  loginSuccess$ = createEffect(
    (): any =>
      this.actions$.pipe(
        ofType(loginActions.LoginSuccessfulAction),
        map((action: { payload: User }) => action.payload),
        tap((action: User) => {

          switch (action.roles[0]) {
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
        }),
        mergeMap( async ( action: User ) => {

          // system users won't get settings yet
          // because settings are workspace specific
          // system users will fetch app settings when switching workspaces
          if(!action.roles.includes('system')) {
            this.store.dispatch(loginActions.GetUserAction({payload: action}));
            return appActions.GetSettingsAction();
          }
          return appActions.ClearSettingsAction();

        })
      ),
    { dispatch: true }
  );

  loginFailure$ = createEffect(
    (): any =>
      this.actions$.pipe(
        ofType(loginActions.LoginErrorAction),
        map((action: { error: any }) => {
          return action.error
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

  acceptInvitation$ = createEffect(
    (): any =>
      this.actions$.pipe(
        ofType(loginActions.AcceptInvitationAction),
        mergeMap(async (action) => {
          const response = await firstValueFrom(this.httpNoAuth.patch(`${environment.dominion_api_url}/invitations/${action.code.id}`, action.payload)).catch((err:HttpErrorResponse) => {
            return err;
          });
          if( response instanceof HttpErrorResponse ){
            this.toastr.error(response.error.name || '', response.error.message);
            return loginActions.InvitationErrorAction();
          } else {
            this.toastr.success('Logging you in...', 'User Created!');
            return loginActions.LoginAction( { payload: {
              username: action.code.email,
              password: action.payload.password,
              remember_me: 'yes'
            }});
          }
        })
      )
  )

  refreshToken$ = createEffect(
    (): any =>
      this.actions$.pipe(
        ofType(loginActions.RefreshTokenAction),
        mergeMap(async (action) => {
          const session = await this.cognito.refreshSession();
          const access_token = session.accessToken.getJwtToken();
          const id_token = session.idToken.getJwtToken();
          const refresh_token = session.refreshToken.getToken();

          const user: User = new User({
            ...action.payload,
            access_token,
            id_token,
            refresh_token
          });

          return loginActions.UpdateUserAction({ payload: user });
        })
      ),
    {dispatch: true}
  );

  invitationError$ = createEffect((): any =>
    this.actions$.pipe(
      ofType(loginActions.InvitationErrorAction)
    ), { dispatch: false }
  )

}

