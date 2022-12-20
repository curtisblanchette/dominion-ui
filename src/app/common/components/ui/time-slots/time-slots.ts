import { AfterViewInit, Component, EventEmitter, Input, Output, AfterContentInit, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { DefaultDataServiceFactory, EntityCollectionServiceFactory } from '@ngrx/data';
import { Store } from '@ngrx/store';
import dayjs from 'dayjs';
import { Dayjs, ManipulateType } from 'dayjs';
import { untilDestroyed } from '@ngneat/until-destroy';
import { IEvent } from '@trichome/core';

import { EntityCollectionComponentBase } from '../../../../data/entity-collection.component.base';
import * as fromApp from '../../../../store/app.reducer';
import { FlowService } from '../../../../modules/flow/flow.service';
import { ModuleTypes } from 'src/app/data/entity-metadata';

@Component({
  selector: 'fiiz-time-slots',
  templateUrl: './time-slots.html',
  styleUrls: ['./time-slots.scss']
})
export class FiizTimeSlotComponent extends EntityCollectionComponentBase implements AfterContentInit, AfterViewInit, OnChanges {

  @Input('date') date: string | Dayjs;
  @Input('active') active: boolean = false;
  @Input('default') default: string;

  @Output('getValue') getValue: EventEmitter<any> = new EventEmitter();

  public appointmentSettings: any = {};
  public timeZone: any = 'America/New_York';
  public days: Array<any> = [];
  public selectedDate: string | null;
  public override module: ModuleTypes = ModuleTypes.EVENT;

  constructor(
    entityCollectionServiceFactory: EntityCollectionServiceFactory,
    dataServiceFactory: DefaultDataServiceFactory,
    public router: Router,
    public store: Store<fromApp.AppState>,
    public flowService: FlowService
  ) {
    super(router, entityCollectionServiceFactory, dataServiceFactory);

    if (typeof this.date === 'string') {
      this.date = dayjs(this.date);
    }

    this.store.select(fromApp.selectSettingGroup('appointment')).subscribe((settings: any) => {
      if (settings) {
        settings.forEach((el: any) => {
          this.appointmentSettings[el.name] = el;
        });
      }
    });

    this.store.select(fromApp.selectSettingByKey('timezone')).subscribe((res: any) => {
      this.timeZone = res.value;
    });

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['date']) {
      this.date = dayjs(changes['date']?.currentValue);
      this.eventSlots();
    }
    if (changes['active']) {
      this.active = changes['active']?.currentValue;
      if (!this.active) {
        this.selectedDate = null;
      }
    }

  }

  public override async ngAfterContentInit() {
    await super.ngAfterContentInit();
    this.eventSlots();
  }

  public async ngAfterViewInit() {

  }

  public eventSlots() {
    let dates: Array<any> = [];
    this.days = [];
    if (!this.date) {
      const tomorrow = dayjs().add(1, 'day');//.format('YYYY-MM-DD');
      const dayAfter = dayjs().add(2, 'day');//.format('YYYY-MM-DD');
      dates = [tomorrow, dayAfter];
    } else {
      dates = [dayjs(this.date)];
    }
    for (const date of dates) {
      this._dynamicCollectionService.getWithQuery({startDate: date.format('YYYY-MM-DD')}).pipe(untilDestroyed(this)).subscribe((data: any) => {
        let bookedSlots: Array<any> = [];
        let freeSlots: Array<any> = [];

        if (data.length) {
          bookedSlots = data.map((appt: IEvent) => dayjs(appt.startTime));
        }

        let startTime = date.startOf('day').add(this.appointmentSettings['day_start'].value, this.appointmentSettings['day_start'].unit as ManipulateType);
        const endTime = date.startOf('day').add(this.appointmentSettings['day_end'].value, this.appointmentSettings['day_end'].unit as ManipulateType);

        while (endTime.diff(startTime, 'h') > 0) {
          const find = bookedSlots.filter(slot => {
            return startTime.diff(slot, 'm') == 0
          });

          if (!find.length) {
            if (dayjs().isBefore(startTime)) {
              freeSlots.push(startTime);
            }
          }
          startTime = startTime.add(this.appointmentSettings['duration'].value, this.appointmentSettings['duration'].unit as ManipulateType);
        }

        let day: Date = dayjs(date).toDate();
        this.days.push({[day.toString()]: freeSlots});
      });
    }
  }

  public setEventTime(event: any) {
    let startTime = '';
    let endTime = '';
    if (this.selectedDate === event.target.id) {
      this.selectedDate = null;
    } else {
      this.selectedDate = event.target.id;
      startTime = dayjs(event.target.id).format();
      endTime = dayjs(event.target.id).add(this.appointmentSettings['duration'].value, this.appointmentSettings['duration'].unit as ManipulateType).format();
    }
    this.getValue.emit({startTime, endTime});
  }

}
