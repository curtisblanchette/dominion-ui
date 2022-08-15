import { Component, OnDestroy, OnInit } from '@angular/core';
import { firstValueFrom, Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromSystem from './store/system.reducer';
import * as loginActions from '../login/store/login.actions';
import * as fromApp from '../../store/app.reducer';
import * as systemActions from './store/system.actions';
import { DropdownItem } from '../../common/components/ui/forms';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { LookupTypes } from '../../data/entity-metadata';

@UntilDestroy()
@Component({
  selector: 'app-system',
  templateUrl: './system.component.html',
  styleUrls: ['../../../assets/css/_container.scss', './system.component.scss']
})
export class SystemComponent implements OnDestroy, OnInit {

  public workspaces$: Observable<DropdownItem[]>;
  public actingFor$: Observable<DropdownItem | undefined>;
  public accountsForm: FormGroup;
  public userInviteForm: FormGroup;
  public roles$: Observable<DropdownItem[]>;
  public initialized$: Subscription;
  public _initialized = false;

  public loading$: Observable<boolean>;
  public lookupTypes: any;

  constructor(
    private store: Store<fromSystem.SystemState>,
    private fb: FormBuilder
  ) {
    this.lookupTypes = LookupTypes;
    this.workspaces$ = this.store.select(fromSystem.selectWorkspaces);
    this.actingFor$ = this.store.select(fromSystem.selectActingFor);
    this.roles$ = this.store.select(fromApp.selectRoles);
    this.loading$ = this.store.select(fromSystem.loading);

    /** initialized means that the AppState has been successfully populated */
    this.initialized$ = this.store.select(fromApp.selectInitialized).pipe(untilDestroyed(this)).subscribe(val => {
      this._initialized = val;
      if(this._initialized) {
        this.userInviteForm = this.createUserInviteForm();

      }
    });

  }

  public async ngOnInit(): Promise<void> {
    this.accountsForm = await this.createAccountsForm();

    this.accountsForm.controls['actingFor'].valueChanges.subscribe((changes: any) => {
      this.store.dispatch(systemActions.SetActingForAction({ workspaceId: changes }));
      this.store.dispatch(loginActions.GetUserAction());
    });
  }

  onChange(id: string) {
    if(id) {

    }
  }

  createUserInviteForm(): FormGroup {
    const fields = {
      email: new FormControl(null, [Validators.required, Validators.email]),
      role: new FormControl(firstValueFrom(this.roles$).then(roles=> roles[0]), [Validators.required])
    };
    return this.fb.group(fields);
  }

  async createAccountsForm(): Promise<FormGroup> {
    const value = await firstValueFrom(this.actingFor$);
    const fields = {
      actingFor: new FormControl(value?.id || null, [Validators.required])
    };
    return this.fb.group(fields);
  }

  async submitUserInvite() {
    if(this.userInviteForm.valid && this.userInviteForm.dirty) {
      const workspace: any = await firstValueFrom(this.store.select(fromSystem.selectActingFor));
      const payload = {
        workspaceId: workspace.id,
        roleId: this.userInviteForm.controls['role'].value,
        email: this.userInviteForm.controls['email'].value
      }
      this.store.dispatch(systemActions.SendInvitationAction({payload}));
    }
  }

  ngOnDestroy() {
  }
}
