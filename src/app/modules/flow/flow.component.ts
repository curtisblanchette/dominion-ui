import { AfterContentInit, AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { FlowService } from './flow.service';
import { FlowHostDirective, FlowNotesComponent, FlowStep, FlowTransitions, NoStepFoundError } from './index';
import { Store } from '@ngrx/store';
import * as fromFlow from './store/flow.reducer';
import * as fromApp from '../../store/app.reducer';
import { firstValueFrom, lastValueFrom, Observable, take, withLatestFrom } from 'rxjs';
import { Router } from '@angular/router';
import { FiizDropDownComponent, IDropDownMenuItem } from '../../common/components/ui/dropdown';
import { FiizDialogComponent } from '../../common/components/ui/dialog/dialog';
import { Dialog } from '@angular/cdk/dialog';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { DropdownItem } from '../../common/components/interfaces/dropdownitem.interface';
import { distinctUntilChanged } from 'rxjs/operators';
import { cloneDeep } from 'lodash';
import * as flowActions from './store/flow.actions';

@UntilDestroy()
@Component({
  templateUrl: './flow.component.html',
  styleUrls: ['../../../assets/css/_container.scss', './flow.component.scss'],
  animations: FlowTransitions
})
export class FlowComponent implements AfterContentInit, AfterViewInit, OnDestroy {

  animationIndex = 0;
  tabIndex = 1;
  valid$: Observable<boolean | undefined>;
  notes$: Observable<string | null | undefined>;
  notesData: any;
  isFirstStep$: Observable<boolean>;
  isLastStep$: Observable<boolean>;
  status$: Observable<string>;
  timeline$: Observable<FlowStep>;
  objections$: Observable<DropdownItem[]>;

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
  @ViewChild('objectionDropdown') objectionDropdown:FiizDropDownComponent;

  constructor(
    private store: Store<fromFlow.FlowState>,
    public flowService: FlowService,
    private router: Router,
    private dialog: Dialog
  ) {
    this.status$ = this.store.select(fromFlow.selectFlowStatus);
    this.objections$ = this.store.select(fromApp.selectCallObjections)
    this.valid$ = this.store.select(fromFlow.selectIsValid);
    this.isFirstStep$ = this.store.select(fromFlow.selectIsFirstStep);
    this.isLastStep$ = this.store.select(fromFlow.selectIsLastStep);
    this.notes$ = this.store.select(fromFlow.selectVariableByKey('notes'));
    this.timeline$ = this.store.select(fromFlow.selectTimeline);
  }

  public async ngAfterContentInit() {
    // check for an existing process and pass it to start command
    const processExists = await lastValueFrom(this.store.select(fromFlow.selectProcessId).pipe(take(1)));
    await this.flowService.start(!!processExists);
  }

  /**
   * This is where views are rendered
   * triggers are fired here also
   */
  ngAfterViewInit() {
    this.store.select(fromFlow.selectCurrentStepId).pipe(
      withLatestFrom(
        this.store.select(fromFlow.selectTimeline),
        this.store.select(fromFlow.selectAllVariables),
        this.store.select(fromApp.selectSettingGroup('flow'))
      ),
      distinctUntilChanged(),
      untilDestroyed(this)
    ).subscribe(async (res) => {
      let [stepId, steps, vars, settings]: any = res;

      if(steps) {
        const step = steps.find((step: FlowStep) => step.id === stepId);
        const prevStep = steps[steps.findIndex((step: FlowStep) => step.id === stepId) - 1];

        if (typeof prevStep?.afterRoutingTrigger === 'string') {
          const sourceMapComment = `\n //# sourceURL=${prevStep.nodeText}.after.js \n`;
          let code = prevStep?.afterRoutingTrigger;
          code = code.concat(sourceMapComment);
          const afterFn = eval(code);
          const updates = await afterFn(this.flowService, vars, {...cloneDeep(prevStep)}, settings);
          if(updates) {
            this.store.dispatch(flowActions.UpdateStepAction({ id: prevStep.id, changes: updates, strategy: 'merge' } ));
          }
        }

        if (typeof step?.beforeRoutingTrigger === 'string') {
          const sourceMapComment = `\n //# sourceURL=${step.nodeText}.before.js \n`;
          let code = step.beforeRoutingTrigger;
          code = code.concat(sourceMapComment);
          const beforeFn = eval(code);
          const updates = await beforeFn(this.flowService, vars, {...cloneDeep(step)}, settings);
          if (updates) {
            this.store.dispatch(flowActions.UpdateStepAction({id: stepId, changes: updates, strategy: 'merge'}));
          }
        }

        if(stepId) {
          // current step Before Routing
          this.flowService.renderComponent(stepId);
          // current step Before Routing
        }
      }

    });
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

  public endCall() {
    this.dialog.open(FiizDialogComponent, {
      data: {
        title: `Hold on!`,
        body: `
            <div>All information will be lost.</div>
            <div>Are you sure you want to end the call?</div>
        `,
        buttons: {
          cancel: {
            label: 'Cancel',
            type: 'cancel'
          },
          submit: {
            label: `Yes, I'm sure.`,
            type: 'submit',
            class: 'warning',
            fn: this.flowService.restart.bind(this.flowService)
          }
        }
      }
    });
  }

  public async goTo(id: string): Promise<any> {
    const timeline = await firstValueFrom(this.timeline$) as any;
    const selected = timeline.findIndex((x: FlowStep) => x.id === id);
    const current = timeline.findIndex((x: FlowStep) => x.id === this.flowService?.builder.process.currentStepId);
    selected < current ? this.animationIndex-- : this.animationIndex++;
    return this.flowService.goTo(id);
  }

  public ngOnDestroy() {
  }

  public openNotesDialog() {
    this.dialog.open(FlowNotesComponent, {
      data: {
        title: `Notes`,
        type: 'editor',
        buttons: {
          cancel: {
            label: 'Cancel',
            type: 'cancel'
          },
          submit: {
            label: `Save`,
            type: 'submit',
            fn: (html: string) => { return firstValueFrom(this.flowService.updateNote(html)) }
          }
        }
      }
    });
  }

  public goToObjections( value:any ){
    const id = this.flowService.builder.process.steps.find( step => step.component === 'FlowObjectionComponent' )?.id as string;
    this.flowService.addVariables({objectionId: value.id}, id);
    this.flowService.updateStep(id, {state: { data: { title: value.label }}});
    this.flowService.goTo(id);
  }

}
