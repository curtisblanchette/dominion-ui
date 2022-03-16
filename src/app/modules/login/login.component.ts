import { Component, OnInit } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';

import { LoginService } from './services/login.service';
import { User } from './models/user';
import * as fromRoot from './reducers/login';
import * as loginActions from './actions/login';

// declare var $: any;
declare var require:any;
const { version } = require('../../../../package.json');

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [
    trigger('fadeIn', [
      state('void', style({
        opacity: 0,
        transform: 'translateX( {{distance}} )'
      }), {params: {distance: '{{distance}}', timing: '{{timing}}'}}),
      transition(':enter', animate('{{timing}} ease-in-out')),
    ])
  ]
})
export class LoginComponent implements OnInit {

  public credentials: any = {
    username: null,
    password: null
  };

  public showForm:string = 'login';
  public loginForm!: FormGroup;
  public isLoading:boolean = false;
  public hasError:boolean = false;
  public appVersion:string = version;
  public errorMessage!:string;
  public loadingMessage!:string;


  constructor(
    private loginService: LoginService,
    private fb: FormBuilder,
    private store: Store<fromRoot.State>
  ) { }

  ngOnInit(): void {
    let formGroup : { [key:string] : FormControl } = {};
    formGroup['username'] = new FormControl('', Validators.required);
    formGroup['password'] = new FormControl('', Validators.required);
    formGroup['remember_me'] = new FormControl('');
    this.loginForm = this.fb.group(formGroup);    
  }

  public login(){
    if( this.loginForm.valid ){
      this.errorMessage = '';
      this.isLoading = false;
      this.hasError = false;
      this.loadingMessage = `Validating credentials...`;

      this.loginService.login(this.loginForm.value).then((response: any) => {
        this.loadingMessage = `Retrieving User data...`;

        const accessToken = response.accessToken.getJwtToken();
        const refreshToken = response.refreshToken.getToken();
        const cognitoGroup = response.idToken.payload['cognito:groups'];
        const cognitoUsername = response.idToken.payload['cognito:username'];
        const workspaceId = response.idToken.payload['custom:workspaceId'];
        
        if ( cognitoGroup.includes('admin') || cognitoGroup.includes('system') ) {
          const loggedUser = new User(
            'assets/img/default-avatar.png',
            accessToken,
            refreshToken,
            'system',
            cognitoUsername
          );
  
          localStorage.setItem('user', btoa(JSON.stringify(loggedUser)));
          this.store.dispatch(loginActions.LogUserAction({payload:loggedUser}))
          this.loginService.goToDashboard(loggedUser);
  
        } else {
  
          // this.loginService.getApplicationUserData({
          //   accessToken: authData.attributes.AccessToken,
          //   refreshToken: authData.attributes.RefreshToken
          // }).subscribe((loggedUser: User) => {
          //   localStorage.setItem('user', btoa(JSON.stringify(loggedUser)));
          //   this._store.dispatch(new loginActions.LogUserAction(loggedUser));
          //   this._loginService.goToDashboard(loggedUser);
          //   this.pushNotifications.requestPushPermissions();
          //   this.ChurnZero.trackEvent('Login', 'User Login', 1);
  
          // }, error => {
          //   console.log(error);
          //   if (!error.ok) {
          //     if (error.message === 'inactive') {
          //       this.errorMessage = this.translate.instant('INACTIVE_USER_ERROR');
          //     } else {
          //       this.errorMessage = this.translate.instant('GENERIC_LOGIN_ERROR');
          //     }
          //   }
          //   this.isLoading = false;
          //   this.hasError = true;
          // }, () => {
          //   this.isLoading = false;
          // });
        }
  
  
      }).catch((error: any) => {
        console.error(error);
        if (error.code === 'UserNotFoundException' || error.code === 'NotAuthorizedException') {
          // this.errorMessage = this.translate.instant('INCORRECT_USERNAME_PASSWORD');
          this.errorMessage = 'Incorrect username and password';
        } else {
          // this.errorMessage = this.translate.instant('GENERIC_LOGIN_ERROR');
          this.errorMessage = 'Error';
        }
        this.hasError = true;
        this.isLoading = false;
      });

    } else {
      alert('Invalid Form');
    }
  }

}
