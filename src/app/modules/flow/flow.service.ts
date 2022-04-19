import { FlowCondition, FlowConditionOperators, FlowLink, FlowRouter, FlowStep } from "./_core";
import { Injectable } from "@angular/core";
import { FlowComponentType } from "./_core/step-components";
import { ModuleType } from './_core/classes/flow.moduleTypes';
import { Store } from '@ngrx/store';
import * as fromFlow from './store/flow.reducer';
import * as flowActions from './store/flow.actions';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class FlowService {
  public cache: { [key: string]: any } = {};

  public steps: FlowStep[];
  public routers: FlowRouter[];
  public links: FlowLink[];
  public currentStep: FlowStep;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<fromFlow.FlowState>
  ) {

    this.store.select(fromFlow.selectSteps).subscribe(steps => {
      this.steps = steps
    });
    this.store.select(fromFlow.selectRouters).subscribe(routers => {
      this.routers = routers;
    });
    this.store.select(fromFlow.selectLinks).subscribe(links => {
      this.links = links;
    });
    this.store.select(fromFlow.selectCurrentStep).subscribe((step: FlowStep) => {
        this.currentStep = step;
    });

  }

  get _currentStep() {
    return this.currentStep;
  }

  public create() {
    const intro = new FlowStep(null,'Intro', 'address-book', FlowComponentType.INTRO, undefined);
    const first = new FlowStep(null, 'First', 'landmark', FlowComponentType.TEXT, {title: 'First', body: 'The first step'} );
    const search = new FlowStep(null, 'Search', 'bullseye', FlowComponentType.LIST, {title: 'Search in Leads', module: ModuleType.LEAD} );
    const newLead = new FlowStep(null, 'New Lead', 'calendar', FlowComponentType.DATA, {title: 'Create a New Lead', firstName: 'Curtis', lastName: 'Blanchette', phone: '+12507183166', email: 'curtis@4iiz.com', module: ModuleType.LEAD} )
    const campaign = new FlowStep(null, 'Campaigns', 'handshake', FlowComponentType.LIST, {title : 'Select Campaigns', module : ModuleType.CAMPAIGN} );

    const link_intro_to_first = new FlowLink(null, intro, first);
    const link_first_to_search = new FlowLink(null, first, search);
    const link_search_to_newLead = new FlowLink(null, search, newLead);
    const link_newLead_to_campaign = new FlowLink(null, newLead, campaign);

    const third = new FlowStep(null, 'Third', '', FlowComponentType.TEXT, {title: 'Third', body: 'The third step'} );
    const fourth = new FlowStep(null, 'Fourth', '', FlowComponentType.TEXT, {title: 'Fourth', body: 'The fourth step'} );

    // const condition1 = new FlowCondition({
    //   module: 'Contact',
    //   attribute: 'firstName',
    //   operator: FlowConditionOperators.EQUALS,
    //   value: 'John'
    // }, third);
    // const condition2 = new FlowCondition(false, fourth);
    // const router1 = new FlowRouter('Router 1', [condition1, condition2]);

    this.addStep(intro)
      .addStep(first)
      .addStep(search)
      .addStep(newLead)
      .addStep(campaign)
      .addLink(link_intro_to_first)
      .addLink(link_first_to_search)
      .addLink(link_search_to_newLead)
      .addLink(link_newLead_to_campaign);
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

      await this.renderComponent(<FlowStep>step);
    } else {
      console.warn('No step found to transition to.');
    }
  }

  public async back() {
    const link = this.links.find(link => link.to.id === this.currentStep.id);

    let step: FlowStep | FlowRouter | undefined = link?.from;

    // TODO add handling for navigating back through a FlowRouter
    if (step) {
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
      state: step.data,
      // relativeTo: this.route
    });
  }

}

