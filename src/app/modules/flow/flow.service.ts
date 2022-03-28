import { FlowCondition, FlowConditionOperators, FlowLink, FlowRouter, FlowStep } from "./common";
import { Injectable } from "@angular/core";
import { TextComponent } from "./components/text.component";
import { DataComponent } from "./components/data.component";

@Injectable()
export class FlowService {

  public steps: FlowStep[] = [];
  public routers: FlowRouter[] = [];
  public links: FlowLink[] = [];

  public currentStep: FlowStep;

  constructor(
  ) {
    const first = new FlowStep('First', TextComponent, {title: 'First', body: 'The first step'} );
    const second = new FlowStep('Second', DataComponent, {title: 'Second', firstName: 'Curtis', lastName: 'Blanchette', phone: '+12507183166', email: 'curtis@4iiz.com'} )
    const link1 = new FlowLink(first, second);

    const third = new FlowStep('Third', TextComponent, {title: 'Third', body: 'The third step'} );
    const fourth = new FlowStep('Fourth', TextComponent, {title: 'Fourth', body: 'The fourth step'} );

    const condition1 = new FlowCondition({
      module: 'Contact',
      attribute: 'firstName',
      operator: FlowConditionOperators.EQUALS,
      value: 'John'
    }, third);
    const condition2 = new FlowCondition(false, fourth);
    const router1 = new FlowRouter('Router 1', [condition1, condition2]);

    const link2 = new FlowLink(second, router1);


    this.addStep(first).addStep(second).addStep(third).addStep(fourth).addLink(link1).addRouter(router1).addLink(link2);
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

