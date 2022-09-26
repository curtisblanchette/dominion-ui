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

          if (typeof step?.beforeRoutingTrigger === 'string') {
            const fn = eval((<FlowStep>step).beforeRoutingTrigger);
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
      withLatestFrom(this.store.select(fromFlow.selectSteps)),
      mergeMap(async (action: any) => {
        let [payload, steps]: [any, FlowStep[]] = action;
        let step = steps.find((step: FlowStep) => step.id === payload.stepId);

        if(step) {
          return flowActions.UpdateFlowAction({currentStepId: step.id});
        }

        return EMPTY;
      })
    ), { dispatch: true }
  );

}
