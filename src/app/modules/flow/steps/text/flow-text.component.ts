import { Component, OnDestroy, OnInit, Input, QueryList, ViewChildren, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { firstValueFrom, map, delay } from 'rxjs';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { DefaultDataServiceFactory, EntityCollectionServiceFactory } from '@ngrx/data';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

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
import { BotAction, FlowBot } from '../../classes';

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
  public callTypes$: Observable<RadioItem[]>;
  public outboundTypes$: Observable<RadioItem[]>;
  public callReasons$: Observable<DropdownItem[]>;
  public answerOptions$: Observable<DropdownItem[]>;
  public callOutcomes$: Observable<DropdownItem[]>;
  public vars$: Observable<any>;
  public ModuleTypes: any;
  public contactFields: any = ContactModel;
  public formValidation:{ [ key:string ] : boolean } = {};
  public formValues:{ [ key:string ] : any } = {};
  public addressState:string = 'create';
  public variables: any;
  public status$: Observable<string>;

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
    this.store.select(fromFlow.selectAllVariables).subscribe(variables => {
      this.variables = variables;
    });
    this.allValid$ = this.store.select(fromFlow.selectFlowTimeline).pipe(
      map(steps => {
        const passing = steps.every((value: any) => !!value.valid);
        return passing;
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
    this.dataComponents.map( (item:FiizDataComponent, index:number) => {

      item.values.subscribe( value => {
        this.flowService.updateStep(this.flowStepId, { variables: value, valid: item.form.valid });
        this.formValues[item.module] = value;
      });

      // item.isValid.subscribe( valid => {
      //   this.formValidation[item.module] = valid;
      //   if( 'relationship-building' == this.data.template ){
      //     if( Object.values(this.formValidation).every(Boolean) ){
      //       this.flowService.setValidity(this.flowStepId, true);
      //     } else {
      //       this.flowService.setValidity(this.flowStepId, false);
      //     }
      //   } else {
      //     if( Object.values(this.formValidation).length == 2 && Object.values(this.formValidation).every(Boolean) ){
      //       this.flowService.setValidity(this.flowStepId, true);
      //     } else {
      //       this.flowService.setValidity(this.flowStepId, false);
      //     }
      //   }
      // });

    });
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

      }
      break;

      case 'recap' : {

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
  }


  public async onSave(){
    switch(this.data.template) {

      case 'relationship-building': {
        const leadForm = this.dataComponents.find(item => item.module === this.ModuleTypes.LEAD);
        leadForm?.save(true);
      }
      break;

      case 'recap': {
        const contactId = await this.flowService.getVariable('contact');
        const contactForm = this.dataComponents.find(item => item.module === this.ModuleTypes.CONTACT);
        const addressForm = this.dataComponents.find(item => item.module === this.ModuleTypes.ADDRESS);

        addressForm?.form.addControl('associate', new FormControl({contact : contactId},[]));
        contactForm?.form.markAsDirty();

        contactForm?.save(true);
        addressForm?.save(true);
      }
      break;

    }
  }

  public runBot() {
    this.flowBot.run(this.flowService);
  }

  get botActions(): BotAction[] {
    return this.flowBot.actions;
  }

  public get isValid() {
    return true;
    // return this.form.valid;
  }

  public endCall() {
    return this.flowService.restart();
  }

}
