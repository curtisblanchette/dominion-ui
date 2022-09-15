import { Component, OnDestroy, OnInit, Input, QueryList, ViewChildren, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { firstValueFrom, map, debounceTime, distinctUntilChanged, delay, mergeMap } from 'rxjs';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { DefaultDataServiceFactory, EntityCollectionServiceFactory } from '@ngrx/data';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { EditorComponent } from '@tinymce/tinymce-angular';

import { EntityCollectionComponentBase } from '../../../../data/entity-collection.component.base';
import { FlowService } from '../../flow.service';
import * as fromFlow from '../../store/flow.reducer';
import { ModuleTypes } from '../../../../data/entity-metadata';
import { ContactModel } from '../../../../common/models/contact.model';
import { environment } from '../../../../../environments/environment';
import { CustomDataService } from '../../../../data/custom.dataservice';
import { RadioItem } from '../../../../common/components/ui/forms';
import { FiizDataComponent } from '../../../../common/components/ui/data/data.component';
import { DropdownItem } from '../../../../common/components/interfaces/dropdownitem.interface';
import { BotAction, BotActionStatus, FlowBot } from '../../classes';

@UntilDestroy()
@Component({
  selector: 'flow-text',
  templateUrl: './flow-text.component.html',
  styleUrls: ['../_base.scss', './flow-text.component.scss']
})
export class FlowTextComponent extends EntityCollectionComponentBase implements OnInit, AfterViewInit, OnDestroy {
  private flowStepId: string | undefined;

  @Input('data') override data: any;
  public form: FormGroup;
  public allValid$: Observable<boolean>;
  public didObject$: Observable<boolean> = of(false);
  public callTypes$: Observable<RadioItem[]>;
  public outboundTypes$: Observable<RadioItem[]>;
  public callReasons$: Observable<DropdownItem[]>;
  public answerOptions$: Observable<DropdownItem[]>;
  public callOutcomes$: Observable<DropdownItem[]>;
  public vars$: Observable<any>;
  public ModuleTypes: any;
  public contactFields: any = ContactModel;
  public formValidation:{ [ key:string ] : boolean } = {};
  public addressState:string = 'create';
  public variables: any;
  public status$: Observable<string>;
  public FlowStatus: any;
  public BotActionStatus: any;
  public eventPayload$:Observable<any>;

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

  @ViewChild('tinymce') tinymce: EditorComponent;
  @ViewChild('botComment') botComment: ElementRef;
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
    this.FlowStatus = fromFlow.FlowStatus;
    this.BotActionStatus = BotActionStatus;
    this.callTypes$ = of([{id: 'inbound',label: 'Inbound'}, {id: 'outbound',label: 'Outbound'}]);
    this.outboundTypes$ = of([{ id : 'contacts', label : 'Contacts' }, { id : 'web_leads', label : 'Web Leads' }]);
    this.callReasons$ = of([{ id : 'cancel-appointment', label : 'Cancel Appointment' }, { id : 'reschedule-appointment', label : 'Reschedule Appointment' }, { id : 'take-notes', label : 'Take Notes' }]);
    this.answerOptions$ = of([
      { id : 'yes', label : 'Yes' },
      { id : 'no', label : 'No' },
      { id : 'leaving-message', label : 'Leaving Message' },
      { id : 'bad-number', label : 'Bad Number' },
      { id : 'wrong-number', label : 'Wrong Number' },
      { id : 'not-working', label : 'Not Working (Disconnected)' },
    ]);
    this.vars$ = this.store.select(fromFlow.selectAllVariables);
    this.status$ = this.store.select(fromFlow.selectFlowStatus);

    this.store.select(fromFlow.selectCurrentStepId).subscribe(currentStepId => {
      if(currentStepId) {
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
    this.allValid$ = this.store.select(fromFlow.selectFlowTimeline).pipe(
      map(steps => {
        if (steps) {
          const passing = steps.every((value: any) => !!value.valid);
          return passing;
        }
      })
    );

  }

  public async ngOnInit(){
    if (this.data) {
      if( await this.flowService.getVariable('address') ){
        this.addressState = 'edit';
      }
      this.initStep();
    }
  }

  public async ngAfterViewInit() {
    // this is where we need to update step.state.data for relationship building
    // and probably all the others too, so I won't target anything specific
    // module has to be set.
    this.dataComponents.map( (item:FiizDataComponent, index:number) => {
      item.values.subscribe( value => {
        this.flowService.updateStep(this.flowStepId, { state: { data: { [this.module]: value }}, valid: this.dataComponents.map(item => item.form.valid).every(x => x) });
      });
    });

    if( this.data.template === 'recap' ){
      const newLead = await this.flowService.getVariable('new_lead');
      if( newLead ){
        const leadInfo:any = this.flowService.aggregateDataForModule(ModuleTypes.LEAD);
        const leadForm = this.dataComponents.find(item => item.module === ModuleTypes.LEAD);
        leadForm?.form.patchValue({email : leadInfo['email'], phone : leadInfo['phone']});
      }
    }

  }

  public async initStep() {
    const form: any = {};
    let valid: boolean = false;

    switch(this.data.template) {

      case 'call-type': {
        form['call_type'] = new FormControl(this.variables['call_type'] || null, [Validators.required]);
      }
      break;

      case 'outbound-type': {
        form['outbound_type'] = new FormControl(this.variables['outbound_type'] || null, [Validators.required]);
      }
      break;

      case 'power-question': {
        this.flowService.updateStep(this.flowStepId, {valid: true, variables: { appointment_action: 'set' }});
      }
      break;

      case 'reason-for-call': {
        form['call_reason'] = new FormControl(this.variables['call_reason'] || null, [Validators.required]);
      }
      break;

      case 'follow-up-script': {
        this.callOutcomes$ = await firstValueFrom(this.http.get(environment.dominion_api_url + '/call-outcomes').pipe(map((res: any) => {
          return of(CustomDataService.toDropdownItems(res));
        }))) as any;

        form['answered'] = new FormControl(this.variables['answered'] || null, [Validators.required]);
        form['call_outcome'] = new FormControl(this.variables['call_outcome'] || null, [Validators.required]);
      }
      break;

      case 'relationship-building': {
        // in this case: we won't be adding anything to this component's form
        // we need to trick FlowBot into handling this like a FlowDataComponent when processing
        // to do so we can give this step.state a `module` and some `data`
        // FlowBots logic can stay relatively the same
        this.module = ModuleTypes.LEAD;
        this.flowService.updateStep(this.flowStepId, { state: { module: ModuleTypes.LEAD, data: { lead: { practiceAreaId: null, state: null } } } })
      }
      break;

      case 'recap' : {
        const apptStep = this.flowService.builder.process.steps.find( step => step.component === 'FlowAppointmentComponent' );
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

    if(Object.keys(form).length) {

      this.form = this.fb.group(form);
      // valid = this.form.valid;

      // this.form.valueChanges.subscribe((value: any) => {
      //   this.flowService.updateStep(this.flowStepId, { variables: value, valid: this.form.valid });
      // });
      //
      // this.form.statusChanges.subscribe((value: any) => {
      //   this.flowService.setValidity(this.flowStepId, value === 'VALID');
      // });

      of('').pipe(
        untilDestroyed(this),
        delay(100)
      ).subscribe(() => {
        this.form.valueChanges.subscribe((value: any) => {
          this.flowService.updateStep(this.flowStepId, { variables: value, valid: this.form.valid });
        });
      });
    }

    if( this.tinymce ){
      this.tinymce.onKeyUp.pipe(
        untilDestroyed(this),
        map((action: any) => {
          return action.event.currentTarget.innerHTML;
        }),
        debounceTime(750),
        distinctUntilChanged(),
        mergeMap(async (html) => this.flowService.updateNotesToCache(this.tinymce.editor.getContent()) )
      ).subscribe();
    }

  }


  public async onSave(){
    switch(this.data.template) {

      case 'relationship-building': {
        this.dataComponents.map(cmp => cmp.save(false));
        // should I make it append this form data to the lead create form?
        // that might make the most sense, but a new entity update would allow it to continue ambiguously (as intended)

      }
      break;

      case 'recap': {
        const leadForm = this.dataComponents.find(item => item.module === this.ModuleTypes.Lead);
        leadForm?.form.markAsDirty();
        leadForm?.save(true);
      }
      break;

    }
  }

  public runBot() {
    this.flowBot.run(this.flowService);
  }

  get botActions(): BotAction[] {
    return this.flowBot.botActions;
  }

  public get isValid() {
    return true;
    // return this.form.valid;
  }

  public endCall() {
    return this.flowService.restart();
  }

  public async afterEditorInit( event:any ){
    if( event ){
      this.tinymce.editor.setContent( await this.flowService.getNotesFromCache() );
    }
  }

}
