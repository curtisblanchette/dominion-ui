import { Component, OnInit, Renderer2, ViewChildren, ElementRef, QueryList, AfterViewInit, AfterContentInit, Input, ViewChild } from '@angular/core';
import { DefaultDataServiceFactory, EntityCollectionServiceFactory } from '@ngrx/data';
import { Store } from '@ngrx/store';
import * as dayjs from 'dayjs';
import { IEvent } from '@4iiz/corev2';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

import { EntityCollectionComponentBase } from '../../../../data/entity-collection.component.base';
import { FlowService } from '../../flow.service';
import * as fromApp from '../../../../store/app.reducer';
import * as flowActions from '../../store/flow.actions';
import * as fromFlow from '../../store/flow.reducer';
import { Observable, of, Subscription, take } from 'rxjs';
import { Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { DropdownItem, FiizSelectComponent, RadioItem } from '../../../../common/components/ui/forms';
import { HttpClient } from '@angular/common/http';
import { FlowStep, FormInvalidError, OnSave } from '../../classes';
import { DominionType, models } from '../../../../common/models';
import { INestedSetting } from '../../../../store/app.effects';
import { ManipulateType } from 'dayjs';
import { ModuleTypes } from '../../../../data/entity-metadata';
import { Fields } from '../../../../common/models/event.model';
import { environment } from '../../../../../environments/environment';
import { map } from 'rxjs/operators';
import { FiizDataComponent } from '../../../../common/components/ui/data/data.component';

@UntilDestroy()
@Component({
  selector: 'flow-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['../_base.scss', './appointment.component.scss']
})
export class FlowAppointmentComponent extends EntityCollectionComponentBase implements AfterViewInit, AfterContentInit, OnSave {
  private flowStepId: string | undefined;

  public timeZone: any = 'America/New_York';
  public appointmentSettings: INestedSetting;
  public ModuleTypes: any;

  public days: Array<any> = [];
  public selectedBtnId: string;
  public form: FormGroup;
  public eventActionsForm: FormGroup;
  public showSlots: boolean = true;
  public offices$: Observable<DropdownItem[]>;
  public vars$: Observable<any>;
  public id: string;
  public query: { [key: string]: any } = {};
  public eventActions$: Observable<RadioItem[]> = of([{id: 'cancel', label: 'Cancel'}, {
    id: 'reschedule',
    label: 'Reschedule'
  }]);
  public apptData: Observable<Array<any>>;
  public allValid$: Observable<boolean>;

  @Input('options') public override options: { state: 'set' | 'cancel' | 'reschedule', fields: Fields[], payload: any };

  @ViewChild('eventData') eventData: FiizDataComponent;
  @ViewChildren('slotBtn') slotBtn: QueryList<ElementRef>;
  // @ViewChildren('dropdown') dropdowns: QueryList<FiizSelectComponent>;

  constructor(
    private router: Router,
    entityCollectionServiceFactory: EntityCollectionServiceFactory,
    dataServiceFactory: DefaultDataServiceFactory,
    public flowService: FlowService,
    public store: Store<fromApp.AppState>,
    public renderer: Renderer2,
    public fb: FormBuilder,
    public http: HttpClient
  ) {
    super(router, entityCollectionServiceFactory, dataServiceFactory);
    this.offices$ = this.store.select(fromApp.selectOffices);
    this.ModuleTypes = ModuleTypes;

    this.store.select(fromApp.selectSettingGroup('appointment')).subscribe((settings: INestedSetting) => {
      this.appointmentSettings = settings;
    });

    this.store.select(fromApp.selectSettingByKey('timezone')).subscribe((res) => {
      this.timeZone = res.value;
    });

    this.store.select(fromFlow.selectCurrentStepId).subscribe(id => {
      this.flowStepId = id;
    });

    this.vars$ = this.store.select(fromFlow.selectAllVariables);

  }

  public async onSave() {

    switch (this.options.state) {
      case 'cancel': {
        const data = {
          id: this.id,
          outcomeId: 2
        };
        return this.flowService.updateStep(this.flowStepId, {state: { data: { toCancel: this.id }}}, 'merge');
      }

      case 'set':
      case 'reschedule' : {

        if (this.options.state == 'reschedule') {
          // update this step identifying the event ID to reschedule
          this.flowService.updateStep(this.flowStepId, {state: { data: { toReschedule: this.id }}}, 'merge');
        }

        // this.form.patchValue({
        //   contactId: this.flowService.getVariable('contact'),
        //   // startTime: this.flowService.getVariable('startDateTime'),
        //   // endTime: this.flowService.getVariable('endDateTime'),
        //   typeId: 1
        // });

        let payload = { ...this.eventData.form.value, ...this.options.payload };

        this.flowService.updateStep(this.flowStepId, {
          valid: this.form.valid && !!this.selectedBtnId,
          variables: {[`new_event`]: true},
          state: { data: { event: payload }}
        }, 'merge');

        if (this.eventData.form.valid && this.form.valid) {
          this.form.disable();
          return this.cleanForm();
          // this.flowService.updateStep(this.flowStepId, {
          //   valid: true,
          //   state: {data: {[this.module]: this.form.value}}
          // }, 'merge');

          // return this._dynamicCollectionService.add(<DominionType>payload).toPromise().then((res: DominionType | undefined) => {
          //   res = res as IEvent;
          //
          //   this._dynamicCollectionService.setFilter({id: res?.id});
          //   const payload = {
          //     [this.module]: res?.id,
          //     appt_start_time: res?.startTime,
          //     appt_end_time: res?.endTime,
          //     contact : res?.contactId
          //   }
          //   if( res?.contactId ){
          //     this.http.get(environment.dominion_api_url + '/contacts/' + res.contactId).toPromise().then((contactData:any) => {
          //       if( contactData && contactData.addresses && contactData.addresses.length ){
          //         payload['address'] = contactData.addresses[0]['id'];
          //       }
          //     });
          //   }
          //
          //   this.flowService.updateStep(this.flowStepId, {variables: payload, valid: true});
          //
          // });
        } else {
          return;
        }
      }
    }
    throw new FormInvalidError('Appointment Component');
  }

  public override async ngAfterContentInit() {
    await super.ngAfterContentInit();

    if (this.options.state != 'cancel') {
      this.buildForm(this.options.fields);

      if (this.data['event']) {
        this.form.patchValue(this.data['event'], {emitEvent: true});
      }
    }

    if (this.options.state == 'cancel') {
      this.flowService.updateStep(this.flowStepId, {valid: true}, 'merge');
    }

  }

  public async ngAfterViewInit() {
    // // if the step was module to resolve the ID for - do it now
    if (this.data.hasOwnProperty('resolveId')) {
      this.id = this.data.resolveId;
    }

    if (this.id) {
      this.getData();
    }

    if (this.options.state != 'cancel') {
      this.initEventSlots();
    }

  }

  public initEventSlots() {

    const today = dayjs().format('YYYY-MM-DD');
    const tomorrow = dayjs().add(1, 'day').format('YYYY-MM-DD');
    const dates = [today, tomorrow];

    for (const date of dates) {
      this._dynamicCollectionService.getWithQuery({startDate: date}).pipe(untilDestroyed(this)).subscribe((data: any) => {
        let bookedSlots: Array<any> = [];
        let freeSlots: Array<any> = [];

        if (data.length) {
          bookedSlots = data.map((appt: IEvent) => dayjs(appt.startTime));
        }

        let startTime = dayjs(date).startOf('day').add(this.appointmentSettings['day_start'].value, this.appointmentSettings['day_start'].unit as ManipulateType);
        const endTime = dayjs(date).startOf('day').add(this.appointmentSettings['day_end'].value, this.appointmentSettings['day_end'].unit as ManipulateType);

        while (endTime.diff(startTime, 'h') > 0) {
          const find = bookedSlots.filter(slot => {
            return startTime.diff(slot, 'm') == 0
          });
          if (!find.length) {
            if (dayjs().isBefore(startTime)) {
              freeSlots.push(startTime.format('hh:mm a'));
            }
          }
          startTime = startTime.add(this.appointmentSettings['duration'].value, this.appointmentSettings['duration'].unit as ManipulateType);
        }

        let day: string = dayjs(date).format('dddd MMMM D, YYYY');
        this.days.push({[day]: freeSlots});
      });
    }

  }

  public buildForm(fields: string[]) {
    let form: { [key: string]: FormControl } = {};

    for (const field of fields) {
      const control = models[this.module][field];
      form[field] = new FormControl(control.defaultValue, control.validators);
    }

    this.form = this.fb.group(form);

    this.form.valueChanges.pipe(untilDestroyed(this)).subscribe((values: any) => {
      this.flowService.updateStep(this.flowStepId, {valid: this.form.valid && !!this.selectedBtnId});
    });
  }

  public getData() {
    // this._dynamicCollectionService.getByKey(this.id);
    // this._dynamicCollectionService.setFilter({id: this.id}); // this modifies filteredEntities$ subset
    this.getById(this.id).pipe(take(1)).subscribe(val => {
      if (val) {
        let values: Array<any> = [];
        values.push({label: 'Title', value: val.title});
        values.push({label: 'Description', value: val.description});
        values.push({label: 'Start Time', value: val.startTime});
        values.push({label: 'End Time', value: val.endTime});
        this.apptData = of(values);
      }
    });
  }

  public setEventTime(event: any) {
    this.selectedBtnId = event.target.id;
    const startTime = dayjs(event.target.id).format();
    const endTime = dayjs(event.target.id).add(this.appointmentSettings['duration'].value, this.appointmentSettings['duration'].unit as ManipulateType).format();
    this.form.patchValue({startTime, endTime});
    this.flowService.updateStep(this.flowStepId, {valid: true}, 'merge');
  }

  private async cleanForm() {
    this.form.markAsPristine();
    this.form.updateValueAndValidity();
    this.form.enable();
  }

}
