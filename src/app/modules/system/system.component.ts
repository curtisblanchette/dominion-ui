import { Component, OnDestroy } from '@angular/core';
import { firstValueFrom, Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromSystem from './store/system.reducer';
import * as fromApp from '../../store/app.reducer';
import * as systemActions from './store/system.actions';
import { DropdownItem } from '../../common/components/ui/forms';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-system',
  templateUrl: './system.component.html',
  styleUrls: ['../../../assets/css/_container.scss', './system.component.scss']
})
export class SystemComponent implements OnDestroy {

  public workspaces$: Observable<DropdownItem[]>;
  public actingFor$: Observable<DropdownItem | undefined>;
  public userInviteForm: FormGroup;
  public roles$: Observable<DropdownItem[]>;
  public initialized$: Subscription;
  public _initialized = false;

  public loading$: Observable<boolean>;

  constructor(
    private store: Store<fromSystem.SystemState>,
    private fb: FormBuilder

  ) {
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

  onChange($event: any) {
    // localStorage.setItem('actingFor', $event.target.value);
    this.store.dispatch(systemActions.SetActingForAction({id: $event.target.value}));
  }

  createUserInviteForm(): FormGroup {
    const fields = {
      email: new FormControl('', Validators.required),
      role: new FormControl(firstValueFrom(this.roles$).then(roles=> roles[0]), Validators.required)
    };
    return this.fb.group(fields);
  }

  async submitUserInvite() {
    const workspace: any = await firstValueFrom(this.store.select(fromSystem.selectActingFor));
    const payload = {
      workspaceId: workspace.id,
      roleId: this.userInviteForm.controls['role'].value,
      email: this.userInviteForm.controls['email'].value
    }
    this.store.dispatch(systemActions.SendInvitationAction({payload}));
  }

  ngOnDestroy() {
  }
}
