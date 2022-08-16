import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY, firstValueFrom, mergeMap, switchMap, tap, withLatestFrom } from 'rxjs';
import * as flowActions from './flow.actions';
import * as fromFlow from './flow.reducer';
import { FlowService } from '../flow.service';
import { FlowStep } from '../index';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { cloneDeep } from 'lodash';
import { FlowState } from './flow.reducer';

@Injectable({providedIn: 'root'})
export class FlowEffects {

  constructor(
    private actions$: Actions,
    private router: Router,
    private store: Store<fromFlow.FlowState>,
    private http: HttpClient,
    public flowService: FlowService,
  ) {

  }

  onUpdateFlow = createEffect((): any =>
    this.actions$.pipe(
      ofType(flowActions.UpdateFlowAction),
      switchMap(async (action: Partial<FlowState>) => {

        // new process started
        if(action.processId) {
          return this.http.post(`${environment.dominion_api_url}/flow/summaries`, { id: action.processId });
        }

        if(action.currentStepId) {
          return this.flowService.renderComponent(action.currentStepId)
        }

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

  // flowSummary$ = createEffect((): any =>
  //   this.actions$.pipe(
  //     ofType(flowActions.SetStepHistoryAction),
  //     withLatestFrom(this.store.select(fromFlow.selectProcessId)),
  //     switchMap( async(action: any) => {
  //       let [history, processId] = action;
  //       history = history.payload;
  //
  //       const flowStepData = {
  //         summaryId: processId,
  //         elapsed: history.elapsed,
  //         variables: JSON.stringify(history.variables)
  //       };
  //
  //       return firstValueFrom(this.http.post(`${environment.dominion_api_url}/flow/summaries/${processId}/steps`, flowStepData))
  //         .catch((err: HttpErrorResponse) => {
  //           console.error('Error in saving Flow Step summary', err);
  //           return err;
  //         });
  //
  //     })
  //   ), { dispatch: false }
  // );

  onPrevStep$ = createEffect((): any =>
    this.actions$.pipe(
      ofType(flowActions.PrevStepAction),
      withLatestFrom(this.store.select(fromFlow.selectAllVariables)),
      mergeMap(async (action: any) => {
        let [payload, variables]: [any, any] = action;
        let frozenVars = Object.freeze({...variables});
        let step = this.flowService.builder.process.steps.find(step => step.id === payload.stepId);



        if(!step) {
          const router = this.flowService.builder.process.routers.find(router => router.id === payload.stepId);
          console.log(router);
        } else {

          if(typeof (<FlowStep>step).beforeRoutingTriggers === 'string') {
            const fn = eval((<FlowStep>step).beforeRoutingTriggers);
            await fn(frozenVars, step);
          }

          if(step?.id) {
            return flowActions.UpdateFlowAction({currentStepId: step.id });
          }

        }
        return EMPTY;
      }
    )
  ));

  onNextStep$ = createEffect((): any =>
    this.actions$.pipe(
      ofType(flowActions.NextStepAction),
      withLatestFrom(
        this.store.select(fromFlow.selectAllVariables),
        this.store.select(fromFlow.selectSteps),
        this.store.select(fromFlow.selectCurrentStepId)
      ),
      mergeMap(async (action: any) => {
        let [payload, variables, steps, currentStepId]: [any, any, FlowStep[], string] = action;

        let step = this.flowService.builder.process.steps.find(step => step.id === payload.stepId);

        if(!step) {
          const router = this.flowService.builder.process.routers.find(router => router.id === payload.stepId);
          console.log(router);
        } else {

          const currentStep = steps.find(step => step.id === currentStepId);
          // triggers can update variables that we'll need while creating history entries
          if (typeof currentStep?.afterRoutingTriggers === 'string') {
            const sourceMapComment = `\n //# sourceURL=afterRoutingTrigger.js \n`;
            let code = currentStep?.afterRoutingTriggers;
            code = code.concat(sourceMapComment);
            const afterFn = eval(code);
            const updates = await afterFn(this.flowService, variables, {...cloneDeep(currentStep)});
            if(updates) {
              this.flowService.updateStep(step.id, updates);
            }
          }

          if (typeof (<FlowStep>step).beforeRoutingTriggers === 'string') {
            const sourceMapComment = `\n //# sourceURL=beforeRoutingTrigger.js \n`;
            let code = (<FlowStep>step).beforeRoutingTriggers
            code = code.concat(sourceMapComment);
            const beforeFn = eval(code);
            const updates = await beforeFn(this.flowService, variables, {...cloneDeep(step)});
            if(updates) {
              this.flowService.updateStep(step.id, updates);
            }
          }

          return flowActions.UpdateFlowAction({currentStepId: step.id });

        }
        return EMPTY;
      })
    ), { dispatch: true }
  );

}
