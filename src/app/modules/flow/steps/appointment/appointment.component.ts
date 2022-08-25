import { Component, Renderer2, AfterViewInit, AfterContentInit, Input, ViewChild } from '@angular/core';
import { DefaultDataServiceFactory, EntityCollectionServiceFactory } from '@ngrx/data';
import { Store } from '@ngrx/store';
import * as dayjs from 'dayjs';
import { IEvent } from '@4iiz/corev2';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';

import { EntityCollectionComponentBase } from '../../../../data/entity-collection.component.base';
import { FlowService } from '../../flow.service';
import * as fromApp from '../../../../store/app.reducer';
import * as fromFlow from '../../store/flow.reducer';
import { Observable, of, take } from 'rxjs';
import { Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { DropdownItem, FiizDatePickerComponent, RadioItem } from '../../../../common/components/ui/forms';
import { HttpClient } from '@angular/common/http';
import { FormInvalidError, OnSave } from '../../classes';
import { models } from '../../../../common/models';
import { INestedSetting } from '../../../../store/app.effects';
import { ManipulateType } from 'dayjs';
import { ModuleTypes } from '../../../../data/entity-metadata';
import { Fields } from '../../../../common/models/event.model';
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
  public minDate:string = dayjs().startOf('day').add(2,'days').format();

  @Input('options') public override options: { state: 'set' | 'cancel' | 'reschedule', fields: Fields[], payload: any };

  @ViewChild('eventData') eventData: FiizDataComponent;
  @ViewChild('dateRangePicker') dateRangePicker:FiizDatePickerComponent;

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

        let payload = { ...this.eventData.form.value, ...this.options.payload, ...this.form.value };

        this.flowService.updateStep(this.flowStepId, {
          valid: this.form.valid && !!this.selectedBtnId,
          variables: {[`new_event`]: true},
          state: { data: { event: payload }}
        }, 'merge');

        if (this.eventData.form.valid && this.form.valid) {
          this.form.disable();
          return this.cleanForm();        
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
              freeSlots.push(startTime.format('hh:mm A'));
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
      this.flowService.updateStep(this.flowStepId, {valid: this.form.valid});
    });
  }

  public getData() {
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
    this.dateRangePicker.value = '';
    if( this.selectedBtnId === event.target.id ){
      this.selectedBtnId = '';
      this.flowService.updateStep(this.flowStepId, { valid: false }, 'merge');
    } else {
      this.selectedBtnId = event.target.id;
      const startTime = dayjs(event.target.id).format();
      const endTime = dayjs(event.target.id).add(this.appointmentSettings['duration'].value, this.appointmentSettings['duration'].unit as ManipulateType).format();
      this.form.patchValue({startTime, endTime});
      this.flowService.updateStep(this.flowStepId, { valid: this.form.valid }, 'merge');
    }
  }

  private async cleanForm() {
    this.form.markAsPristine();
    this.form.updateValueAndValidity();
    this.form.enable();
  }

  public getCustomSlot( slot:any ){
    if( slot ){      
      this.selectedBtnId = '';
      this.form.patchValue({startTime : slot['from'], endTime : slot['to']});
      this.flowService.updateStep(this.flowStepId, { valid: this.form.valid }, 'merge');
    }
  }

}
