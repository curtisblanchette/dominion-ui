import { Store } from '@ngrx/store';
import * as fromFlow from '../../store/flow.reducer';
import { FlowStep } from './flow.step';
import { FlowRouter } from './flow.router';
import { FlowLink } from './flow.link';
import { FlowCurrentStep } from './flow.currentStep';
import { FlowStepHistoryEntry } from './flow.stepHistory';
import * as flowActions from '../../store/flow.actions';
import { Inject } from '@angular/core';

export class FlowProcess {

  public steps: FlowStep[] = [];
  public routers: FlowRouter[] = [];
  public links: FlowLink[] = [];
  public currentStep: FlowCurrentStep | undefined;
  public stepHistory: FlowStepHistoryEntry[];

  public chunks: (FlowStep | FlowRouter | FlowLink)[][];

  constructor(
    @Inject(Store) private store: Store<fromFlow.FlowState>,
  ) {
    this.store.select(fromFlow.selectFlow).subscribe(state => {
      this.steps = state.steps;
      this.routers = state.routers;
      this.links = state.links;
      this.currentStep = state.currentStep;
      this.stepHistory = state.stepHistory;
    });
  }

  public reset() {
    this.store.dispatch(flowActions.ResetAction());
  }

  public addStep(step: FlowStep) {
    // this.steps.push(step);
    this.store.dispatch(flowActions.AddStepAction({payload: step}));
    return this;
  }

  public addRouter(router: FlowRouter) {
    // this.routers.push(router);
    this.store.dispatch(flowActions.AddRouterAction({payload: router}));
    return this;
  }

  public addLink(link: FlowLink) {
    // this.links.push(link);
    this.store.dispatch(flowActions.AddLinkAction({payload: link}));
    return this;
  }
}
