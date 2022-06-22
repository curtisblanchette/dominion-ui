import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FlowService } from './flow.service';
import { FlowHostDirective, FlowStepHistoryEntry, FlowTransitions, NoStepFoundError } from './index';
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
  stepHistory$: Observable<FlowStepHistoryEntry[]>;
  valid$: Observable<boolean | undefined>;
  notes$: Observable<string | null | undefined>;
  notesData:any;

  public tinymceOptions = {
    branding: false,
    menubar: false,
    toolbar: 'bold italic strikethrough underline align',
    statusbar: false,
    content_style: `
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
      emitterValue: 'object'
    },
    {
      label: 'End Call',
      icon: 'fa-solid fa-phone-slash',
      emitterValue: 'end-call'
    }
  ];

  @ViewChild(FlowHostDirective, {static: true}) flowHost!: FlowHostDirective;

  constructor(
    private store: Store<fromFlow.FlowState>,
    private flowService: FlowService,
    private router: Router
  ) {

  }

  public async ngOnInit() {
    this.valid$ = this.store.select(fromFlow.selectIsValid);
    this.stepHistory$ = this.store.select(fromFlow.selectStepHistory);
    this.notes$ = this.store.select(fromFlow.selectVariableByKey('notes'));
    await this.flowService.start(this.flowHost);

  }

  public onNext($event: Event) {
    $event.stopPropagation();
    this.animationIndex++;
    return this.flowService.next(this.flowHost)
      .catch((err) => {
        if (err instanceof NoStepFoundError) {
          console.warn(err);
        }
      });
  }

  public onBack($event: Event) {
    $event.stopPropagation();
    this.animationIndex--;

    return this.flowService.back(this.flowHost)
      .catch((err) => {
        if (err instanceof NoStepFoundError) {
          console.warn(err);
        }
      });
  }

  public goTo(id: string): Promise<any> {
    const next = this.flowService.builder.process.steps.findIndex(x => x.id === id);
    const current = this.flowService.builder.process.steps.findIndex(x => x.id === this.flowService?.builder.process.currentStep?.step?.id);
    next < current ? this.animationIndex-- : this.animationIndex++;
    return this.flowService.goTo(this.flowHost, id);
  }

  public ngOnDestroy() {
    this.store.dispatch(flowActions.ResetAction());
  }

  public menuClickAction(event: string) {
    if (event == 'end-call') {
      this.endCall();
    }
  }

  public endCall() {
    this.store.dispatch(flowActions.ResetAction());
    this.router.navigate(['dashboard']);
  }

  public saveNotes( event:any ) {
    this.flowService.addVariables({notes : this.notesData});
  }

}
