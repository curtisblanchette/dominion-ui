import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { FlowService } from "./flow.service";
import { FlowDirective, FlowRouter, FlowStep } from "./common";
import { IStep } from "./common/flow.step.interface";


@Component({
  template: `
    <div>
      <h3>Call Flow</h3>
      <ng-template flowHost></ng-template>
      <button (click)="onBack()" [disabled]="breadcrumbs.length === 1">Back</button>
      <button (click)="onNext()" >Next</button>
    </div>
  `
})
export class FlowComponent implements OnInit, OnDestroy {

  currentStep: FlowStep;
  step: FlowStep;
  breadcrumbs: FlowStep[] = [];
  @ViewChild(FlowComponent) flow: FlowComponent;
  @ViewChild(FlowDirective, {static: true}) flowHost!: FlowDirective;

  constructor(
    private flowService: FlowService
  ) {

  }

  public ngOnInit() {
    this.step = this.flowService.getFirstStep();
    this.currentStep = this.step;
    this.renderComponent(this.currentStep);
    this.breadcrumbs.push(this.currentStep);
  }

  public onNext() {
    // find a link where the "from" is equal to "currentStep"
    const link = this.flowService.links.find(link => link.from.id === this.currentStep.id);

    if (link?.to instanceof FlowStep) {
      const step = this.flowService.steps.find(step => step.id === link.to.id);

      if (step) {
        this.breadcrumbs.push(step);
        this.renderComponent(step);
      }
    } else if (link?.to instanceof FlowRouter) {
      const step = link.to.evaluate();
      this.breadcrumbs.push(step);
      this.renderComponent(step);
    }

  }

  public onBack() {
    if(this.breadcrumbs.length > 1) {
      this.breadcrumbs.pop();
      this.renderComponent(this.breadcrumbs[this.breadcrumbs.length - 1]);
    }

    // find a link where the "from" is equal to "currentStep"
    // const link = this.flowService.links.find(link => link.to.id === this.currentStep.id);
    //
    // if (link?.from instanceof FlowStep) {
    //   const step = this.flowService.steps.find(step => step.id === link.from.id);
    //
    //   if (step) {
    //     this.renderComponent(step);
    //   }
    //
    // } else if (link?.from) {
    //   // Houston, we have a problem.
    // }
  }

  public renderComponent(step: FlowStep) {
    this.currentStep = step;
    this.flowHost.viewContainerRef.clear();

    const componentRef = this.flowHost.viewContainerRef.createComponent<IStep>(step.component);
    componentRef.instance.data = step.data;
  }


  public ngOnDestroy() {

  }

}
