import { Store } from '@ngrx/store';
import * as fromFlow from '../store/flow.reducer';
import { FlowStep } from './flow.step';
import { FlowRouter } from './flow.router';
import { FlowLink } from './flow.link';
import { FlowCurrentStep } from './flow.currentStep';
import { FlowStepHistoryEntry } from './flow.stepHistory';
import * as flowActions from '../store/flow.actions';
import { Inject } from '@angular/core';
import { FlowBaseModel } from './flow.baseModel';
import { ProcessNotFoundError } from './flow.errors';
import { Subscription } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

export class FlowProcess extends FlowBaseModel {

  public steps: FlowStep[] = [];
  public routers: FlowRouter[] = [];
  public links: FlowLink[] = [];
  public currentStep: FlowCurrentStep | null;
  public stepHistory: FlowStepHistoryEntry[];
  public variables: { [key: string]: any };

  public steps$: Subscription;
  public routers$: Subscription;
  public links$: Subscription;
  public currentStep$: Subscription;
  public stepHistory$: Subscription;
  public variables$: Subscription;

  constructor(
    @Inject(Store) private store: Store<fromFlow.FlowState>,
    id?: string,
  ) {

    super(id);

    // if(!this.id) {
    //   throw new ProcessNotFoundError();
    // } else {
    //   this.store.dispatch(flowActions.SetProcessIdAction({processId: this.id}));
    // }

    this.store.select(fromFlow.selectProcessId).subscribe(id => {
      this.id = id;
    });
    this.steps$ = this.store.select(fromFlow.selectSteps).subscribe(steps => {
      this.steps = steps;
    });
    this.routers$ = this.store.select(fromFlow.selectRouters).subscribe(routers => {
      this.routers = routers;
    });
    this.links$ = this.store.select(fromFlow.selectLinks).subscribe(links => {
      this.links = links;
    });
    this.currentStep$ = this.store.select(fromFlow.selectCurrentStep).subscribe(currentStep => {
      this.currentStep = currentStep;
    });
    this.stepHistory$ = this.store.select(fromFlow.selectStepHistory).subscribe(stepHistory => {
      this.stepHistory = stepHistory;
    });
    this.variables$ = this.store.select(fromFlow.selectAllVariables).subscribe(variables => {
      this.variables = variables;
    });
  }

  public reset(): FlowProcess {
    this.id = uuidv4();
    this.store.dispatch(flowActions.SetProcessIdAction({processId: this.id}));
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
    // link.to = (<FlowStep>link.to)._serialize();
    // link.from = (<FlowStep>link.from)._serialize();
    this.store.dispatch(flowActions.AddLinkAction({payload: link}));
    return this;
  }
}
