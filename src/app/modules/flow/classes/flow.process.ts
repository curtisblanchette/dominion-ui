import { Store } from '@ngrx/store';
import * as fromFlow from '../store/flow.reducer';
import { FlowStep } from './flow.step';
import { FlowRouter } from './flow.router';
import { FlowLink } from './flow.link';
import * as flowActions from '../store/flow.actions';
import { Subscription } from 'rxjs';
import { accumulateVariables } from '../store/flow.reducer';
import { FlowBot } from './flow.bot';
import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class FlowProcess {

  public id: string | undefined;
  public steps: FlowStep[] = [];
  public routers: FlowRouter[] = [];
  public links: FlowLink[] = [];
  public currentStepId: string;
  public firstStepId: string | undefined;
  public variables: { [key: string]: any };

  public steps$: Subscription;
  public routers$: Subscription;
  public links$: Subscription;
  public currentStepId$: Subscription;
  public firstStepId$: Subscription;
  public variables$: Subscription;

  constructor(
    private store: Store<fromFlow.FlowState>,
    public bot: FlowBot,
  ) {

    this.store.select(fromFlow.selectProcessId).subscribe(id => {
      if(id) {
        this.id = id;
      }
    });
    this.steps$ = this.store.select(fromFlow.selectSteps).subscribe(steps => {
      this.steps = steps;
      this.variables = accumulateVariables(this.steps);
    });
    this.routers$ = this.store.select(fromFlow.selectRouters).subscribe(routers => {
      this.routers = routers;
    });
    this.links$ = this.store.select(fromFlow.selectLinks).subscribe(links => {
      this.links = links;
    });
    this.currentStepId$ = this.store.select(fromFlow.selectCurrentStepId).subscribe(currentStepId => {
      if(currentStepId) {
        this.currentStepId = currentStepId;
      }
    });

    this.firstStepId$ = this.store.select(fromFlow.selectFirstStepId).subscribe(id => {
      this.firstStepId = id;
    });
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
