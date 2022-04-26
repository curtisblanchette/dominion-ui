import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { firstValueFrom, mergeMap } from 'rxjs';
import * as appActions from './app.actions';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ISettingResponse } from '@4iiz/corev2';

export interface INestedSetting {
  [key: string]: { value: any; unit: string; }
}

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
            [setting.name]: { value: setting.value, unit: setting.unit }
          }
        }

        // organize settings into groups
        const response = new Map();
        res.rows.map((setting: any) => response.set(setting.group, {...response.get(setting.group) || {}, ...toNestedSetting(setting)}));

        // Map to Object
        const transformed: { [key: string]: INestedSetting } = Object.fromEntries(response);

        localStorage.setItem('settings', JSON.stringify(transformed));
        return appActions.SetSettingsAction({ payload: transformed });

      })
    )
  );
}
