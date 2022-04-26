import { Component, OnInit, Renderer2, ViewChildren, ElementRef, QueryList } from '@angular/core';
import { Router } from '@angular/router';
import { EntityCollectionServiceFactory } from '@ngrx/data';
import { Store } from '@ngrx/store';
import * as dayjs from 'dayjs';

import { EntityCollectionComponentBase } from '../../../../../data/entity-collection.component.base';
import { FlowService } from '../../../flow.service';
import { AppointmentService } from './service/appointment.service';
import * as fromApp from '../../../../../store/app.reducer';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['../_base.scss', './appointment.component.scss']
})
export class AppointmentComponent extends EntityCollectionComponentBase implements OnInit {

  public timeZone:any = 'America/New_York';
	public duration:any = 30;
	public dayStart:any = 7;
	public dayEnd:any = 23;

  public timeSlots:Array<any> = [];

  @ViewChildren('slotBtn') slotBtn: QueryList<ElementRef>;

  constructor(
    private router: Router,
    private entityCollectionServiceFactory: EntityCollectionServiceFactory,
    public flowService: FlowService,
    public store:Store<fromApp.AppState>,
    public apptService:AppointmentService,
    public renderer:Renderer2
  ) {
    super(router, entityCollectionServiceFactory);

    this.data$.subscribe(data => {
      if(data.length > 1) {
        console.log(data);
      }
    });
  }

  async ngOnInit(): Promise<any> {
    const day1 = dayjs().add(1,'day').format('YYYY-MM-DD');
    const day2 = dayjs().add(2,'day').format('YYYY-MM-DD');

    this.duration = await firstValueFrom(this.store.select(fromApp.selectSettingByKey('duration')));
    this.dayStart = await firstValueFrom(this.store.select(fromApp.selectSettingByKey('day_start')));
    this.dayEnd =await firstValueFrom(this.store.select(fromApp.selectSettingByKey('day_end')));
    this.timeZone = await firstValueFrom(this.store.select(fromApp.selectSettingByKey('timezone')));

    await this.getData( [day1, day2] );
  }

  async getData( dates:Array<string> ){
    dates.forEach( date => {
      this.apptService.getEvents( date ).subscribe( data => {

        let bookedSlots:Array<any> = [];
        let freeSlots:Array<any> = [];

        if( data && data.count > 0 ){
            data.rows.forEach( (value:{ [key:string] : any }, index:number) => {
              if( value['startTime'] ){
                bookedSlots.push( dayjs(value['startTime']) );
              }
            });
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
        let day:string = dayjs(date).format('dddd MMMM D, YYYY');
        this.timeSlots.push( {[day] : freeSlots} );
      });
    });

  }

  public setEventTime( date:string, time:string, event:any ){
    const elm = this.slotBtn.find(item => item.nativeElement.classList.contains('active'))?.nativeElement;
    if( elm ){
      this.renderer.removeClass(elm, 'active');
    }
    this.renderer.addClass(event.srcElement, 'active');
    const apptSetDate = dayjs(`${date} ${time}`);
  }


}
