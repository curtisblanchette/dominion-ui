import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, firstValueFrom, forkJoin, mergeMap, tap, throwError } from 'rxjs';
import * as appActions from './app.actions';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { AppState } from './app.reducer';
import * as ct from 'countries-and-timezones';
import { UsaStates } from 'usa-states';
import { LookupTypes } from '../data/entity-metadata';

export interface ISetting { id: number, name: string, value: any; group: string; unit: string; }

@Injectable()
export class AppEffects {

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private store: Store<AppState>,
    private toastr: ToastrService,
  ) {

  }

  getSettings$ = createEffect((): any =>
    this.actions$.pipe(
      ofType(appActions.FetchSettingsAction),
      mergeMap(async () => {
        const res = await firstValueFrom(this.http.get(environment.dominion_api_url + '/settings')) as any;
        return appActions.FetchSettingsSuccessAction({ payload: res.rows });
      }),
      catchError((err: any) => {
        this.toastr.error(err.error.name || '', err.error.message);
        return throwError(err);
      })
    )
  );

  onSaveSettings$ = createEffect((): any =>
    this.actions$.pipe(
      ofType(appActions.SaveSettingsAction),
      mergeMap(async ( action:any ) => {
        const res = await firstValueFrom(this.http.put(`${environment.dominion_api_url}/settings`, action.payload )) as any;
        return appActions.SaveSettingsSuccessAction({payload: res});
      }),
      catchError((err: any) => {
        this.toastr.error(err.error.name || '', err.error.message);
        return throwError(err);
      })
    )
  );

  getLookups$ = createEffect((): any =>
    this.actions$.pipe(
      ofType(appActions.GetLookupsAction),
      tap(() => {
        // Fork Join the results of all dominion lookups
        return forkJoin({
          // General Lookups
          [LookupTypes.PRACTICE_AREA]: this.http.get(environment.dominion_api_url + '/practice-areas'),
          [LookupTypes.ROLE]: this.http.get(environment.dominion_api_url + '/roles'),
          // Call Lookups
          [LookupTypes.CALL_TYPE]: this.http.get(environment.dominion_api_url + '/call-types'),
          [LookupTypes.CALL_OUTCOME]: this.http.get(environment.dominion_api_url + '/call-outcomes'),
          [LookupTypes.CALL_TYPE]: this.http.get(environment.dominion_api_url + '/call-types'),
          [LookupTypes.CALL_OBJECTION]: this.http.get(environment.dominion_api_url + '/call-objections'),
          [LookupTypes.CALL_STATUS]: this.http.get(environment.dominion_api_url + '/call-statuses'),
          // Deal Lookups
          [LookupTypes.DEAL_STAGE]: this.http.get(environment.dominion_api_url + '/deal-stages'),
          // Event lookups
          [LookupTypes.EVENT_OUTCOME]: this.http.get(environment.dominion_api_url + '/event-outcomes'),
          [LookupTypes.EVENT_TYPE]: this.http.get(environment.dominion_api_url + '/event-types'),
          [LookupTypes.EVENT_OBJECTION]: this.http.get(environment.dominion_api_url + '/event-objections'),
          // Lead Lookups
          [LookupTypes.LEAD_STATUS]: this.http.get(environment.dominion_api_url + '/lead-statuses'),
          [LookupTypes.LOST_REASON]: this.http.get(environment.dominion_api_url + '/lost-reasons'),

          offices: this.http.get(environment.dominion_api_url + '/offices'),
          [LookupTypes.LOST_REASON] : this.http.get(environment.dominion_api_url + '/lost-reasons'),
          [LookupTypes.DEAL_STAGE] : this.http.get(environment.dominion_api_url + '/deal-stages')
        }).subscribe((res: any) => {

          // Map the lookups to DropdownItem's
          for(const key of Object.keys(res)) {
            if(res[key].hasOwnProperty('rows')) {
              res[key] = res[key]?.rows.map((r: any) => ({id: r.id, label: r.name }));
            } else {
              res[key] = res[key]?.map((r: any) => ({id: r.id, label: r.name }));
            }
          }

          // Add any additional state lookup lists
          const states = new UsaStates().states;

          res['state'] = states.map((state: any) => ({id: state.abbreviation, label: state.name}));
          res['timezone'] = Object.values(ct.getAllTimezones()).map(tz => ({id: tz.name, label: tz.name}));

          this.store.dispatch(appActions.SetLookupsAction({ payload: res }) );
          this.store.dispatch(appActions.AppInitializedAction());
        });
      }),
    ), { dispatch: false }
  )

}
