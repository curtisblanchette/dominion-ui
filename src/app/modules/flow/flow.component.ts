import { AfterContentInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { FlowService } from './flow.service';
import { FlowHostDirective, FlowObjectionComponent, FlowStepHistoryEntry, FlowTransitions, NoStepFoundError } from './index';
import { Store } from '@ngrx/store';
import * as fromFlow from './store/flow.reducer';
import * as flowActions from './store/flow.actions';
import { lastValueFrom, Observable, take } from 'rxjs';
import { Router } from '@angular/router';
import { IDropDownMenuItem } from '../../common/components/ui/dropdown';
import { FiizDialogComponent } from '../../common/components/ui/dialog/dialog';
import { Dialog } from '@angular/cdk/dialog';

@Component({
  templateUrl: './flow.component.html',
  styleUrls: ['../../../assets/css/_container.scss', './flow.component.scss'],
  animations: FlowTransitions
})
export class FlowComponent implements AfterContentInit, OnDestroy {

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
      emitterValue: 'objection'
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
    private router: Router,
    private dialog: Dialog
  ) {
    this.valid$ = this.store.select(fromFlow.selectIsValid);
    this.stepHistory$ = this.store.select(fromFlow.selectStepHistory);
    this.notes$ = this.store.select(fromFlow.selectVariableByKey('notes'));
  }

  public async ngAfterContentInit() {
    // check for an existing process and pass it to start command
    this.flowService.flowHost = this.flowHost;
    const processExists = await lastValueFrom(this.store.select(fromFlow.selectStepHistory).pipe(take(1)));
    await this.flowService.start(!!processExists.length);
  }

  public onNext($event: Event) {
    $event.stopPropagation();
    this.animationIndex++;
    return this.flowService.next()
      .catch((err) => {
        if (err instanceof NoStepFoundError) {
          console.warn(err);
        }
      });
  }

  public onBack($event: Event) {
    $event.stopPropagation();
    this.animationIndex--;

    return this.flowService.back()
      .catch((err) => {
        if (err instanceof NoStepFoundError) {
          console.warn(err);
        }
      });
  }

  public handleFabAction(action: string) {
    switch(action) {
      case 'objection': {
        // find the objection step somehow
        const objection = this.flowService.builder.process.steps.find(step => step.component === "FlowObjectionComponent");

        if(objection && objection.id) {
          return this.goTo(objection.id);
        }
      }
      break;
      case 'end-call': {

        this.dialog.open(FiizDialogComponent, {
          data: {
            title: `You're about to end the call`,
            body: `Are you sure you are ready to end the current call?`,
            buttons: {
              cancel: {
                label: 'Cancel',
                type: 'cancel',
                fn: () => {
                  // pass a function to be executed when this button is clicked
                  // you may need to .bind() the external instances prototype to it
                }
              },
              submit: {
                label: `Yes, i'm sure.`,
                type: 'submit',
                fn: this.flowService.restart.bind(this.flowService)
              }
            }
          }
        });



      }
      break;
    }
  }

  public goTo(id: string): Promise<any> {
    const next = this.flowService.builder.process.steps.findIndex(x => x.id === id);
    const current = this.flowService.builder.process.steps.findIndex(x => x.id === this.flowService?.builder.process.currentStep?.step?.id);
    next < current ? this.animationIndex-- : this.animationIndex++;
    return this.flowService.goTo(id);
  }

  public ngOnDestroy() {
    // this.store.dispatch(flowActions.ResetAction());
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
