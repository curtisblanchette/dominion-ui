import { FlowCondition, FlowConditionOperators, FlowLink, FlowRouter, FlowStep } from "./_core";
import { Injectable } from "@angular/core";
import { FlowComponentType } from "./_core/step-components";
import { ModuleType } from './_core/classes/flow.moduleTypes';
import { Store } from '@ngrx/store';
import * as fromFlow from './store/flow.reducer';
import * as flowActions from './store/flow.actions';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable()
export class FlowService {
  public cache: { [key: string]: any } = {};

  public steps: FlowStep[];
  public routers: FlowRouter[];
  public links: FlowLink[];
  public currentStep: FlowStep;
  public stepHistory: string[];


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<fromFlow.FlowState>
  ) {

      this.store.select(fromFlow.selectFlow).subscribe(state => {
        this.steps = state.steps;
        this.routers = state.routers;
        this.links = state.links;
        this.currentStep = state.currentStep;
        this.stepHistory = state.stepHistory;
      });
  }

  get _currentStep() {
    return this.currentStep;
  }

  public reset() {
    this.store.dispatch(flowActions.ResetAction());
  }

  public create() {
    const existingLead = new FlowStep(null, 'Existing Lead?', 'address-book', FlowComponentType.LIST, { title: 'Search Leads', module: ModuleType.LEAD } );
    const newLead = new FlowStep(null, 'New Lead', 'address-book', FlowComponentType.DATA, { title: 'Create a New Lead', firstName: 'Curtis', lastName: 'Blanchette', phone: '+12507183166', email: 'curtis@4iiz.com', module: ModuleType.LEAD } )
    const appointment = new FlowStep(null, 'Set Appointment', 'calendar', FlowComponentType.EVENT,  { title : 'Set an Appointment', module: ModuleType.EVENT } );

    const leadSelected = new FlowCondition(null,() => {
      return this.cache[ModuleType.EVENT]
    }, appointment);
    const leadNotSelected = new FlowCondition(null,() => {
      return !this.cache[ModuleType.LEAD]
    }, newLead);
    const existingLeadRouter = new FlowRouter(null,'Router 1', '',[leadSelected, leadNotSelected]);

    const leadSearch_to_existingLeadRouter = new FlowLink(null, existingLead, existingLeadRouter);

    this.addStep(existingLead)
        // .addStep(newLead)
        .addStep(appointment)
        .addRouter(existingLeadRouter)
        .addLink(leadSearch_to_existingLeadRouter);
  }

  public start(): Promise<any> {
    this.create();
    const firstStep: FlowStep = this.steps[0];
    this.store.dispatch(flowActions.SetCurrentStepAction({ payload: firstStep }));
    return this.renderComponent(firstStep);
  }

  public async goTo(id: string) {
    const step = this.steps.find(x => x.id === id);
    await this.renderComponent(<FlowStep>step);
  }

  public async next() {
    // find a link where the "from" is equal to "currentStep"
    const link = this.links.find(link => link.from.id === this.currentStep.id);

    let step: FlowStep | FlowRouter | undefined = link?.to;

    if (step) {
      // localStorage.setItem('direction', 'next');
      if (step instanceof FlowRouter) {
        step = (<FlowRouter>step).evaluate();
      }

      const clone = [...this.stepHistory];
      clone.push(this.currentStep.id);
      this.store.dispatch(flowActions.SetStepHistoryAction({payload: clone}));

      await this.renderComponent(<FlowStep>step);
    } else {
      console.warn('No step found to transition to.');
    }
  }

  public async back() {
    const clone = [...this.stepHistory]
    const previousStep = clone.pop();
    const step = this.steps.find(step => step.id === previousStep);
    this.store.dispatch(flowActions.SetStepHistoryAction({payload: clone}));
    if(step)  {
      await this.renderComponent(<FlowStep>step);
    } else {
      console.warn('No step found to transition to.');
    }
  }

  public addToCache(module: ModuleType, data: any) {
    this.cache[module] = data;
  }

  public getFromCache(module: ModuleType) {
    return this.cache[module];
  }

  public addStep(step: FlowStep) {
    this.store.dispatch(flowActions.AddStepAction({ payload: step }));
    return this;
  }

  public addRouter(router: FlowRouter) {
    this.store.dispatch(flowActions.AddRouterAction({ payload: router }));
    return this;
  }

  public addLink(link: FlowLink) {
    this.store.dispatch(flowActions.AddLinkAction({ payload: link }));
    return this;
  }

  public renderComponent(step: FlowStep) {
    this.store.dispatch(flowActions.SetCurrentStepAction({ payload: step }));

    return this.router.navigate(['/flow/f', {outlets: {'aux': [`${step.component}`]}}], {
      state: step.data
    });
  }

}

