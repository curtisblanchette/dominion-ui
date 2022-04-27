import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { firstValueFrom, mergeMap } from 'rxjs';
import * as systemActions from './system.actions';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class SystemEffects {

  constructor(
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
        res = res.map((ws: any) => ({id: ws.id, label: ws.name }));

        localStorage.setItem('workspaces', JSON.stringify(res));
        return systemActions.SetWorkspacesAction({ payload: res });
      })
    )
  );

}
