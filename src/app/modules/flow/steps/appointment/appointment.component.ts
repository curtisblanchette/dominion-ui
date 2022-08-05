import { Component, OnInit, Renderer2, ViewChildren, ElementRef, QueryList, AfterViewInit, AfterContentInit, Input } from '@angular/core';
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
import { Observable, of, take } from 'rxjs';
import { Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { DropdownItem, FiizSelectComponent, RadioItem } from '../../../../common/components/ui/forms';
import { HttpClient } from '@angular/common/http';
import { FormInvalidError, OnSave } from '../../classes';
import { DominionType, models } from '../../../../common/models';
import { INestedSetting } from '../../../../store/app.effects';
import { ManipulateType } from 'dayjs';
import { ModuleTypes } from '../../../../data/entity-metadata';
import { Fields } from '../../../../common/models/event.model';
import { environment } from '../../../../../environments/environment';

@UntilDestroy()
@Component({
  selector: 'flow-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['../_base.scss', './appointment.component.scss']
})
export class FlowAppointmentComponent extends EntityCollectionComponentBase implements OnInit, AfterViewInit, AfterContentInit, OnSave {
  private flowStepId: string | undefined;

  public timeZone: any = 'America/New_York';
  public appointmentSettings: INestedSetting;
  public ModuleTypes: any;

  public timeSlots: Array<any> = [];
  public selectedBtnId: string;
  public form: FormGroup;
  public eventActionsForm: FormGroup;
  public showSlots: boolean = true;
  public offices$: Observable<DropdownItem[]>;
  public vars$: Observable<any>;
  public id: string;
  public query:{[key:string] : any} = {};
  public eventActions$:Observable<RadioItem[]> = of([{id: 'cancel',label: 'Cancel'}, {id: 'reschedule',label: 'Reschedule'}]);
  public apptData: Observable<Array<any>>;

  @Input('options') public override options: { state: 'set' | 'cancel' | 'reschedule', fields: Fields[], payload: any };

  @ViewChildren('slotBtn') slotBtn: QueryList<ElementRef>;
  @ViewChildren('dropdown') dropdowns: QueryList<FiizSelectComponent>;

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
          id : this.id,
          outcomeId : 2
        };
        return this._dynamicCollectionService.update(data).toPromise().then((val) => {
        });
      }

      case 'set':
      case 'reschedule' : {

        if( this.options.state == 'reschedule' ){
          const data = {
            id : this.id,
            outcomeId : 1
          };
          this._dynamicCollectionService.update(data).toPromise().then((val) => {
          });
        }

        this.form.patchValue({
          contactId : await this.flowService.getVariable('contact'),
          startTime : await this.flowService.getVariable('appt_date_time'),
          endTime : await this.flowService.getVariable('appt_end_date_time'),
          typeId : '1'
        });

        let payload = {...this.form.value, ...this.options.payload};

        if (this.form.valid) {
          this.form.disable();

          return this.form.dirty && this._dynamicCollectionService.add(<DominionType>payload).toPromise().then((res: DominionType | undefined) => {
            res = res as IEvent;

            this._dynamicCollectionService.setFilter({id: res?.id});
            const payload = {
              [this.module]: res?.id,
              appt_start_time: res?.startTime,
              appt_end_time: res?.endTime,
              contact : res?.contactId
            }
            if( res?.contactId ){
              this.http.get(environment.dominion_api_url + '/contacts/' + res.contactId).toPromise().then((contactData:any) => {
                if( contactData && contactData.addresses && contactData.addresses.length ){
                  payload['address'] = contactData.addresses[0]['id'];
                }
              });
            }

            this.store.dispatch(flowActions.UpdateStepVariablesAction({id: this.flowStepId, variables: payload}));

          }) || Promise.resolve(this.cleanForm());
        }
      }
    }
    throw new FormInvalidError('Appointment Component');
  }

  public override async ngAfterContentInit() {
    await super.ngAfterContentInit();

    if( this.options.state != 'cancel' ){
      this.buildForm(this.options.fields);
    }

    if( this.options.state == 'cancel' ){
      this.store.dispatch(flowActions.SetValidityAction({payload: true}));
    }

  }

  async ngOnInit(): Promise<any> {

  }

  public async ngAfterViewInit() {
    // // if the step was module to resolve the ID for - do it now
    // if(this.data.hasOwnProperty('resolveId')) {
    //   this.id = this.data.resolveId;
    // }

    if (this.id) {
      this.getData();
    }

    if( this.options.state != 'cancel' ){
      this.initEventSlots();
    }

  }

  public initEventSlots(){

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
            if( dayjs().isBefore(startTime) ){
              freeSlots.push(startTime.format('hh:mm a'));
            }
          }
          startTime = startTime.add(this.appointmentSettings['duration'].value, this.appointmentSettings['duration'].unit as ManipulateType);
        }

        let day: string = dayjs(date).format('dddd MMMM D, YYYY');
        this.timeSlots.push({[day]: freeSlots});
      });
    }

  }

  public buildForm(fields: string[]) {
    let form: { [key: string]: FormControl } = {};

    for (const field of fields) {
      const control = models[this.module][field];
      form[field] = new FormControl(control.defalutValue, control.validators);
    }

    this.form = this.fb.group(form);
    this.form.addControl('officeId', new FormControl('', [Validators.required]));

    this.form.valueChanges.pipe(untilDestroyed(this)).subscribe((value: any) => {
      this.flowService.addVariables(value);
      this.checkValidity();
    });
  }

  public getData() {
    // this._dynamicCollectionService.getByKey(this.id);
    // this._dynamicCollectionService.setFilter({id: this.id}); // this modifies filteredEntities$ subset
    this.getById(this.id).pipe(take(1)).subscribe( val => {
      if( val ){
        let values:Array<any> = [];
        values.push({label : 'Title', value : val.title});
        values.push({label : 'Description', value : val.description});
        values.push({label : 'Start Time', value : val.startTime});
        values.push({label : 'End Time', value : val.endTime});
        this.apptData = of(values);
      }
    });
  }

  public setEventTime(event: any) {
    this.selectedBtnId = event.target.id;
    this.checkValidity();
  }

  private async cleanForm() {
    this.form.markAsPristine();
    this.form.updateValueAndValidity();
    this.form.enable();
    this.store.dispatch(flowActions.SetValidityAction({payload: true}));
  }

  public checkValidity() {
    let isValid: boolean = false;
    if ( this.form.get('title')?.value && this.form.get('officeId')?.value && this.selectedBtnId ) {
      isValid = true;
      this.flowService.addVariables({
        appt_date: dayjs(this.selectedBtnId).format('YYYY-MM-DD'),
        appt_time: dayjs(this.selectedBtnId).format('HH:mm:ss'),
        appt_date_time: dayjs(this.selectedBtnId).format('YYYY-MM-DD HH:mm:ss'),
        appt_end_date_time: dayjs(this.selectedBtnId).add(this.appointmentSettings['duration'].value, this.appointmentSettings['duration'].unit as ManipulateType).format('YYYY-MM-DD HH:mm:ss'),
        office: this.form.value.office
      });
    }

    this.flowService.setValidity(this.flowStepId, isValid);
  }

}
