import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { FlowService } from "./flow.service";
import { FlowRouter, FlowStep, FlowTransitions } from "./_core";
import { ActivatedRoute, Router } from "@angular/router";
import { Store } from '@ngrx/store';
import * as fromFlow from './store/flow.reducer';
import * as flowActions from './store/flow.actions';

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
    private store: Store<fromFlow.FlowState>
  ) {

  }

  public ngOnInit() {


    this.store.select(fromFlow.selectSteps).subscribe((steps: FlowStep[]) => {
      if(steps) {
        this.steps = steps;
      }
    });

  }

  public onActivate($event: any) {
  }

  public onNext() {
    this.animationIndex++;
    this.flowService.next();
  }

  public onBack() {
    this.animationIndex--;
    this.flowService.back();
  }

  public ngOnDestroy() {

  }

}
