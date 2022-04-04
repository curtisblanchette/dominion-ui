import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { FlowService } from "./flow.service";
import { FlowRouter, FlowStep, FlowTransitions } from "./common";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  template: `
    <div class="container">
      <h2>Flow</h2>
      <section [@slide]="animationIndex">
        <router-outlet (activate)="onActivate($event)" name="aux"></router-outlet>
      </section>

      <div class="controls">
        <button (click)="onBack()" class="stroked" [disabled]="breadcrumbs.length === 1">Back</button>
        <button class=primary (click)="onNext()">Next</button>
      </div>
      <div style="font-size: 12px;">
        <span
          *ngFor="let breadcrumb of breadcrumbs; let i = index">{{i > 0 ? '>' : '' }} {{ breadcrumb.nodeText }} </span>
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
  `],
  animations: FlowTransitions
})
export class FlowComponent implements OnInit, OnDestroy {

  animationIndex = 0;
  currentStep: FlowStep;
  breadcrumbs: FlowStep[] = [];
  @ViewChild(FlowComponent) flow: FlowComponent;

  constructor(
    private flowService: FlowService,
    private router: Router,
    private route: ActivatedRoute,
  ) {

  }

  public ngOnInit() {
    this.currentStep = this.flowService.getFirstStep();
    this.breadcrumbs.push(this.currentStep);
    this.renderComponent(this.currentStep);
  }

  public onActivate($event: any) {
  }

  public onNext() {
    this.animationIndex = this.animationIndex + 1;
    // find a link where the "from" is equal to "currentStep"
    const link = this.flowService.links.find(link => link.from.id === this.currentStep.id);
    let step: FlowStep | FlowRouter | undefined = link?.to;

    if (step) {
      // localStorage.setItem('direction', 'next');
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
    this.animationIndex = this.animationIndex - 1;
    if (this.breadcrumbs.length > 1) {
      this.breadcrumbs.pop();
      this.renderComponent(this.breadcrumbs[this.breadcrumbs.length - 1]);
    }
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
