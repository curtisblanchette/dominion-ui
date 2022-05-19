import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatMap, firstValueFrom, map, mergeMap, tap } from 'rxjs';
import * as appActions from '../../../store/app.actions';
import * as systemActions from './system.actions';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import * as fromApp from '../../../store/app.reducer';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class SystemEffects {

  constructor(
    private store: Store<fromApp.AppState>,
    private actions$: Actions,
    private http: HttpClient,
    private toastr: ToastrService
  ) {

  }

  getWorkspaces$ = createEffect((): any =>
    this.actions$.pipe(
      ofType(systemActions.GetWorkspacesAction),
      mergeMap(async () => {
        let res = await firstValueFrom(this.http.get(environment.dominion_api_url + '/system/workspaces')) as any;

        // transform it into a DropdownItem[]
        res = res.map((ws: any) => ({id: ws.id, label: ws.name}));

        localStorage.setItem('workspaces', JSON.stringify(res));
        return systemActions.SetWorkspacesAction({payload: res});
      })
    )
  );

  onActingForSet$ = createEffect((): any =>
      this.actions$.pipe(
        ofType(systemActions.SetActingForAction),
        tap(async () => {
          this.store.dispatch(appActions.GetSettingsAction());
          this.store.dispatch(appActions.GetLookupsAction());
        })
      ),
    {dispatch: false}
  );

  onSendInvitation$ = createEffect((): any =>
    this.actions$.pipe(
      ofType(systemActions.SendInvitationAction),
      mergeMap(async action => {
        await firstValueFrom(this.http.post(environment.dominion_api_url + '/invitations', action.payload));
        return systemActions.SendInvitationSuccessAction({email: action.payload.email})
      })
    ));

  onSendInvitationSuccess$ = createEffect((): any =>
    this.actions$.pipe(
      ofType(systemActions.SendInvitationSuccessAction),
      tap((action: {  email: string }) => {
        this.toastr.success(action.email, 'An invitation was sent to');
      })
    ), { dispatch: false }
  )

}
