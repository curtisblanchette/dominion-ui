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
import { firstValueFrom, Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { DropdownItem, FiizSelectComponent } from '../../../../common/components/ui/forms';
import { environment } from '../../../../../environments/environment';
import { uriOverrides } from '../../../../data/entity-metadata';
import { CustomDataService } from '../../../../data/custom.dataservice';
import { HttpClient } from '@angular/common/http';
import { FormInvalidError, ModuleType, OnSave } from '../../classes';
import { DominionType, models } from '../../../../common/models';
import { INestedSetting } from '../../../../store/app.effects';
import { ManipulateType } from 'dayjs';


@UntilDestroy()
@Component({
  selector: 'flow-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['../_base.scss', './appointment.component.scss']
})
export class FlowAppointmentComponent extends EntityCollectionComponentBase implements OnInit, AfterViewInit, AfterContentInit, OnSave {

  public timeZone: any = 'America/New_York';

  public appointmentSettings: INestedSetting;
  public moduleType: any;

  public timeSlots: Array<any> = [];
  public selectedBtnId: string;
  public form: FormGroup;
  public objectionForm: FormGroup;
  public showSlots: boolean = true;
  public objections$: Observable<DropdownItem[]> = of([
    {
      id: 'reason1',
      label: 'This is a test reason'
    },
    {
      id: 'reason2',
      label: 'This is a test reason2'
    }
  ]);
  public offices$: Observable<DropdownItem[]>;

  @Input('data') public override data: any;

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
    this.moduleType = ModuleType;

    this.store.select(fromApp.selectSettingGroup('appointment')).subscribe((settings: INestedSetting) => {
      this.appointmentSettings = settings;
    });

    this.store.select(fromApp.selectSettingByKey('timezone')).subscribe((res) => {
      this.timeZone = res.value;
    });
  }

  public onSave() {
    let payload = this.form.value;

    if (this.form.valid) {
      this.form.disable();

      switch (this.options.state) {
        case 'edit': {
          return this.form.dirty && this._dynamicCollectionService.update(<DominionType>payload).toPromise()
            .then(() => this.cleanForm()) || Promise.resolve(this.cleanForm());
        }
        case 'create': {
          // append additional data as payload attachments
          payload = {...payload, ...this.additionalData};

          return this.form.dirty && this._dynamicCollectionService.add(<DominionType>payload).toPromise().then((res) => {
            this._dynamicCollectionService.setFilter({id: res?.id});
            this.store.dispatch(flowActions.AddVariablesAction({payload: {[this.module]: res?.id}}));
          }) || Promise.resolve(this.cleanForm());
        }
      }
    }
    throw new FormInvalidError('Appointment Component');
  }

  public override async ngAfterContentInit() {
    await super.ngAfterContentInit();

    this.buildForm(this.options.fields);
  }

  async ngOnInit(): Promise<any> {

    // this.form = this.fb.group({
    //   set_appointment : new FormControl(true, [Validators.required]),
    //   // event_title : new FormControl('', [Validators.required]),
    //   // event_desc : new FormControl('', [Validators.required]),
    //   // office : new FormControl('', [Validators.required])
    // });

    this.objectionForm = this.fb.group({
      appt_objection: new FormControl('', [Validators.required])
    });

    this.flowService.addVariables({set_appointment: true}); //  default to true

    this.objectionForm.statusChanges.pipe(untilDestroyed(this)).subscribe((value: any) => {
      this.flowService.addVariables(value);
      this.checkValidity();
    });

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

        let startTime = dayjs().startOf('day').add(this.appointmentSettings['day_start'].value, this.appointmentSettings['day_start'].unit as ManipulateType);
        const endTime = dayjs().startOf('day').add(this.appointmentSettings['day_end'].value, this.appointmentSettings['day_end'].unit as ManipulateType);

        while (endTime.diff(startTime, 'h') > 0) {
          const find = bookedSlots.filter(slot => {
            return startTime.diff(slot, 'm') == 0
          });
          if (!find.length) {
            freeSlots.push(startTime.format('hh:mm a'));
          }
          startTime = startTime.add(this.appointmentSettings['duration'].value, this.appointmentSettings['duration'].unit as ManipulateType);
        }

        let day: string = dayjs(date).format('dddd MMMM D, YYYY');
        this.timeSlots.push({[day]: freeSlots});
      });
    }
  }

  public async ngAfterViewInit() {
    for (const dropdown of this.dropdowns) {
      const data: any = await firstValueFrom(this.http.get(`${environment.dominion_api_url}/${uriOverrides[dropdown.module]}`)) as DropdownItem[];
      dropdown.items$ = of(CustomDataService.toDropdownItems(data.rows));
    }
  }

  public buildForm(fields: string[]) {
    let form: { [key: string]: FormControl } = {};

    for (const field of fields) {
      const control = models[this.module][field];
      form[field] = new FormControl(control.defaultValue, control.validators);
    }

    this.form = this.fb.group(form);
    this.form.addControl('officeId', new FormControl('', [Validators.required]))
    this.form.addControl('set_appointment', new FormControl(true, [Validators.required]));

    this.form.valueChanges.pipe(untilDestroyed(this)).subscribe((value: any) => {
      this.showSlots = value.set_appointment;
      this.flowService.addVariables(value);
      this.checkValidity();
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
    if (this.form.value.set_appointment && this.form.value.event_title != '' && this.form.value.office != '' && this.selectedBtnId) {
      isValid = true;
      this.flowService.addVariables({
        appt_date: dayjs(this.selectedBtnId).format('YYYY-MM-DD'),
        appt_time: dayjs(this.selectedBtnId).format('HH:mm:ss'),
        appt_date_time: dayjs(this.selectedBtnId).format('YYYY-MM-DD HH:mm:ss'),
        appt_end_date_time: dayjs(this.selectedBtnId).add(this.appointmentSettings['duration'].value, this.appointmentSettings['duration'].unit as ManipulateType).format('YYYY-MM-DD HH:mm:ss'),
        office: this.form.value.office
      });

    } else if (!this.form.value.set_appointment && this.objectionForm.valid) {
      isValid = true;
    }
    this.store.dispatch(flowActions.SetValidityAction({payload: isValid}));
  }

}