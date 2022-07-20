import { Component, OnDestroy, OnInit, Input, QueryList, ViewChildren, AfterViewInit, AfterContentInit } from '@angular/core';
import { FormControl, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { firstValueFrom, map, delay, startWith } from 'rxjs';
import { Store } from '@ngrx/store';
import { Observable, of, take } from 'rxjs';
import { UpdateStr } from '@ngrx/entity/src/models';
import { DefaultDataServiceFactory, EntityCollectionServiceFactory } from '@ngrx/data';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { EntityCollectionComponentBase } from '../../../../data/entity-collection.component.base';
import * as flowActions from '../../store/flow.actions';
import { FlowService } from '../../flow.service';
import * as fromFlow from '../../store/flow.reducer';
import { ModuleTypes } from '../../../../data/entity-metadata';
import { ContactModel } from '../../../../common/models/contact.model';
import { environment } from '../../../../../environments/environment';
import { CustomDataService } from '../../../../data/custom.dataservice';
import { RadioItem } from '../../../../common/components/ui/forms';
import { FiizDataComponent } from '../../../../common/components/ui/data/data.component';
import { DropdownItem } from '../../../../common/components/interfaces/dropdownitem.interface';
import { DominionType } from '../../../../common/models';


@UntilDestroy()
@Component({
  selector: 'flow-text',
  templateUrl: './flow-text.component.html',
  styleUrls: ['../_base.scss', './flow-text.component.scss']
})
export class FlowTextComponent extends EntityCollectionComponentBase implements OnInit, OnDestroy, AfterViewInit {

  @Input('data') override data: any;
  public form: FormGroup;
  public fields: Array<any> = [];
  public callTypes$: Observable<RadioItem[]>;
  public webLeadTypes$: Observable<RadioItem[]>;
  public callReasons$: Observable<DropdownItem[]>;
  public answerOptions$: Observable<DropdownItem[]>;
  public callOutcomes$: Observable<DropdownItem[]>;
  public vars$: Observable<any>;
  public ModuleTypes: any;
  public contactFields: any = ContactModel;
  public formValidation:{ [ key:string ] : boolean } = {};
  public formValues:{ [ key:string ] : any } = {};
  public leadService: CustomDataService<DominionType>;
  public contactService: CustomDataService<DominionType>;

  @ViewChildren(FiizDataComponent) dataComponents: QueryList<FiizDataComponent>;

  constructor(
    private store: Store<fromFlow.FlowState>,
    public flowService: FlowService,
    private fb: FormBuilder,
    private http: HttpClient,
    entityCollectionServiceFactory: EntityCollectionServiceFactory,
    dataServiceFactory: DefaultDataServiceFactory,
    router: Router
  ) {
    super(router, entityCollectionServiceFactory, dataServiceFactory);
    this.ModuleTypes = ModuleTypes;

    this.leadService = dataServiceFactory.create(ModuleTypes.LEAD) as CustomDataService<DominionType>;
    this.contactService = dataServiceFactory.create(ModuleTypes.CONTACT) as CustomDataService<DominionType>;

    this.callTypes$ = of([{id: 'inbound',label: 'Inbound'}, {id: 'outbound',label: 'Outbound'}]);
    this.webLeadTypes$ = of([{ id : 'contacts', label : 'Contacts' }, { id : 'web_leads', label : 'Web Leads' }]);
    this.callReasons$ = of([{ id : 'cancel/reschedule', label : 'Cancel/Reschedule' }, { id : 'take-notes', label : 'Take Notes' }]);
    this.answerOptions$ = of([
      { id : 'yes', label : 'Yes' },
      { id : 'no', label : 'No' },
      { id : 'leaving-message', label : 'Leaving Message' },
      { id : 'bad-number', label : 'Bad Number' },
      { id : 'wrong-number', label : 'Wrong Number' },
      { id : 'not-working', label : 'Not Working (Disconnected)' },
    ]);
    this.vars$ = this.store.select(fromFlow.selectAllVariables);
  }

  public async ngOnInit(){
    this.vars$.pipe(untilDestroyed(this)).subscribe( vars => {
      if( !vars['contact'] && vars['lead'] ){
        // Get the contact id via API
        // this.contactService.getWithQuery({leadId : vars['lead']}).subscribe( contactData => {
        //   console.log('contactData',contactData);
        // });
      }
    });
    if (this.data) {
      this.initForm();
    }
  }

  public async ngAfterViewInit() {
    this.dataComponents.map( (item:FiizDataComponent, index:number) => {
      
      item.values.subscribe( value => {
        this.store.dispatch(flowActions.AddVariablesAction({ payload: value }));
        this.formValues[item.module] = value;
      });

      item.isValid.subscribe( valid => {
        this.formValidation[item.module] = valid;        
        if( Object.values(this.formValidation).length == 2 && Object.values(this.formValidation).every(Boolean) ){
          this.store.dispatch(flowActions.SetValidityAction({payload: true}));
        } else {
          this.store.dispatch(flowActions.SetValidityAction({payload: false}));
        }
      });

    });    
  }

  public async initForm() {
    let form: any = {};
    let valid:boolean = false;
    let defaultValue:any;
    const existingData = await this.flowService.getStepDataFromHistory();
    
    switch(this.data.template) {

      case 'call-type': {
        if( existingData ){
          this.callTypes$.forEach( (items:RadioItem[]) => {
            items.map( (item:RadioItem, index:number) => {
              if( item.id == existingData['call_type'] ){
                items[index].checked = true;
                defaultValue = existingData['call_type'];
                this.flowService.addVariables({call_type : defaultValue});
              }
            })
          });
        }
        form['call_type'] = new FormControl(defaultValue, [Validators.required]);
      }
        break;

      case 'web-lead': {
        if( existingData ){
          this.webLeadTypes$.forEach( (items:RadioItem[]) => {
            items.map( (item:RadioItem, index:number) => {
              if( item.id == existingData['web_lead_options'] ){
                items[index].checked = true;
                defaultValue = existingData['web_lead_options'];
              }
            })
          });
        }
        form['web_lead_options'] = new FormControl(defaultValue, [Validators.required]);
      }
        break;

      case 'power-question': {
        this.store.dispatch(flowActions.AddVariablesAction({ payload: { appointment_action: 'set'} }));
      }
        break;

      case 'reason-for-call': {
        form['call_reason'] = new FormControl('', [Validators.required]);
      }
        break;

      case 'follow-up-script': {
        this.callOutcomes$ = await firstValueFrom(this.http.get(environment.dominion_api_url + '/call-outcomes').pipe(map((res: any) => {
          return of(CustomDataService.toDropdownItems(res));
        }))) as any;

        form['answered'] = new FormControl('', [Validators.required]);
        form['call_outcome'] = new FormControl(1, [Validators.required]);

      }
        break;

      case 'relationship-building': {
        valid = false;
      }
        break;

      case 'recap' : {
        this.store.dispatch(flowActions.SetValidityAction({payload: true}));
      }
        break;

      default:
        valid = true;
        break;
    }

    if(Object.keys(form).length) {
      
      this.form = this.fb.group(form);
      valid = this.form.valid;

      this.form.valueChanges.subscribe((value: any) => {
        this.flowService.addVariables(value);
      });

      this.form.statusChanges.subscribe((value: any) => {        
        valid = value === 'VALID';
        this.store.dispatch(flowActions.SetValidityAction({payload: valid}));
      });

      of('').pipe(
        untilDestroyed(this),
        delay(100)
      ).subscribe(() => { 
        this.store.dispatch(flowActions.SetValidityAction({payload: valid})) 
      });
    }    
  }


  public async onSave(){
    switch(this.data.template) {

      case 'relationship-building': {
        if( this.formValues ){
          const leadId = await this.flowService.getVariable('lead');
          if( leadId ){

            const updateData = {
              id: leadId,
              changes: this.formValues['lead']
            };
            
            this.leadService.update(<UpdateStr<any>>updateData, false).pipe(take(1)).subscribe((res) => {
              console.log('updated res',res);
            });

          }          
        }
      }
      break;

      case 'recap': {
        if( this.formValues ){
                  
        }
      }
      break;

    }
  }

  public get isValid() {
    return this.form.valid;
  }

  public endCall() {
    return this.flowService.restart();
  }

}
