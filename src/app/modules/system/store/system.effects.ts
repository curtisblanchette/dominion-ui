import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concat, firstValueFrom, mergeMap, of, switchMap, tap } from 'rxjs';
import * as appActions from '../../../store/app.actions';
import * as systemActions from './system.actions';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import * as fromApp from '../../../store/app.reducer';

@Injectable()
export class SystemEffects {

  constructor(
    private store: Store<fromApp.AppState>,
    private actions$: Actions,
    private http: HttpClient
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
    { dispatch: false }
  )

}
