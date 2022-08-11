import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { firstValueFrom, forkJoin, map, mergeMap, of, tap } from 'rxjs';
import * as appActions from './app.actions';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ISettingResponse } from '@4iiz/corev2';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { AppState } from './app.reducer';
import * as ct from 'countries-and-timezones';
import { UsaStates } from 'usa-states';
import { LookupTypes } from '../data/entity-metadata';

export interface INestedSetting {
  [key: string]: { id:number, value: any; unit: string; }
}

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
      ofType(appActions.GetSettingsAction),
      mergeMap(async () => {
        const res = await firstValueFrom(this.http.get(environment.dominion_api_url + '/settings')) as any;

        /** restructuring the response to be more state/selector friendly
         * --- before ---
         * [ { name: 'thing', group: 'things', value: 5, unit: 'minutes' }, ...]
         *
         * --- after ---
         * {
         *   [group: string]: {
         *      [name: string]: { value: any, unit: string },
         *      ...
         *   },
         * }
         **/
        const toNestedSetting = (setting: ISettingResponse): INestedSetting => {
          return {
            [setting.name]: { id : setting.id, value: setting.value, unit: setting.unit }
          }
        }

        // organize settings into groups
        const response = new Map();
        res.rows.map((setting: any) => response.set(setting.group, {...response.get(setting.group) || {}, ...toNestedSetting(setting)}));

        // Map to Object
        const transformed: { [key: string]: INestedSetting } = Object.fromEntries(response);

        // localStorage.setItem('settings', JSON.stringify(transformed));
        return appActions.SetSettingsAction({ payload: transformed });

      })
    )
  );

  updateSettings$ = createEffect((): any =>
    this.actions$.pipe(
      ofType(appActions.UpdateSettingsAction),
      mergeMap(async ( action:any ) => {
        const response = await firstValueFrom(this.http.put(`${environment.dominion_api_url}/settings/${action['payload']['id']}`, { value : action['payload']['value'], unit : action['payload']['unit']} )).catch((err:HttpErrorResponse) => {
          return err;
        });
        if( response instanceof HttpErrorResponse ){
          this.toastr.error(response.error.name || '', response.error.message);
        } else {
          return appActions.UpdateSettingsSuccessAction();
        }
      })
    )
  );

  updateSettingsSuccess$ = createEffect(
    ():any =>
    this.actions$.pipe(
      ofType(appActions.UpdateSettingsSuccessAction),
      map((action) => {
        this.toastr.success('', 'Settings Updated!');
      })
    ),
    { dispatch : false }
  );

  getLookups$ = createEffect((): any =>
    this.actions$.pipe(
      ofType(appActions.GetLookupsAction),
      tap(() => {
        // Fork Join the results of all dominion lookups
        return forkJoin({
          [LookupTypes.PRACTICE_AREA]: this.http.get(environment.dominion_api_url + '/practice-areas'),
          [LookupTypes.ROLE]: this.http.get(environment.dominion_api_url + '/roles'),
          // Call Lookups
          [LookupTypes.CALL_OUTCOME]: this.http.get(environment.dominion_api_url + '/call-outcomes'),
          [LookupTypes.CALL_OBJECTION]: this.http.get(environment.dominion_api_url + '/call-objections'),
          [LookupTypes.CALL_STATUS]: this.http.get(environment.dominion_api_url + '/call-statuses'),
          [LookupTypes.CALL_TYPE]: this.http.get(environment.dominion_api_url + '/call-types'),
          // Event lookups
          [LookupTypes.EVENT_OUTCOME]: this.http.get(environment.dominion_api_url + '/event-outcomes'),
          [LookupTypes.EVENT_TYPE]: this.http.get(environment.dominion_api_url + '/event-types'),
          [LookupTypes.EVENT_OBJECTION]: this.http.get(environment.dominion_api_url + '/event-objections'),

          [LookupTypes.LEAD_STATUS]: this.http.get(environment.dominion_api_url + '/lead-statuses'),

          offices: this.http.get(environment.dominion_api_url + '/offices'),
        }).subscribe((res: any) => {

          // Map the lookups to DropdownItem's
          for(const key of Object.keys(res)) {
            if(res[key].hasOwnProperty('rows')) {
              res[key] = res[key].rows.map((r: any) => ({id: r.id, label: r.name }));
            } else {
              res[key] = res[key].map((r: any) => ({id: r.id, label: r.name }));
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
