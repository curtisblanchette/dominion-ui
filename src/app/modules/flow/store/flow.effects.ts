import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY, map, mergeMap, switchMap, withLatestFrom } from 'rxjs';
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

  onNavigate$ = createEffect((): any =>
    this.actions$.pipe(
      ofType(flowActions.PrevStepAction, flowActions.NextStepAction),
      withLatestFrom(this.store.select(fromFlow.selectSteps)),
      mergeMap(async (action: any) => {
        let [payload, steps]: [any, FlowStep[]] = action;
        let step = steps.find(step => step.id === payload.stepId);

        if(step?.id) {
          this.store.dispatch(flowActions.UpdateFlowAction({ currentStepId: step.id }));
        }
      })
    ), { dispatch: false }
  );

  // TODO this is exactly the same as onPrevStep now!?!
  // probably don't even need it, just listen to both nextStepAction and PrevStepAction
  // onNextStep$ = createEffect((): any =>
  //   this.actions$.pipe(
  //     ofType(flowActions.NextStepAction),
  //     withLatestFrom(this.store.select(fromFlow.selectSteps)),
  //     map(async (action: any) => {
  //       let [payload, steps]: [any, FlowStep[]] = action;
  //       let step = steps.find((step: FlowStep) => step.id === payload.stepId);
  //
  //       if(step) {
  //         this.store.dispatch(flowActions.UpdateFlowAction({currentStepId: step.id}));
  //       }
  //     })
  //   ), { dispatch: false }
  // );

}
