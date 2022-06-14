import { Store } from '@ngrx/store';
import * as fromFlow from '../../store/flow.reducer';
import { FlowStep } from './flow.step';
import { FlowRouter } from './flow.router';
import { FlowLink } from './flow.link';
import { FlowCurrentStep } from './flow.currentStep';
import { FlowStepHistoryEntry } from './flow.stepHistory';
import * as flowActions from '../../store/flow.actions';
import { Inject } from '@angular/core';
import { FlowBaseModel } from './flow.baseModel';
import { ProcessNotFoundError } from './flow.errors';

export class FlowProcess extends FlowBaseModel {

  public steps: FlowStep[] = [];
  public routers: FlowRouter[] = [];
  public links: FlowLink[] = [];
  public currentStep: FlowCurrentStep | undefined;
  public stepHistory: FlowStepHistoryEntry[];

  constructor(
    @Inject(Store) private store: Store<fromFlow.FlowState>,
    id?: string,
  ) {
    super(id);
    this.store.select(fromFlow.selectFlow).subscribe(state => {
      this.steps = state.steps;
      this.routers = state.routers;
      this.links = state.links;
      this.currentStep = state.currentStep;
      this.stepHistory = state.stepHistory;
    });

    if(!this.id) {
      throw new ProcessNotFoundError();
    }
    this.store.dispatch(flowActions.SetProcessIdAction({processId: this.id}));

  }

  public reset(): FlowProcess {
    this.store.dispatch(flowActions.ResetAction());
    return this;
  }

  public addStep(step: FlowStep): FlowProcess {
    this.store.dispatch(flowActions.AddStepAction({payload: step}));
    return this;
  }

  public addRouter(router: FlowRouter): FlowProcess {
    this.store.dispatch(flowActions.AddRouterAction({payload: router}));
    return this;
  }

  public addLink(link: FlowLink): FlowProcess {
    this.store.dispatch(flowActions.AddLinkAction({payload: link}));
    return this;
  }
}
