import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { FlowService } from "./flow.service";
import { FlowTransitions } from "./_core";
import { TimelineComponent } from './_core/layout-components';
import { Store } from '@ngrx/store';
import * as fromFlow from './store/flow.reducer';
import * as flowActions from './store/flow.actions';
import { Observable } from 'rxjs';

@Component({
  templateUrl: './flow.component.html',
  styleUrls: ['./flow.component.scss'],
  animations: FlowTransitions
})
export class FlowComponent implements OnInit, OnDestroy {

  animationIndex = 0;
  tabIndex = 1;
  stepHistory$: Observable<string[]>;
  @ViewChild(FlowComponent) flow: FlowComponent;
  @ViewChild(TimelineComponent) timeline: TimelineComponent;

  public tinymceOptions = {
    branding: false,
    menubar: false,
    toolbar: 'bold italic strikethrough underline align',
    statusbar: false,
    content_style:`
      body {
        font-family: Roboto, Arial, sans-serif;
        font-size: 12px;
        font-weight: 500;
        line-height: 1.5em;
        color: #C6CEED;
      }`
  }

  constructor(
    private store: Store<fromFlow.FlowState>,
    private flowService: FlowService,
  ) {
    this.stepHistory$ = this.store.select(fromFlow.selectStepHistory);
  }

  public async ngOnInit() {
    await this.flowService.start();
  }

  public onActivate($event: any) {

  }

  public onNext(): Promise<any> {
    this.animationIndex++;
    return this.flowService.next();
  }

  public onBack(): Promise<any> {
    this.animationIndex--;
    return this.flowService.back();
  }

  public goTo(id: string): Promise<any> {
    const next = this.flowService.steps.findIndex(x => x.id === id);
    const current = this.flowService.steps.findIndex(x => x.id === this.flowService._currentStep.id);
    next < current ? this.animationIndex-- : this.animationIndex++;
    return this.flowService.goTo(id);
  }

  public ngOnDestroy() {
    this.store.dispatch(flowActions.ResetAction());
  }

}
