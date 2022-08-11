import { AfterContentInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { FlowService } from './flow.service';
import { FlowHostDirective, FlowTransitions, NoStepFoundError } from './index';
import { Store } from '@ngrx/store';
import * as fromFlow from './store/flow.reducer';
import * as fromApp from '../../store/app.reducer';
import { firstValueFrom, lastValueFrom, Observable, take } from 'rxjs';
import { Router } from '@angular/router';
import { IDropDownMenuItem } from '../../common/components/ui/dropdown';
import { FiizDialogComponent } from '../../common/components/ui/dialog/dialog';
import { Dialog } from '@angular/cdk/dialog';
import { UntilDestroy } from '@ngneat/until-destroy';

import { DropdownItem } from '../../common/components/interfaces/dropdownitem.interface';
import { ICallNote } from '@4iiz/corev2';

@UntilDestroy()
@Component({
  templateUrl: './flow.component.html',
  styleUrls: ['../../../assets/css/_container.scss', './flow.component.scss'],
  animations: FlowTransitions
})
export class FlowComponent implements AfterContentInit, OnDestroy {

  animationIndex = 0;
  tabIndex = 1;
  valid$: Observable<boolean | undefined>;
  notes$: Observable<string | null | undefined>;
  notesData: any;
  isLastStep$: Observable<boolean>;
  status$: Observable<string>;

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

  public objections$: Observable<DropdownItem>;

  @ViewChild(FlowHostDirective, {static: true}) flowHost!: FlowHostDirective;
  @ViewChild('tinymce') tinymce: any;

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
  }

  public async ngAfterContentInit() {
    // check for an existing process and pass it to start command
    this.flowService.flowHost = this.flowHost;
    const processExists = await lastValueFrom(this.store.select(fromFlow.selectProcessId).pipe(take(1)));
    await this.flowService.start(!!processExists);

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

  public goTo(id: string): Promise<any> {
    const next = this.flowService.builder.process.steps.findIndex(x => x.id === id);
    const current = this.flowService.builder.process.steps.findIndex(x => x.id === this.flowService?.builder.process.currentStepId);
    next < current ? this.animationIndex-- : this.animationIndex++;
    return this.flowService.goTo(id);
  }

  public ngOnDestroy() {
  }

  public saveNotes(html: any): Observable<ICallNote> {
    return this.flowService.updateNote(html);
  }

  public openNotesDialog() {
    this.dialog.open(FiizDialogComponent, {
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
}
