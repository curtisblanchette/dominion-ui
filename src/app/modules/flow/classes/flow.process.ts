import { Store } from '@ngrx/store';
import * as fromFlow from '../store/flow.reducer';
import { FlowStep } from './flow.step';
import { FlowRouter } from './flow.router';
import { FlowLink } from './flow.link';
import { FlowStepHistoryEntry } from './flow.stepHistory';
import * as flowActions from '../store/flow.actions';
import { Inject } from '@angular/core';
import { Subscription } from 'rxjs';

export class FlowProcess {
// export class FlowProcess extends FlowBaseModel {

  public id: string | undefined;
  public steps: FlowStep[] = [];
  public routers: FlowRouter[] = [];
  public links: FlowLink[] = [];
  public currentStep: FlowStep | undefined;
  public currentStepVariables: any;
  public currentStepValid: boolean;
  public stepHistory: FlowStepHistoryEntry[];
  public variables: { [key: string]: any };
  public breadcrumbs: any;

  public steps$: Subscription;
  public routers$: Subscription;
  public links$: Subscription;
  public currentStep$: Subscription;
  public currentStepVariables$: Subscription;
  public currentStepValid$: Subscription;
  public stepHistory$: Subscription;
  public variables$: Subscription;
  public breadcrumbs$: Subscription;

  constructor(
    @Inject(Store) private store: Store<fromFlow.FlowState>,
    id?: string,
  ) {

    // super(id);

    if(id) {
      // this.id = id;
      this.store.dispatch(flowActions.SetProcessIdAction({processId: id}));
    }

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

    this.currentStepVariables$ = this.store.select(fromFlow.selectCurrentStepVariables).subscribe(currentStepVariables => {
      this.currentStepVariables = currentStepVariables;
    });

    this.currentStepValid$ = this.store.select(fromFlow.selectCurrentStepValid).subscribe(currentStepValid => {
      this.currentStepValid = currentStepValid;
    });

    this.stepHistory$ = this.store.select(fromFlow.selectStepHistory).subscribe(stepHistory => {
      this.stepHistory = stepHistory;
    });
    this.variables$ = this.store.select(fromFlow.selectAllVariables).subscribe(variables => {
      this.variables = variables;
    });

    this.breadcrumbs$ = this.store.select(fromFlow.selectBreadcrumbs).subscribe(breadcrumbs => {
      this.breadcrumbs = breadcrumbs;
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
    // link.to = (<FlowStep>link.to)._serialize();
    // link.from = (<FlowStep>link.from)._serialize();
    this.store.dispatch(flowActions.AddLinkAction({payload: link}));
    return this;
  }
}
