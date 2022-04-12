import { Component, OnInit } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';

import { LoginService } from './services/login.service';
import { User } from './models/user';
import * as fromRoot from './store/login.reducer';
import * as loginActions from './store/login.actions';
import { of, switchMap } from 'rxjs';

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
      this.isLoading = true;
      this.hasError = false;
      this.loadingMessage = `Validating credentials...`;

      this.store.dispatch(loginActions.LoginAction( {payload:this.loginForm.value} ));
    } else {
      alert('Invalid Form');
    }
  }

}
