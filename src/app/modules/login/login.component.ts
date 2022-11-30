import { AfterViewInit, Component, ElementRef, OnInit, TemplateRef, ViewChild, Renderer2, ViewChildren, QueryList, HostListener } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as fromLogin from './store/login.reducer';
import * as loginActions from './store/login.actions';
import { ActivatedRoute } from '@angular/router';
import { HttpBackend, HttpClient } from '@angular/common/http';
import { checkPasswords } from './login.validators';
import {  Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { FiizInputComponent } from 'src/app/common/components/ui/forms';

export interface Ilogin{
  username:string,
  password:string,
  remember_me:string
}


@Component({
  selector: 'fiiz-login',
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
export class LoginComponent implements OnInit, AfterViewInit {

  public showForm: string = 'login';
  public loginForm!: FormGroup;
  public mfaForm!: FormGroup;
  public newUserForm!: FormGroup;
  public invitationCode: { id: string; workspaceId: string; email: string;};
  public isLoading$: Observable<boolean | null>;
  public error$: Observable<any>;
  public loadingMessage!: string;
  public mfaRequired$: Observable<boolean>;

  @ViewChild('loadingTemplate') loadingTemplate: TemplateRef<any>;
  @ViewChild('loginTemplate') loginTemplate: TemplateRef<any>;
  @ViewChild('newUserTemplate') newUserTemplate: TemplateRef<any>;

  usernameInput!: QueryList<FiizInputComponent>;
  @ViewChildren('username') set inputElRef(elRef: QueryList<FiizInputComponent>) {
    if (elRef) {
      this.usernameInput = elRef;
    }
  };

  @HostListener('document:click', ['$event.target'])
  public onClick(target:Event) {
    const clicked = this.elementRef.nativeElement.contains(target);
    console.log('clicked inside',clicked, target);
  }

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private httpBackend: HttpBackend,
    private store: Store<fromLogin.LoginState>,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private renderer: Renderer2,
    private elementRef: ElementRef
  ) {
    this.isLoading$ = this.store.select(fromLogin.loading);
    this.error$ = this.store.select(fromLogin.error);
    this.mfaRequired$ = this.store.select(fromLogin.selectMFARequired);
  }

  ngAfterViewInit(): void {
    if( this.usernameInput ){
      setTimeout(() => {
        this.usernameInput.map( (value:FiizInputComponent) => {
          const elm = value.inputElement.nativeElement;
          value.autofocus = true;
          this.renderer.addClass(elm, 'ng-dirty');
          elm.focus();
          elm.click();
        });
      },2000);
    }
  }

  ngOnInit(): void {
    let formGroup: { [key: string]: FormControl } = {};
    formGroup['username'] = new FormControl('', [Validators.required, Validators.email]);
    formGroup['password'] = new FormControl('', Validators.required);
    formGroup['remember_me'] = new FormControl('');
    this.loginForm = this.fb.group(formGroup);

    this.mfaForm = this.fb.group({
      mfaCode: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(6)])
    });

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
        newUserFormGroup['password'] = new FormControl('', [Validators.required, Validators.pattern('(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=[^0-9]*[0-9]).{8,}')]);
        newUserFormGroup['confirmPassword'] = new FormControl('', checkPasswords);

        this.newUserForm = this.fb.group(newUserFormGroup);
      }
    });

  }

  public getTemplate(): TemplateRef<any> {
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

  public async login() {
    if (this.loginForm.valid) {
      this.store.dispatch(loginActions.LoginAction({payload: this.loginForm.value }));
    } else {
      this.toastr.error('', 'Invalid Form.');
    }
  }

  public sendMFACode() {
    if (this.mfaForm.valid) {
      this.store.dispatch(loginActions.SendMFACodeAction({payload: this.mfaForm.value }));
    } else {
      this.toastr.error('', 'Invalid Format.');
      this.store.dispatch(loginActions.LoginErrorAction({error: 'Invalid OTP'}))
    }
  }

  public async acceptInvitation() {

    if(this.newUserForm.valid) {
      this.store.dispatch(loginActions.AcceptInvitationAction({code: this.invitationCode, payload: this.newUserForm.value}));
    } else {
      this.toastr.error('', 'Invalid Form.');
    }

  }

}
