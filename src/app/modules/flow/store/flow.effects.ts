import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { firstValueFrom, mergeMap, tap } from 'rxjs';
import * as flowActions from './flow.actions';
import * as fromFlow from './flow.reducer';
import { FlowService } from '../flow.service';
import { FlowHostDirective } from '../_core/classes/flow.host';
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

  flowSummary$ = createEffect(():any =>
    this.actions$.pipe(
      ofType(flowActions.SetStepHistoryAction),
      mergeMap( async(action) => {
        let flowId:string = localStorage.getItem('flowSummaryId') || '';

        if(!flowId){
          // create a new flow summary
          const response:any = await firstValueFrom(this.http.post(`${environment.dominion_api_url}/flow/summaries`, {})).catch((err:HttpErrorResponse) => {
            console.error('Error in saving Flow summary', err);
            return err;
          });
          flowId = response['id'];
          localStorage.setItem('flowSummaryId', flowId);
        }

        const flowStepData = {
          summaryId : flowId,
          elapsed : action.payload.elapsed,
          variables : JSON.stringify(action.payload.variables)
        };

        firstValueFrom(this.http.post(`${environment.dominion_api_url}/flow/summaries/${flowId}/steps`, flowStepData)).catch((err:HttpErrorResponse) => {
          console.error('Error in saving Flow Step summary', err);
          return err;
        });
      }),
    ), { dispatch : false }
  );

}
