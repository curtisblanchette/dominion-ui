import { FlowCondition, FlowConditionOperators, FlowLink, FlowRouter, FlowStep } from "./_core";
import { Injectable } from "@angular/core";
import { FlowComponentType } from "./components";
import { ModuleType } from './_core/classes/flow.moduleTypes';

@Injectable()
export class FlowService {

  public steps: FlowStep[] = [];
  public routers: FlowRouter[] = [];
  public links: FlowLink[] = [];

  public currentStep: FlowStep;

  constructor(
  ) {

    const intro = new FlowStep('Intro', FlowComponentType.INTRO, undefined);
    const first = new FlowStep('First', FlowComponentType.TEXT, {title: 'First', body: 'The first step'} );
    const search = new FlowStep('Search', FlowComponentType.LIST, {title : 'Search in Leads', module : ModuleType.LEAD} );
    const newLead = new FlowStep('New Lead', FlowComponentType.DATA, {title: 'Create a New Lead', firstName: 'Curtis', lastName: 'Blanchette', phone: '+12507183166', email: 'curtis@4iiz.com', module : ModuleType.LEAD} )
    const campaign = new FlowStep('Campaigns', FlowComponentType.LIST, {title : 'Select Campaigns', module : ModuleType.CAMPAIGN} );

    const link_intro_to_first = new FlowLink(intro, first);
    const link_first_to_search = new FlowLink(first, search);
    const link_search_to_newLead = new FlowLink(search, newLead);
    const link_newLead_to_campaign = new FlowLink(newLead, campaign);

    const third = new FlowStep('Third', FlowComponentType.TEXT, {title: 'Third', body: 'The third step'} );
    const fourth = new FlowStep('Fourth', FlowComponentType.TEXT, {title: 'Fourth', body: 'The fourth step'} );
    //
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

  public getFirstStep(): FlowStep {
    this.currentStep = this.steps[0];
    return this.steps[0];
  }

  public addStep(step: FlowStep) {
    this.steps.push(step);
    return this;
  }

  public addRouter(router: FlowRouter) {
    this.routers.push(router);
    return this;
  }

  public addLink(link: FlowLink) {
    this.links.push(link);
    return this;
  }

}

