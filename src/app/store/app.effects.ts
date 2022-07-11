import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { firstValueFrom, mergeMap } from 'rxjs';
import * as appActions from './app.actions';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ISettingResponse } from '@4iiz/corev2';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { AppState } from './app.reducer';

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
          return true;
        }
      })
    ), { dispatch: false }
  );

  getLookups$ = createEffect((): any =>
    this.actions$.pipe(
      ofType(appActions.GetLookupsAction),
      mergeMap(async() => {
        let practiceAreas = await firstValueFrom(this.http.get(environment.dominion_api_url + '/practice-areas')) as any;
        let roles = await firstValueFrom(this.http.get(environment.dominion_api_url + '/roles')) as any;

        // Call Lookups
        let callOutcomes = await firstValueFrom(this.http.get(environment.dominion_api_url + '/call-outcomes')) as any;
        let callObjections = await firstValueFrom(this.http.get(environment.dominion_api_url + '/call-objections')) as any;
        let callStatus = await firstValueFrom(this.http.get(environment.dominion_api_url + '/call-statuses')) as any;
        let callTypes = await firstValueFrom(this.http.get(environment.dominion_api_url + '/call-types')) as any;

        // Event lookups
        let eventOutcomes = await firstValueFrom(this.http.get(environment.dominion_api_url + '/event-outcomes')) as any;
        let eventTypes = await firstValueFrom(this.http.get(environment.dominion_api_url + '/event-types')) as any;
        let eventObjections = await firstValueFrom(this.http.get(environment.dominion_api_url + '/event-objections')) as any;

        let offices = await firstValueFrom(this.http.get(environment.dominion_api_url + '/offices')) as any;

        // transform it into a DropdownItem[]
        roles = roles.map((r: any) => ({id: r.id, label: r.name }));
        practiceAreas = practiceAreas.map((r: any) => ({id: r.id, label: r.name }));
        callOutcomes = callOutcomes.map((r: any) => ({id: r.id, label: r.name }));
        callObjections = callObjections.map((r: any) => ({id: r.id, label: r.name }));
        callStatus = callStatus.map((r: any) => ({id: r.id, label: r.name }));
        callTypes = callTypes.map((r: any) => ({id: r.id, label: r.name }));
        eventOutcomes = eventOutcomes.map((r: any) => ({id: r.id, label: r.name }));
        eventObjections = eventObjections.map((r: any) => ({id: r.id, label: r.name }));
        eventTypes = eventTypes.map((r: any) => ({id: r.id, label: r.name }));
        offices = offices.rows.map((r: any) => ({id: r.id, label: r.name }));


        const data = { roles, practiceAreas, callOutcomes, callObjections, callStatus, callTypes, eventOutcomes, eventTypes, eventObjections, offices };
        // localStorage.setItem('lookups', JSON.stringify(data));
        this.store.dispatch(appActions.SetLookupsAction({ payload: data }) );
        return appActions.AppInitializedAction();

      })
    ), { dispatch: true }
  )

}
