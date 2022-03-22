import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { FlowService } from "./flow.service";
import { FlowDirective, FlowRouter, FlowStepItem } from "./common";
import { IStep } from "./common/flow.step.interface";


@Component({
  template: `
    <div>
      <h3>Call Flow</h3>
      <ng-template flowHost></ng-template>
      <button (click)="onBack()">Back</button>
      <button (click)="onNext()">Next</button>
    </div>
  `
})
export class FlowComponent implements OnInit, OnDestroy {

  currentStep: FlowStepItem;
  step: FlowStepItem;
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
  }

  public onNext() {
    // find a link where the "from" is equal to "currentStep"
    const link = this.flowService.links.find(link => link.from.id === this.currentStep.id);

    if (link?.to instanceof FlowStepItem) {
      const step = this.flowService.steps.find(step => step.id === link.to.id);

      if (step) {
        this.renderComponent(step);
      }
    } else if (link?.to instanceof FlowRouter) {
      const step = link.to.evaluate();
      this.renderComponent(step);
    }

  }

  public onBack() {
    // find a link where the "from" is equal to "currentStep"
    const link = this.flowService.links.find(link => link.to.id === this.currentStep.id);

    if (link) {
      const step = this.flowService.steps.find(step => step.id === link.from.id);

      if (step) {
        this.renderComponent(step);
      }

    } else {
      // Houston, we have a problem.
    }
  }

  public renderComponent(step: FlowStepItem) {
    this.currentStep = step;
    this.flowHost.viewContainerRef.clear();

    const componentRef = this.flowHost.viewContainerRef.createComponent<IStep>(step.component);
    componentRef.instance.data = step.data;
  }


  public ngOnDestroy() {

  }

}
