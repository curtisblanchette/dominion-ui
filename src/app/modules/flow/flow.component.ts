import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { FlowService } from "./flow.service";
import { FlowRouter, FlowStep, FlowTransitions } from "./_core";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  templateUrl: './flow.component.html',
  styleUrls: ['./flow.component.scss'],
  animations: FlowTransitions
})
export class FlowComponent implements OnInit, OnDestroy {

  animationIndex = 0;
  currentStep: FlowStep;
  steps: FlowStep[] = [];
  @ViewChild(FlowComponent) flow: FlowComponent;

  constructor(
    private flowService: FlowService,
    private router: Router,
    private route: ActivatedRoute,
  ) {

  }

  public ngOnInit() {
    this.currentStep = this.flowService.getFirstStep();
    this.steps = this.flowService.steps;
    this.renderComponent(this.currentStep);
  }

  public onActivate($event: any) {
  }

  public onNext() {
    this.animationIndex++;
    // find a link where the "from" is equal to "currentStep"
    const link = this.flowService.links.find(link => link.from.id === this.currentStep.id);
    let step: FlowStep | FlowRouter | undefined = link?.to;

    if (step) {
      // localStorage.setItem('direction', 'next');
      if (step instanceof FlowRouter) {
        step = (<FlowRouter>step).evaluate();
      }

      this.renderComponent(<FlowStep>step);
    } else {
      console.warn('No step found to transition to.');
    }

  }

  public onBack() {
    this.animationIndex--;
    const link = this.flowService.links.find(link => link.to.id === this.currentStep.id);
    let step: FlowStep | FlowRouter | undefined = link?.from;

    // TODO add handling for navigating back through a FlowRouter
    if (step) {
      this.renderComponent(<FlowStep>step);
    } else {
      console.warn('No step found to transition to.');
    }
  }

  public directlyToStep(step: FlowStep) {
    this.steps.indexOf(step) < this.steps.indexOf(this.currentStep) ? this.animationIndex-- : this.animationIndex++;
    this.renderComponent(step);
  }

  public renderComponent(step: FlowStep) {
    this.currentStep = step;

    return this.router.navigate([{outlets: {'aux': [`${step.component}`]}}], {
      state: step.data,
      relativeTo: this.route
    });
  }


  public ngOnDestroy() {

  }

}
