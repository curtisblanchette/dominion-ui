import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromReports from './reports.reducer';
import * as reportsActions from './reports.actions';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { firstValueFrom, switchMap, take, withLatestFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({providedIn: 'root'})
export class ReportsEffects {

  constructor(
    private actions$: Actions,
    private router: Router,
    private store: Store<fromReports.ReportsState>,
    private http: HttpClient,
  ) {

  }

  onGetTotalPipeline = createEffect((): any =>
    this.actions$.pipe(
      ofType(reportsActions.FetchTotalPipeline),
      withLatestFrom(this.store.select(fromReports.getDateRange)),
      switchMap(async (action: any) => {
        let [payload, dateRange]: [any, any] = action;
        try {
          const res: any = await firstValueFrom(this.http.get(`${environment.dominion_api_url}/reports/total-pipeline?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`).pipe(take(1)));

          let grid = [];
          for(const key of Object.keys(res.data)) {
            if (!['in', 'out'].includes(key)) {
              // TODO use a display name map instead of this moist replacement kludge
              grid.push([key.replace('_',' - ').replace(/_/g, ' '), ...Object.values(res.data[key])]);
            }
          }
          grid = grid.flat();

          return reportsActions.FetchTotalPipelineSuccess({data: { in: res.data.in, out: res.data.out, grid }});
        } catch(e: any) {
          return reportsActions.FetchTotalPipelineError(e)
        }
      }),
    ), { dispatch: true });

}
