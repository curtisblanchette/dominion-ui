import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY, mergeMap, switchMap, withLatestFrom } from 'rxjs';
import * as flowActions from './flow.actions';
import * as fromFlow from './flow.reducer';
import { FlowRouter, FlowStep } from '../index';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { cloneDeep } from 'lodash';
import { FlowState } from './flow.reducer';

@Injectable({providedIn: 'root'})
export class FlowEffects {

  constructor(
    private actions$: Actions,
    private router: Router,
    private store: Store<fromFlow.FlowState>,
    private http: HttpClient
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
      withLatestFrom(
        this.store.select(fromFlow.selectAllVariables),
        this.store.select(fromFlow.selectSteps),
        this.store.select(fromFlow.selectRouters)
      ),
      mergeMap(async (action: any) => {
        let [payload, variables, steps, routers]: [any, any, FlowStep[], FlowRouter[]] = action;
        let frozenVars = Object.freeze({...variables});
        let step = steps.find(step => step.id === payload.stepId);

        if(!step) {
          const router = routers.find(router => router.id === payload.stepId);
        } else {

          if (typeof step?.beforeRoutingTriggers === 'string') {
            const fn = eval((<FlowStep>step).beforeRoutingTriggers);
            await fn({}, frozenVars, step);
          }

          if(step?.id) {
            return flowActions.UpdateFlowAction({ currentStepId: step.id });
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
        let [payload, variables, steps, routers, currentStepId]: [any, any, FlowStep[], FlowRouter[], string] = action;

        let step = steps.find(step => step.id === payload.stepId);

        if(!step) {
          const router = routers.find(router => router.id === payload.stepId);
          console.log(router);
        } else {

          const currentStep = steps.find(step => step.id === currentStepId);
          // triggers can update variables that we'll need while creating history entries
          if (typeof currentStep?.afterRoutingTriggers === 'string') {
            const sourceMapComment = `\n //# sourceURL=${currentStep.nodeText}.after.js \n`;
            let code = currentStep?.afterRoutingTriggers;
            code = code.concat(sourceMapComment);
            const afterFn = eval(code);
            const updates = await afterFn({}, variables, {...cloneDeep(currentStep)});
            if(updates) {
              this.store.dispatch(flowActions.UpdateStepAction({ id: currentStep.id, changes: updates, strategy: 'merge' } ));
            }
          }

          if (typeof step?.beforeRoutingTriggers === 'string') {
            const sourceMapComment = `\n //# sourceURL=${step.nodeText}.before.js \n`;
            let code = (<FlowStep>step).beforeRoutingTriggers
            code = code.concat(sourceMapComment);
            const beforeFn = eval(code);
            const updates = await beforeFn({}, variables, {...cloneDeep(step)});
            if (updates) {
              this.store.dispatch(flowActions.UpdateStepAction({id: step.id, changes: updates, strategy: 'merge'}));
            }
          }

          return flowActions.UpdateFlowAction({ currentStepId: step.id });

        }
        return EMPTY;
      })
    ), { dispatch: true }
  );

}
