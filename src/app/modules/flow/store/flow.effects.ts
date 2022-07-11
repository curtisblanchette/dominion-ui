import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { firstValueFrom, mergeMap, switchMap, tap, withLatestFrom } from 'rxjs';
import * as flowActions from './flow.actions';
import * as fromFlow from './flow.reducer';
import { FlowService } from '../flow.service';
import { FlowStep } from '../index';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable()
export class FlowEffects {

  constructor(
    private actions$: Actions,
    private router: Router,
    private store: Store<fromFlow.FlowState>,
    private http: HttpClient,
    public flowService: FlowService,
  ) {

  }

  onUpdateCurrentStep$ = createEffect((): any =>
    this.actions$.pipe(
      ofType(flowActions.UpdateCurrentStepAction),
      switchMap(async (action: { step: FlowStep }) => {

        this.flowService.renderComponent(action.step);
      })
    ), { dispatch: false }
  );

  goToStepById$ = createEffect((): any =>
    this.actions$.pipe(
      ofType(flowActions.GoToStepByIdAction),
      tap((action: { id: string }) => {
        const id = action.id;
        this.flowService.next();
      })
    ), { dispatch: false }
  );

  onNewProcess$ = createEffect((): any =>
    this.actions$.pipe(
      ofType(flowActions.SetProcessIdAction),
      mergeMap( (action: any) => (
        this.http.post(`${environment.dominion_api_url}/flow/summaries`, { id: action.processId })
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

  onNextStep$ = createEffect((): any =>
    this.actions$.pipe(
      ofType(flowActions.NextStepAction),
      withLatestFrom(this.store.select(fromFlow.selectAllVariables)),
      mergeMap(async (action: any) => {
        let [payload, variables]: [any, any] = action;
        let step = this.flowService.builder.process.steps.find(step => step.id === payload.stepId);

        if(!step) {
          const router = this.flowService.builder.process.routers.find(router => router.id === payload.stepId);
          console.log(router);
        } else {
          if((<FlowStep>step).beforeRoutingTriggers && typeof (<FlowStep>step).beforeRoutingTriggers === 'function') {
            await (<FlowStep>step).beforeRoutingTriggers(variables);
          }
          if((<FlowStep>step).beforeRoutingTriggers && typeof (<FlowStep>step).beforeRoutingTriggers === 'string') {
            const fn = eval((<FlowStep>step).beforeRoutingTriggers);
            await fn(variables, step);
          }

          if(this.flowService.builder?.process?.currentStep?.step?.afterRoutingTriggers && typeof this.flowService.builder?.process?.currentStep?.step?.afterRoutingTriggers === 'function') {
            await this.flowService.builder?.process?.currentStep?.step?.afterRoutingTriggers(variables);
          }
          if(this.flowService.builder?.process?.currentStep?.step?.afterRoutingTriggers && typeof this.flowService.builder?.process?.currentStep?.step?.afterRoutingTriggers === 'string') {
            const fn = eval(this.flowService.builder?.process?.currentStep?.step?.afterRoutingTriggers);
            await fn(variables, this.flowService.builder?.process?.currentStep?.step);
          }

          return flowActions.UpdateCurrentStepAction({ step });
        }
        return flowActions.GoToStepByIdAction({id: ''});
      })
    ), { dispatch: true }
  );

}
