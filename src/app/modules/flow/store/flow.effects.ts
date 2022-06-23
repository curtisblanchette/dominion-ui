import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { firstValueFrom, mergeMap, switchMap, tap, withLatestFrom } from 'rxjs';
import * as flowActions from './flow.actions';
import * as fromFlow from './flow.reducer';
import { FlowService } from '../flow.service';
import { FlowHostDirective } from '../index';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable()
export class FlowEffects {

  constructor(
    private actions$: Actions,
    private router: Router,
    private store: Store<fromFlow.FlowState>,
    private flowService: FlowService,
    private http: HttpClient
  ) {

  }

  goToStepById$ = createEffect((): any =>
    this.actions$.pipe(
      ofType(flowActions.GoToStepByIdAction),
      tap((action: { id: string, host: FlowHostDirective }) => {
        const id = action.id;
        this.flowService.next(action.host);
      })
    ), { dispatch: false }
  );

  onNewProcess$ = createEffect((): any =>
    this.actions$.pipe(
      ofType(flowActions.SetProcessIdAction),
      mergeMap( (action: any) => (
        firstValueFrom(this.http.post(`${environment.dominion_api_url}/flow/summaries`, {
          id: action.processId
        }))
      ))
    ), { dispatch: false }
  )

  flowSummary$ = createEffect((): any =>
    this.actions$.pipe(
      ofType(flowActions.SetStepHistoryAction),
      withLatestFrom(this.store.select(fromFlow.selectProcessId)),
      switchMap( async(action: any) => {
        let [history, processId] = action;
        history = history.payload;

        const flowStepData = {
          summaryId: processId,
          elapsed: history.elapsed,
          variables: JSON.stringify(history.variables)
        };

        return firstValueFrom(this.http.post(`${environment.dominion_api_url}/flow/summaries/${processId}/steps`, flowStepData))
          .catch((err: HttpErrorResponse) => {
            console.error('Error in saving Flow Step summary', err);
            return err;
          });

      })
    ), { dispatch: false }
  );

}
