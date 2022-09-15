import { AfterContentInit, AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { FlowService } from './flow.service';
import { FlowHostDirective, FlowNotesComponent, FlowStep, FlowTransitions, NoStepFoundError } from './index';
import { Store } from '@ngrx/store';
import * as fromFlow from './store/flow.reducer';
import * as fromApp from '../../store/app.reducer';
import { firstValueFrom, lastValueFrom, Observable, of, take } from 'rxjs';
import { Router } from '@angular/router';
import { FiizDropDownComponent, IDropDownMenuItem } from '../../common/components/ui/dropdown';
import { FiizDialogComponent } from '../../common/components/ui/dialog/dialog';
import { Dialog } from '@angular/cdk/dialog';
import { UntilDestroy } from '@ngneat/until-destroy';

import { DropdownItem } from '../../common/components/interfaces/dropdownitem.interface';

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
  isLastStep$: Observable<boolean>;
  status$: Observable<string>;
  timeline$: Observable<FlowStep>;
  objections$: Observable<DropdownItem[]>;
  // = of([
  //   {id: 'cost-1', label: 'How much will it cost?'},
  //   {id: 'cost-2', label: 'It\'s too expensive.'},
  //   {id: 'fear-1', label: 'Will it work?'},
  //   {id: 'fear-2', label: 'Are you legitimate?'},
  //   {id: 'fear-3', label: 'Credit card fear.'},
  //   {id: 'urgency-1', label: 'Not ready.'},
  //   {id: 'urgency-2', label: 'Talk to spouse.'},
  // ])

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

  // public objections$: Observable<DropdownItem[]>;

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
    this.isLastStep$ = this.store.select(fromFlow.selectIsLastStep);
    this.notes$ = this.store.select(fromFlow.selectVariableByKey('notes'));
    this.timeline$ = this.store.select(fromFlow.selectFlowTimeline);
  }

  public async ngAfterContentInit() {
    // check for an existing process and pass it to start command
    const processExists = await lastValueFrom(this.store.select(fromFlow.selectProcessId).pipe(take(1)));
    await this.flowService.start(!!processExists);

    this.store.select(fromFlow.selectVariableByKey('objectAndEndCall')).subscribe( obj => {
      if( obj ){
        this.objectionDropdown.title = 'Objections';
      }
    });

  }

  /**
   * This is how WHERE view is rendered.
   */
  ngAfterViewInit() {
    this.store.select(fromFlow.selectCurrentStepId).subscribe(stepId => {
      if(stepId) {
        this.flowService.renderComponent(stepId);
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
        body: `All information will be lost. \n\n Are you sure you want to end the call?`,
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
    this.flowService.addVariables({objectionId : value.id}, id);
    this.flowService.goTo(id);
  }

}
