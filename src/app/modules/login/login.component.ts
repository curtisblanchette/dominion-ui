import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { LoginService } from './services/login.service';
import * as fromLogin from './store/login.reducer';
import * as loginActions from './store/login.actions';
import { ActivatedRoute } from '@angular/router';
import { HttpBackend, HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { checkPasswords } from './login.validators';
import { firstValueFrom } from 'rxjs';
import { ToastrService } from 'ngx-toastr';


@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [
    trigger('fadeIn', [
      state('void', style({
        opacity: 0,
        transform: 'translateX( {{distance}} )'
      }), {params: {distance: '{{distance}}', timing: '{{timing}}'}}),
      transition(':enter', animate('{{timing}} ease-in-out'))
    ])
  ]
})
export class LoginComponent implements OnInit {

  public credentials: any = {
    username: null,
    password: null
  };

  public newUser: any = {
    username: null,
    password: null,
    password2: null
  }

  public showForm: string = 'login';
  public loginForm!: FormGroup;
  public newUserForm!: FormGroup;
  public invitationCode: { id: string; workspaceId: string; email: string;};
  public isLoading: boolean = false;
  public hasError: boolean = false;
  public errorMessage!: string;
  public loadingMessage!: string;

  @ViewChild('loadingTemplate') loadingTemplate: TemplateRef<any>;
  @ViewChild('loginTemplate') loginTemplate: TemplateRef<any>;
  @ViewChild('newUserTemplate') newUserTemplate: TemplateRef<any>;

  private httpNoAuth: HttpClient;

  constructor(
    private loginService: LoginService,
    private fb: FormBuilder,
    private http: HttpClient,
    private httpBackend: HttpBackend,
    private store: Store<fromLogin.LoginState>,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) {
    this.httpNoAuth = new HttpClient(httpBackend);
  }

  ngOnInit(): void {
    let formGroup: { [key: string]: FormControl } = {};
    formGroup['username'] = new FormControl('', Validators.required);
    formGroup['password'] = new FormControl('', Validators.required);
    formGroup['remember_me'] = new FormControl('');
    this.loginForm = this.fb.group(formGroup);

    this.route.queryParams.subscribe(params => {
      if (params.hasOwnProperty('invitation_code')) {
        this.invitationCode = JSON.parse(atob(params['invitation_code']));

        this.store.dispatch(loginActions.LogoutAction());
        this.showForm = 'new-user';
        let newUserFormGroup: { [key: string]: FormControl } = {};
        newUserFormGroup['email'] = new FormControl({value: this.invitationCode.email, disabled: true});
        newUserFormGroup['workspaceId'] = new FormControl(this.invitationCode.workspaceId);
        newUserFormGroup['firstName'] = new FormControl('', Validators.required);
        newUserFormGroup['lastName'] = new FormControl('', Validators.required);
        newUserFormGroup['password'] = new FormControl('', Validators.required);
        newUserFormGroup['confirmPassword'] = new FormControl('', checkPasswords);

        this.newUserForm = this.fb.group(newUserFormGroup);
      }
    });

  }

  getTemplate() {
    let template = this.loadingTemplate;

    switch(this.showForm) {
      case 'new-user':
        template = this.newUserTemplate
        break;
      case 'login':
        template = this.loginTemplate
        break;

    }
    return template;
  }

  public login() {
    if (this.loginForm.valid) {
      this.loadingMessage = `Validating credentials...`;

      this.store.dispatch(loginActions.LoginAction({payload: this.loginForm.value}));
    } else {
      console.warn('Invalid Form');
    }
  }

  public async createUser() {
    if(this.newUserForm.valid) {
      await firstValueFrom(this.httpNoAuth.patch(`${environment.dominion_api_url}/invitations/${this.invitationCode.id}`, this.newUserForm.value));
      this.toastr.success('Logging you in...', 'User Created!');

      // perform login
      this.store.dispatch(loginActions.LoginAction({payload: {username: this.invitationCode.email, password: this.newUserForm.controls['password'].value, remember_me: 'yes'}}))
    } else {
      console.warn('Invalid Form');
    }

  }

}
