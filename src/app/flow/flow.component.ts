import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { FlowService } from "./flow.service";
import { FlowDirective, FlowRouter, FlowStep } from "./common";
import { IStep } from "./common/flow.step.interface";


@Component({
  template: `
    <div class="container">
      <h1>Call Flowz</h1>
      <section>
        <ng-template flowHost></ng-template>
      </section>

      <div class="controls">
        <button (click)="onBack()" [disabled]="breadcrumbs.length === 1">Back</button>
        <button class=primary (click)="onNext()">Next</button>
      </div>

    </div>
  `,
  styles: [`
    :host {
      display: flex;
      justify-content: space-around;
    }
    .container {
      width: 768px;
      display: flex;
      flex-direction: column;

      .controls {
        display: inherit;
        justify-content: space-between;
      }
    }
    section {
      height: 500px;
      position: relative;
    }
    section ng-component {
      width: 100%;
    }
  `]
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
    let step: FlowStep | FlowRouter | undefined = link?.to;

    if(step) {
      if (step instanceof FlowRouter) {
        step = (<FlowRouter>step).evaluate();
      }

      this.breadcrumbs.push(step);
      this.renderComponent(<FlowStep>step);
    } else {
      console.warn('No step found to transition to.');
    }

  }

  public onBack() {
    if(this.breadcrumbs.length > 1) {
      this.breadcrumbs.pop();
      this.renderComponent(this.breadcrumbs[this.breadcrumbs.length - 1]);
    }
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
