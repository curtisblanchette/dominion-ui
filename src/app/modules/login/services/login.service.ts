import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { CognitoService } from '../../../common/cognito/cognito.service';
import * as fromLogin from '../store/login.reducer';
import * as loginActions from '../store/login.actions';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(
    private cognitoService: CognitoService,
    private router: Router,
    private store: Store<fromLogin.LoginState>,
  ) { }

  public login(credentials:any): Promise<any> {

    const authenticationData = {
      Username: credentials.username,
      Password: credentials.password
    };

    return this.cognitoService.authenticateUser(authenticationData).then((result: any) => {
      return result;
    }).catch( error => {
      return error;
    });
  }

  public logout() {
    localStorage.clear();
    this.store.dispatch(loginActions.LogoutAction());
    this.router.navigate(['login']);
  }

}
