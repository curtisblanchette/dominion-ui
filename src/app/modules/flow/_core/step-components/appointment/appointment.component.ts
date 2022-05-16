import { Component, OnInit, Renderer2, ViewChildren, ElementRef, QueryList } from '@angular/core';
import { Router } from '@angular/router';
import { DefaultDataServiceFactory, EntityCollectionServiceFactory } from '@ngrx/data';
import { Store } from '@ngrx/store';
import * as dayjs from 'dayjs';
import { IEvent } from '@4iiz/corev2';

import { EntityCollectionComponentBase } from '../../../../../data/entity-collection.component.base';
import { FlowService } from '../../../flow.service';
import * as fromApp from '../../../../../store/app.reducer';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'flow-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['../_base.scss', './appointment.component.scss']
})
export class FlowAppointmentComponent extends EntityCollectionComponentBase implements OnInit {

  public timeZone:any = 'America/New_York';
	public duration:any = 30;
	public dayStart:any = 7;
	public dayEnd:any = 23;

  public timeSlots:Array<any> = [];
  public selectedBtnId:string;

  @ViewChildren('slotBtn') slotBtn: QueryList<ElementRef>;

  constructor(
    private router: Router,
    private entityCollectionServiceFactory: EntityCollectionServiceFactory,
    private dataServiceFactory: DefaultDataServiceFactory,
    public flowService: FlowService,
    public store:Store<fromApp.AppState>,
    public renderer:Renderer2
  ) {
    super(router, entityCollectionServiceFactory, dataServiceFactory);

    if (this.data$) {
      this.data$.subscribe((res: any) => {
        if (!this.loading$ && this.loaded$ && res.length === 0) {
          // we only want to query if the cache doesn't return a record
        }
      });
    }

  }

  async ngOnInit(): Promise<any> {
    const startDate = dayjs().add(1,'day').format('YYYY-MM-DD');
    const endDate = dayjs().add(2,'day').format('YYYY-MM-DD');

    this.duration = await firstValueFrom(this.store.select(fromApp.selectSettingByKey('duration')));
    this.dayStart = await firstValueFrom(this.store.select(fromApp.selectSettingByKey('day_start')));
    this.dayEnd = await firstValueFrom(this.store.select(fromApp.selectSettingByKey('day_end')));
    this.timeZone = await firstValueFrom(this.store.select(fromApp.selectSettingByKey('timezone')));

    await this.getData( startDate, endDate );
    await this.createTimeSlots();
  }

  async getData( startDate: string, endDate: string ) {

      const pattern = { startDate, endDate };
      // this._dynamicCollectionService.setFilter(pattern);
      this._dynamicService.getWithQuery(pattern);
  }

  public async createTimeSlots(){
    this.data$.subscribe((data: any) => {
      let bookedSlots:Array<any> = [];
      let freeSlots:Array<any> = [];

      if( data.length ) {
        bookedSlots = data.rows.map((appt: IEvent) => dayjs(appt.startTime));
      }

      let startTime = dayjs().startOf('day').add(this.dayStart.value, this.dayStart.unit);
      const endTime = dayjs().startOf('day').add(this.dayEnd.value, this.dayEnd.unit);

      while( endTime.diff(startTime, 'h') > 0 ){
        const find = bookedSlots.filter( slot => { return startTime.diff(slot, 'm') == 0 });
        if( !find.length ){
          freeSlots.push( startTime.format('hh:mm a') );
        }
        startTime = startTime.add(this.duration.value, this.duration.unit);
      }

      // let day:string = dayjs(date).format('dddd MMMM D, YYYY');
      let day:string = dayjs().format('dddd MMMM D, YYYY');
      this.timeSlots.push( {[day] : freeSlots} );
    });
  }

  public setEventTime( event:any ){
    this.selectedBtnId = event.target.id;
  }


}
