import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { CognitoService } from '../../../common/cognito/cognito.service';
import * as fromRoot from '../../../reducers.index';
import * as loginActions from '../store/login.actions';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(
    private cognitoService: CognitoService,
    private router: Router,
    private store: Store<fromRoot.State>,
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
    this.store.dispatch(loginActions.LogoutUserAction());
    this.router.navigate(['login']);
  }

}
