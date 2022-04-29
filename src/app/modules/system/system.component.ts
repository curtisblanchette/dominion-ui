import { Component, OnDestroy } from '@angular/core';
import { firstValueFrom, map, Observable, Subscription, take } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromSystem from './store/system.reducer';
import * as fromApp from '../../store/app.reducer';
import * as appActions from '../../store/app.actions';
import * as systemActions from './store/system.actions';
import { DropdownItem } from '../../common/components/ui/forms';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { filter } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

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

  constructor(
    private store: Store<fromSystem.SystemState>,
    private fb: FormBuilder,
    private http: HttpClient,
    private toastr: ToastrService
  ) {
    this.workspaces$ = this.store.select(fromSystem.selectWorkspaces);
    this.actingFor$ = this.store.select(fromSystem.selectActingFor);
    this.roles$ = this.store.select(fromApp.selectRoles);

    /** initialized means that the AppState has been successfully populated */
    this.initialized$ = this.store.select(fromApp.selectInitialized).subscribe(val => {
      this._initialized = val;
      if(this._initialized) {
        this.userInviteForm = this.createUserInviteForm();
      }
    });

  }

  onChange($event: any) {
    localStorage.setItem('actingFor', $event.target.value);
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
      roleId: this.userInviteForm.controls['role'].value.id,
      email: this.userInviteForm.controls['email'].value
    }

    await firstValueFrom(this.http.post(environment.dominion_api_url + '/invitations', payload));
    this.toastr.success('', 'Invite Sent!');
  }

  ngOnDestroy() {
    // this.appInitialized$.unsubscribe();
  }
}
