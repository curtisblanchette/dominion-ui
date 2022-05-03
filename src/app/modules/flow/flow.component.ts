import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { FlowService } from "./flow.service";
import { FlowTransitions, FlowTimelineComponent } from './_core';
import { Store } from '@ngrx/store';
import * as fromFlow from './store/flow.reducer';
import * as flowActions from './store/flow.actions';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { IDropDownMenuItem } from '../../common/components/ui/dropdown';

@Component({
  templateUrl: './flow.component.html',
  styleUrls: ['../../../assets/css/_container.scss', './flow.component.scss'],
  animations: FlowTransitions
})
export class FlowComponent implements OnInit, OnDestroy {

  animationIndex = 0;
  tabIndex = 1;
  stepHistory$: Observable<string[]>;
  @ViewChild(FlowComponent) flow: FlowComponent;
  @ViewChild(FlowTimelineComponent) timeline: FlowTimelineComponent;

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
  };

  public menuItems: IDropDownMenuItem[] = [
    {
      label: 'Object',
      icon: 'fa-solid fa-gavel',
      emitterValue : 'object'
    },
    {
      label: 'End Call',
      icon: 'fa-solid fa-phone-slash',
      emitterValue : 'end-call'
    }
  ];

  constructor(
    private store: Store<fromFlow.FlowState>,
    private flowService: FlowService,
    private router: Router
  ) {
    // this catches when a user refreshes the page
    // the inner router-outlet is maintained by this component so we have to strip off aux outlet segments
    if(this.router.routerState.snapshot.url.indexOf('(aux:') !== -1) {
      this.router.navigate(['flow/f']);
    }

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

  public menuClickAction( event:string ){
    if( event == 'end-call'){
      this.endCall();
    }
  }

  public endCall() {
    this.store.dispatch(flowActions.ResetAction());
    this.router.navigate(['dashboard']);
  }

}
