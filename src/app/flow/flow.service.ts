import { Router } from "@angular/router";
import { FlowStep } from "./common/flow.step";
import { FlowRouter } from "./common/flow.router";
import { FlowLink } from "./common/flow.link";
import { Injectable } from "@angular/core";
import { FlowComponent } from "./flow.component";
import { FlowCondition, FlowStepItem } from "./common";
import { TextComponent } from "./components/text.component";
import { DataComponent } from "./components/data.component";

@Injectable()
export class FlowService {

  public steps: FlowStepItem[] = [];
  public routers: FlowRouter[] = [];
  public links: FlowLink[] = [];

  public currentStep: FlowStepItem;

  constructor(
  ) {
    const first = new FlowStepItem('First', TextComponent, {title: 'First', body: 'The first step'} );
    const second = new FlowStepItem('Second', DataComponent, {title: 'Second', firstName: 'Curtis', lastName: 'Blanchette', phone: '+12507183166', email: 'curtis@4iiz.com'} )
    const link1 = new FlowLink(first, second);

    const third = new FlowStepItem('Third', TextComponent, {title: 'Third', body: 'The third step'} );
    const fourth = new FlowStepItem('Fourth', TextComponent, {title: 'Fourth', body: 'The fourth step'} );

    const condition1 = new FlowCondition(true, third);
    const condition2 = new FlowCondition(false, fourth);
      const condition3 = new FlowCondition(false, first);
    const router1 = new FlowRouter('Router 1', [condition1, condition2, condition3]);

    const link2 = new FlowLink(second, router1);

    this.addStep(first);
    this.addStep(second);
    this.addStep(third);
    this.addStep(fourth);

    this.addLink(link1);

    this.addRouter(router1);

    this.addLink(link2);

  }

  public getFirstStep(): FlowStepItem {
    this.currentStep = this.steps[0];
    return this.steps[0];
  }

  public addStep(step: FlowStepItem) {
    this.steps.push(step);
  }

  public addRouter(router: FlowRouter) {
    this.routers.push(router);
  }

  public addLink(link: FlowLink) {
    this.links.push(link);
  }

}

