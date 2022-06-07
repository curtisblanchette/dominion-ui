import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FlowService } from "./flow.service";
import { FlowStepHistoryEntry, FlowTransitions } from './_core';
import { Store } from '@ngrx/store';
import * as fromFlow from './store/flow.reducer';
import * as flowActions from './store/flow.actions';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { IDropDownMenuItem } from '../../common/components/ui/dropdown';
import { FlowHostDirective } from './_core/classes/flow.host';

@Component({
  templateUrl: './flow.component.html',
  styleUrls: ['../../../assets/css/_container.scss', './flow.component.scss'],
  animations: FlowTransitions
})
export class FlowComponent implements OnInit, OnDestroy {

  animationIndex = 0;
  tabIndex = 1;
  stepHistory$: Observable<FlowStepHistoryEntry[]>;
  valid$: boolean;

  public flowForm:any;

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

  @ViewChild(FlowHostDirective, { static: true }) flowHost!: FlowHostDirective;

  constructor(
    private store: Store<fromFlow.FlowState>,
    private flowService: FlowService,
    private router: Router
  ) {
    // this catches when a user refreshes the page
    // the inner router-outlet is maintained by this component so we have to strip off aux outlet segments
    if(this.router.routerState.snapshot.url.indexOf('(flow:') !== -1) {
      this.router.navigate(['/flow/text']);
    }

    this.stepHistory$ = this.store.select(fromFlow.selectStepHistory);
  }

  public get isValid(){
    this.store.select(fromFlow.selectCurrentStep).subscribe( res => {
      this.valid$ = !res;
    });
    return true;
  }

  public async ngOnInit() {
    await this.flowService.start(this.flowHost);
  }

  public onNext() {
    this.animationIndex++;
    return this.flowService.next(this.flowHost);
  }

  public onBack(): Promise<any> {
    this.animationIndex--;
    return this.flowService.back(this.flowHost);
  }

  public goTo(id: string): Promise<any> {
    const next = this.flowService.steps.findIndex(x => x.id === id);
    const current = this.flowService.steps.findIndex(x => x.id === this.flowService?.currentStep?.step?.id);
    next < current ? this.animationIndex-- : this.animationIndex++;
    return this.flowService.goTo(this.flowHost, id);
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
