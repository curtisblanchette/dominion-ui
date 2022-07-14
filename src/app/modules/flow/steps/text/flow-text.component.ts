import { Component, OnDestroy, OnInit, Input } from '@angular/core';
import { FormControl, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { UntilDestroy } from '@ngneat/until-destroy';
import { firstValueFrom, lastValueFrom, map, take } from 'rxjs';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { DropdownItem } from '../../../../common/components/interfaces/dropdownitem.interface';
import { DefaultDataServiceFactory, EntityCollectionServiceFactory } from '@ngrx/data';
import { Router } from '@angular/router';

import { EntityCollectionComponentBase } from '../../../../data/entity-collection.component.base';
import * as flowActions from '../../store/flow.actions';
import { FlowService } from '../../flow.service';
import * as fromFlow from '../../store/flow.reducer';


import { ModuleTypes } from '../../../../data/entity-metadata';
import { ContactModel } from '../../../../common/models/contact.model';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { CustomDataService } from '../../../../data/custom.dataservice';


@UntilDestroy()
@Component({
  selector: 'flow-text',
  templateUrl: './flow-text.component.html',
  styleUrls: ['../_base.scss', './flow-text.component.scss']
})
export class FlowTextComponent extends EntityCollectionComponentBase implements OnInit, OnDestroy {

  @Input('data') override data: any;
  public form: FormGroup;
  public fields: Array<any> = [];
  public callTypes$: Observable<DropdownItem[]>;
  public webLeadTypes$: Observable<DropdownItem[]>;
  public callReasons$: Observable<DropdownItem[]>;
  public answerOptions$: Observable<DropdownItem[]>;
  public callOutcomes$: Observable<DropdownItem[]>;
  public vars$: Observable<any>;
  public callAPI:any;
  public noteAPI:any;
  public ModuleTypes: any;
  public contactFields: any = ContactModel;

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

    this.callAPI = entityCollectionServiceFactory.create(ModuleTypes.CALL);
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
    if (this.data) {
      this.initForm();
    }
  }

  public async initForm() {
    let form: any = {};

    switch(this.data.template) {

      case 'call-type': {
        form['call_type'] = new FormControl('', [Validators.required]);
      }
        break;

      case 'web-lead': {
        form['web_lead_options'] = new FormControl('', [Validators.required]);
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

      }
        break;

      case 'recap' : {

      }
        break;
    }

    if(Object.keys(form).length) {
      this.form = this.fb.group(form);

      this.form.valueChanges.subscribe((value: any) => {
        this.flowService.addVariables(value);
      });

      this.form.statusChanges.subscribe((value: any) => {
        this.store.dispatch(flowActions.SetValidityAction({payload: value === 'VALID'}));
      });
    }

    /** If there is no form, the step's validity should be true */
    this.store.dispatch(flowActions.SetValidityAction({payload: true}));

  }

  public get isValid() {
    return this.form.valid;
  }

  public endCall() {
    return this.flowService.restart();
  }

}
