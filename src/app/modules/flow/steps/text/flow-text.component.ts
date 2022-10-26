import { Component, OnDestroy, OnInit, Input, QueryList, ViewChildren, AfterViewInit, ViewChild, ElementRef, HostBinding } from '@angular/core';
import { FormControl, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { map, debounceTime, distinctUntilChanged, delay, mergeMap, tap, take } from 'rxjs';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { DefaultDataServiceFactory, EntityCollectionServiceFactory } from '@ngrx/data';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { EditorComponent } from '@tinymce/tinymce-angular';

import { EntityCollectionComponentBase } from '../../../../data/entity-collection.component.base';
import { FlowService } from '../../flow.service';
import * as fromFlow from '../../store/flow.reducer';
import * as fromApp from '../../../../store/app.reducer';
import { LookupTypes, ModuleTypes } from '../../../../data/entity-metadata';
import { ContactModel } from '../../../../common/models/contact.model';
import { FiizDatePickerComponent, RadioItem } from '../../../../common/components/ui/forms';
import { FiizDataComponent } from '../../../../common/components/ui/data/data.component';
import { DropdownItem } from '../../../../common/components/interfaces/dropdownitem.interface';
import { FlowBotAction, FlowBotActionStatus, FlowBot } from '../../classes';
import { FiizDropDownComponent } from '../../../../common/components/ui/dropdown';

@UntilDestroy()
@Component({
  selector: 'flow-text',
  templateUrl: './flow-text.component.html',
  styleUrls: [
    '../_base.scss',
    './flow-text.component.scss',
    './_recap.scss',
    './_opp-follow-up.scss',
  ]
})
export class FlowTextComponent extends EntityCollectionComponentBase implements OnInit, AfterViewInit, OnDestroy {
  public static reference: string = 'FlowTextComponent';
  private flowStepId: string | undefined;

  @Input('data') override data: any;

  public form: FormGroup;
  public allValid$: Observable<boolean>;
  public didObject$: Observable<boolean> = of(false);
  public callDirections$: Observable<RadioItem[]>;
  public outboundTypes$: Observable<RadioItem[]>;
  public callReasons$: Observable<DropdownItem[]>;
  public callStatuses$: Observable<DropdownItem[]>;
  public callOutcomes$: Observable<DropdownItem[]>;
  public vars$: Observable<any>;
  public ModuleTypes: any;
  public LookupTypes: any;
  public contactFields: any = ContactModel;
  public formValidation: { [key: string]: boolean } = {};
  public variables: any;
  public status$: Observable<string>;
  public FlowStatus: any;
  public BotActionStatus: any;
  public eventPayload$: Observable<any>;

  public tinymceOptions: Object = {
    branding: false,
    menubar: false,
    toolbar: 'bold italic strikethrough underline align',
    statusbar: false,
    content_style: `
      body {
        font-family: Roboto, Arial, sans-serif;
        font-size: 14px;
        font-weight: 500;
        line-height: 1.5em;
        color: #C6CEED;
      }`
  };

  @HostBinding('attr.data-template') template: string; // set by flowService.renderComponent

  @ViewChild('tinymce') tinymce: EditorComponent;
  @ViewChild('botComment') botComment: ElementRef;
  @ViewChild('callStatusDropdown') callStatusDropdown: FiizDropDownComponent;
  @ViewChild('callReasonDropdown') callReasonDropdown: FiizDropDownComponent;
  @ViewChild('scheduledCallBack') scheduledCallBack: FiizDatePickerComponent;

  @ViewChildren(FiizDataComponent) dataComponents: QueryList<FiizDataComponent>;

  constructor(
    private store: Store<fromFlow.FlowState>,
    public flowService: FlowService,
    private fb: FormBuilder,
    private http: HttpClient,
    private flowBot: FlowBot,
    entityCollectionServiceFactory: EntityCollectionServiceFactory,
    dataServiceFactory: DefaultDataServiceFactory,
    router: Router
  ) {
    super(router, entityCollectionServiceFactory, dataServiceFactory);
    this.ModuleTypes = ModuleTypes;
    this.LookupTypes = LookupTypes;
    this.FlowStatus = fromFlow.FlowStatus;
    this.BotActionStatus = FlowBotActionStatus;
    this.callDirections$ = of([
      {id: 'inbound', label: 'Inbound'},
      {id: 'outbound', label: 'Outbound'}
    ]);
    this.outboundTypes$ = of([
      {id: 'contacts', label: 'Search Contacts'},
      {id: 'opp-follow-up', label: 'Opportunity Follow Up'},
      {id: 'web-leads', label: 'Web Leads'}
    ]);

    this.callReasons$ = of([
      { id: 'set-appointment', label: 'Set Appointment', disabled: false },
      { id: 'cancel-appointment', label: 'Cancel Appointment', disabled: false },
      { id: 'reschedule-appointment', label: 'Reschedule Appointment', disabled: false },
      { id: 'take-notes', label: 'Take Notes', disabled: false }
    ]);

    this.callStatuses$ = this.store.select(fromApp.selectLookupsByKey('callStatus')).pipe(map(statuses => {
      return statuses.map(status => {
        return {...status, disabled: false };
      });
    }));

    this.vars$ = this.store.select(fromFlow.selectAllVariables);
    this.status$ = this.store.select(fromFlow.selectFlowStatus);

    this.store.select(fromFlow.selectCurrentStepId).subscribe(currentStepId => {
      if (currentStepId) {
        this.flowStepId = currentStepId;
      }
    });
    this.store.select(fromFlow.selectAllVariables).pipe(
      map(vars => {
        this.didObject$ = of(!vars['objectAndEndCall']);
        return vars;
      })).subscribe(variables => {
      this.variables = variables;
    });
    this.allValid$ = this.store.select(fromFlow.selectTimeline).pipe(
      map(steps => {
        if (steps) {
          const passing = steps.every((value: any) => !!value.valid);
          return passing;
        }
      })
    );
  }

  public async ngOnInit() {
    if (this.data) {
      this.initStep();
    }
  }

  public async ngAfterViewInit() {
    // this is where we need to update step.state.data for relationship building
    // and probably all the others too, so I won't target anything specific
    // module has to be set.
    this.dataComponents.map((item: FiizDataComponent, index: number) => {
      item.values.subscribe(value => {
        this.flowService.updateStep(this.flowStepId, {
          state: {data: {[this.module]: value}},
          valid: this.dataComponents.map(item => item.form.valid).every(x => x)
        });
      });
    });


  }

  public async initStep() {
    const form: any = {};
    let valid: boolean = false;

    switch (this.template) {

      case 'call-direction': {
        form['call_direction'] = new FormControl(this.variables['call_direction'] || null, [Validators.required]);
      }
        break;

      case 'outbound-type': {
        form['outbound_type'] = new FormControl(this.variables['outbound_type'] || null, [Validators.required]);
      }
        break;

      case 'power-question': {
        this.flowService.updateStep(this.flowStepId, {valid: true, variables: {appointment_action: 'set'}});
      }
        break;

      case 'reason-for-call': {
        if(this.variables['call_direction'] === 'outbound') {
          form['call_statusId'] = new FormControl(this.variables['call_statusId'] || null, [Validators.required]);
        }
        form['call_reason'] = new FormControl(this.variables['call_reason'] || null, [Validators.required]);
      }
        break;

      case 'opp-follow-up': {
        // get all outcomes from the server
        this.callOutcomes$ = this.store.select(fromApp.selectLookupsByKey('callOutcome')).pipe(map((o: DropdownItem[]) => {
          return o.filter((x: any) => ![3,4].includes(x.id));
        }));

        form['call_statusId'] = new FormControl(this.variables['call_statusId'] || null, [Validators.required]);
        form['call_outcomeId'] = new FormControl(this.variables['call_outcomeId'] || null, [Validators.required]);
      }
        break;

      case 'relationship-building': {
        // in this case: we won't be adding anything to this component's form
        // we need to trick FlowBot into handling this like a FlowDataComponent when processing
        // to do so we can give this step.state a `module` and some `data`
        // FlowBots logic can stay relatively the same
        this.module = ModuleTypes.LEAD;
        this.flowService.updateStep(this.flowStepId, {
          state: {
            module: ModuleTypes.LEAD,
            data: {lead: {practiceAreaId: this.variables['practiceAreaId'], state: this.variables['state']}}
          }
        })
      }
        break;

      case 'recap' : {
        this.module = ModuleTypes.LEAD;
        this.flowService.updateStep(this.flowStepId, {
          state: {
            module: ModuleTypes.LEAD,
            data: {lead: {email: null, phone: null}}
          }
        });

        const newLead = await this.flowService.getVariable('new_lead');
        if (newLead) {
          const leadInfo: any = this.flowService.aggregateDataForModule(ModuleTypes.LEAD);
          const leadForm = this.dataComponents.find(item => item.module === ModuleTypes.LEAD);
          leadForm?.form.patchValue({email: leadInfo['email'], phone: leadInfo['phone']});
        }

        const apptStep = this.flowService.builder.process.steps.find(step => step.component === 'FlowAppointmentComponent');
        this.eventPayload$ = of(apptStep?.state.data[ModuleTypes.EVENT]);

      }
        break;

      case 'take-notes' : {
        this.flowService.updateStep(this.flowStepId, {valid: true});
      }
        break;

      case 'end': {
        this.flowBot.run(this.flowService);
      }
        break;

      default:
        valid = true;
        break;
    }

    if (Object.keys(form).length) {

      this.form = this.fb.group(form);

      of('').pipe(
        untilDestroyed(this),
        delay(100)
      ).subscribe(() => {
        this.form.valueChanges.pipe(
          // distinctUntilChanged((prev, curr) => {
          //   return (
          //     prev['call_statusId'] === curr['call_statusId']
          //   );
          // }),
          tap((value) => {
            // DO NOT REMOVE: keeps form validity up to date
            this.flowService.updateStep(this.flowStepId, {variables: value, valid: this.form.valid});
          })
        ).subscribe();
      });

      if(this.variables['call_direction'] === 'outbound' && this.form.controls['call_statusId']) {
        this.form.controls['call_statusId'].valueChanges.subscribe(status => {
          // try to filter the available outcomes based on the deal stage and call status
          let data = [
            {id: 'set-appointment', label: 'Set Appointment', disabled: false},
            {id: 'cancel-appointment', label: 'Cancel Appointment', disabled: false},
            {id: 'reschedule-appointment', label: 'Reschedule Appointment', disabled: false},
            {id: 'take-notes', label: 'Take Notes', disabled: false}
          ];

          if (status !== 1) {
            // No Answer
            data = data.map(reason => {
              reason.disabled = reason.id !== 'take-notes';
              return reason;
            })
          }
          this.callOutcomes$ = of(data);
        });

      }
    }

    if (this.tinymce) {
      this.tinymce.onKeyUp.pipe(
        untilDestroyed(this),
        map((action: any) => {
          return action.event.currentTarget.innerHTML;
        }),
        debounceTime(750),
        distinctUntilChanged(),
        mergeMap(async (html) => this.flowService.updateNotesToCache(this.tinymce.editor.getContent()))
      ).subscribe();
    }
  }

  public async onSave(): Promise<any> {
    switch (this.template) {
      case 'call-direction': {
        return this.flowService.startCall(this.form.value.call_direction);
      }
      case 'relationship-building': {
        return this.dataComponents.map(cmp => cmp.save(false));
      }
      case 'recap': {
        const leadForm = this.dataComponents.find(item => item.module === this.ModuleTypes.Lead);
        leadForm?.form.markAsDirty();
        return leadForm?.save(true);
      }
      case 'opp-follow-up': {
        this.flowService.updateStep(this.flowStepId, { state: { data: { deal: { scheduledCallBack: this.scheduledCallBack?.value || null }}}}, 'merge');
      }
      break;
      case 'take-notes' : {
        this.flowService.updateNotesToCache(this.tinymce.editor.getContent());
      }
    }
  }

  public runBot() {
    this.flowBot.run(this.flowService);
  }

  get botActions(): FlowBotAction[] {
    return this.flowBot.botActions;
  }

  public get isValid() {
    return true;
    // return this.form.valid;
  }

  public endCall() {
    this.flowBot.reset();
    return this.flowService.restart();
  }

  public async afterEditorInit(event: any) {
    if (event) {
      this.tinymce.editor.setContent(await this.flowService.getNotesFromCache());
    }
  }

}
