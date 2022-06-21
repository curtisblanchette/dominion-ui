import { Component, OnInit, Renderer2, ViewChildren, ElementRef, QueryList } from '@angular/core';
import { DefaultDataServiceFactory, EntityCollectionServiceFactory } from '@ngrx/data';
import { Store } from '@ngrx/store';
import * as dayjs from 'dayjs';
import { IEvent } from '@4iiz/corev2';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

import { EntityCollectionComponentBase } from '../../../../../data/entity-collection.component.base';
import { FlowService } from '../../../flow.service';
import * as fromApp from '../../../../../store/app.reducer';
import * as flowActions from '../../../store/flow.actions';
import { firstValueFrom, Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { DropdownItem } from '../../../../../common/components/ui/forms/select/select';

@UntilDestroy()
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
  public form:FormGroup;
  public objectionForm:FormGroup;
  public showSlots:boolean = true;
  public objections:Observable<DropdownItem[]> = of([
    {
      id : 'reason1',
      label : 'This is a test reason'
    },
    {
      id : 'reason2',
      label : 'This is a test reason2'
    }
  ]);

  @ViewChildren('slotBtn') slotBtn: QueryList<ElementRef>;

  constructor(
    private router: Router,
    entityCollectionServiceFactory: EntityCollectionServiceFactory,
    dataServiceFactory: DefaultDataServiceFactory,
    public flowService: FlowService,
    public store:Store<fromApp.AppState>,
    public renderer:Renderer2,
    public fb:FormBuilder
  ) {
    super(router, entityCollectionServiceFactory, dataServiceFactory);

  }

  async ngOnInit(): Promise<any> {

    this.form = this.fb.group({
      set_appointment : new FormControl(true, [Validators.required])
    });

    this.objectionForm = this.fb.group({
      appt_objection : new FormControl('', [Validators.required])
    })

    this.form.valueChanges.subscribe((value: any) => {
      if(value.set_appointment){
        this.showSlots = true;
      } else {
        this.showSlots = false;
      }
      this.flowService.addVariables(value);
      this.checkValidity();
    });

    this.objectionForm.statusChanges.subscribe((value: any) => {
      this.flowService.addVariables(value);
      this.checkValidity();
    });

    const startDate = dayjs().add(1,'day').format('YYYY-MM-DD');
    const endDate = dayjs().add(2,'day').format('YYYY-MM-DD');

    this.duration = await firstValueFrom(this.store.select(fromApp.selectSettingByKey('duration')));
    this.dayStart = await firstValueFrom(this.store.select(fromApp.selectSettingByKey('day_start')));
    this.dayEnd = await firstValueFrom(this.store.select(fromApp.selectSettingByKey('day_end')));
    this.timeZone = await firstValueFrom(this.store.select(fromApp.selectSettingByKey('timezone')));

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

    await this.getData( startDate, endDate );
  }

  async getData( startDate: string, endDate: string ) {

      const pattern = { startDate, endDate };
      // this._dynamicCollectionService.setFilter(pattern);
      this.getWithQuery(pattern).pipe(untilDestroyed(this)).subscribe();
  }

  public async createTimeSlots(){

  }

  public setEventTime( event:any ){
    this.selectedBtnId = event.target.id;
    this.checkValidity();
  }

  public checkValidity(){
    let isValid:boolean = false;
    if( this.form.value.set_appointment && this.selectedBtnId ){
      isValid = true;
    } else if ( !this.form.value.set_appointment && this.objectionForm.valid ){
      isValid = true;
    }
    this.store.dispatch(flowActions.SetValidityAction({payload: isValid}));
  }


}
