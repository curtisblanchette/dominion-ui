import { Component, OnDestroy, OnInit, Input } from '@angular/core';
import { FormControl, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { UntilDestroy } from '@ngneat/until-destroy';
import { lastValueFrom, take } from 'rxjs';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { DropdownItem } from '../../../../common/components/interfaces/dropdownitem.interface';
import { DefaultDataServiceFactory, EntityCollectionServiceFactory } from '@ngrx/data';
import { Router } from '@angular/router';

import { EntityCollectionComponentBase } from '../../../../data/entity-collection.component.base';
import * as flowActions from '../../store/flow.actions';
import { FlowService } from '../../flow.service';
import * as fromFlow from '../../store/flow.reducer';
import { DominionType } from 'src/app/common/models';

// import { FlowMaps } from '../../../_core/classes/flow.lookupMap';
import { ModuleType } from '../../classes';
import * as dayjs from 'dayjs';


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
  public allVars:any = {};
  public callAPI:any;
  public noteAPI:any;

  constructor(
    private store: Store<fromFlow.FlowState>,
    private flowService: FlowService,
    private fb: FormBuilder,
    entityCollectionServiceFactory: EntityCollectionServiceFactory,
    dataServiceFactory: DefaultDataServiceFactory,
    router: Router,
    // private map:FlowMaps,
  ) {
    super(router, entityCollectionServiceFactory, dataServiceFactory);
    this.callAPI = entityCollectionServiceFactory.create(ModuleType.CALL);
    this.noteAPI = entityCollectionServiceFactory.create(ModuleType.NOTE);
    this.callTypes$ = of([{id: 'inbound',label: 'Inbound'}, {id: 'outbound',label: 'Outbound'}]);
    this.webLeadTypes$ = of([ { id : 'contacts', label : 'Search and List Contacts' }, { id : 'web_leads', label : 'Search and List Web Leads' } ]);
  }

  public async ngOnInit(){
    this.allVars = await lastValueFrom(this.store.select(fromFlow.selectAllVariables).pipe(take(1)));
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

      }
        break;

      case 'relationship-building': {

      }
        break;

      case 'recap' : {

        if( this.allVars.set_appointment ){

          const eventPayload = {
            dealId : this.allVars.deal,
            contactId : this.allVars.contact,
            title : this.allVars.event_title,
            description : this.allVars.event_desc,
            startTime : this.allVars.appt_date_time,
            endTime : this.allVars.appt_end_date_time,
            // typeId : await this.map.eventType(),
            officeId : this.allVars.office
          };

          const callPayload = {
            leadId : this.allVars.lead,
            dealId : this.allVars.deal,
            startTime : dayjs().format(),
            direction : this.allVars.call_type,
            // outcomeId : await this.map.callOutcome(),
            // typeId : await this.map.callType(),
            // statusId : await this.map.callStatus(),
            description : '', // Need a field for it as of now
            trackingNumber : '', // Not required as of now
            dialledNumber : '' // Not required as of now
          };

          const notesPayload = {
            entityId : this.allVars.deal,
            entityName : `${ModuleType.DEAL.charAt(0).toUpperCase()}${ModuleType.DEAL.slice(1)}`,
            content : this.allVars.notes || ''
          };

          this._dynamicCollectionService.add(<DominionType><unknown>eventPayload).subscribe().add();
          this.callAPI.add(<DominionType><unknown>callPayload).subscribe().add();
          this.noteAPI.add(<DominionType><unknown>notesPayload).subscribe().add();

        }
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

}
