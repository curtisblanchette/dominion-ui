import { Injectable } from "@angular/core";
import { Router } from '@angular/router';
import { Store } from "@ngrx/store";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { map, mergeMap, tap } from "rxjs";

import * as loginActions from '../actions/login';
import { LoginService } from '../services/login.service';
import { User } from "../models/user";

@Injectable()
export class loginEffects{

    constructor( private actions$:Actions, private loginService:LoginService, private router:Router, private store:Store ){
        console.log('adas');
    }

    login$ = createEffect(():any =>
        this.actions$.pipe(
            ofType(loginActions.LogUserAction),
            mergeMap( (action) => {
                return this.loginService.login(action.payload).then((response: any) => {
                    const accessToken = response.accessToken.getJwtToken();
                    const refreshToken = response.refreshToken.getToken();
                    const cognitoGroup = response.idToken.payload['cognito:groups'];
                    const cognitoUsername = response.idToken.payload['cognito:username'];
                    const workspaceId = response.idToken.payload['custom:workspaceId'];

                    const loggedUser = new User(
                          'assets/img/default-avatar.png',
                          accessToken,
                          refreshToken,
                          cognitoGroup,
                          cognitoUsername
                        );
                    console.log(loggedUser);
                    return loginActions.LogInSuccesfullAction({payload:loggedUser});
                });
            }),
        )
    );

    loginSuccess$ = createEffect(
        ():any =>
          this.actions$.pipe(
            ofType(loginActions.LogInSuccesfullAction),
            map((action) => {
                localStorage.setItem('user', btoa(JSON.stringify(action.payload)));
                return action.payload;
            }),
            tap((user) => {
              switch(user.role[0]) {
                case 'system': this.router.navigate(['system'])
                  break;
                case 'admin': this.router.navigate(['dashboard'])
                  break;
                case 'owner': this.router.navigate(['dashboard'])
                  break;
                case 'consultant': this.router.navigate(['dashboard'])
                  break;
                case 'agent': this.router.navigate(['dashboard'])
                  break;
              }
            })
          ),
        { dispatch: false }
    );

}
