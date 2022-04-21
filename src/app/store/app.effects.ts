import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { firstValueFrom, mergeMap } from 'rxjs';
import * as appActions from './app.actions';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable()
export class AppEffects {

  constructor(
    private actions$: Actions,
    private http: HttpClient
  ) {

  }

  getSettings$ = createEffect((): any =>
    this.actions$.pipe(
      ofType(appActions.GetSettingsAction),
      mergeMap(async () => {
         const res = await firstValueFrom(this.http.get(environment.dominion_api_url + '/settings')) as any;

         return appActions.SetSettingsAction({payload: res.rows });

      })
    )
  );
}
