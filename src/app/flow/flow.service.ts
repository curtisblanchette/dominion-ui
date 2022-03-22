import { Router } from "@angular/router";
import { FlowStep } from "./common/flow.step";
import { FlowRouter } from "./common/flow.router";
import { FlowLink } from "./common/flow.link";
import { Injectable } from "@angular/core";
import { FlowComponent } from "./flow.component";
import { FlowStepItem } from "./common";
import { TextComponent } from "./components/text.component";
import { DataComponent } from "./components/data.component";

// const search = new FlowStep('Search', StepComponent);
// const create = new FlowStep('Create Lead', new Component({}));
// const selectReferral = new FlowStep('Select Referral', new Component({}));
// const relationshipBuilding = new FlowStep('Relationship Building', new Component({}));
//
// const condition1 = new FlowCondition(true, selectReferral);
// const condition2 = new FlowCondition(false, relationshipBuilding);
// const router1 = new FlowRouter('Create New Lead?', [condition1]);
//
// const link1 = new FlowLink(search, create);
// const link2 = new FlowLink(create, router1);
// const link3 = new FlowLink(selectReferral, relationshipBuilding);

@Injectable()
export class FlowService {

  public steps: FlowStepItem[] = [];
  public routers: FlowRouter[] = [];
  public links: FlowLink[] = [];

  public currentStep: FlowStepItem;

  constructor(
    private router: Router
  ) {
    const first = new FlowStepItem('First', TextComponent, {title: 'First', body: 'The first step'} );
    const second = new FlowStepItem('Second', DataComponent, {title: 'Second', firstName: 'Curtis', lastName: 'Blanchette', phone: '+12507183166', email: 'curtis@4iiz.com'} )
    const link1 = new FlowLink(first, second);

    this.addStep(first);
    this.addStep(second);

    this.addLink(link1);

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

  public next() {

  }

  public back() {

  }

}

