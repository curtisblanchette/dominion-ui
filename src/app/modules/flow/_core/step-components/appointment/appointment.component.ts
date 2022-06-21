import { Component, OnInit, Renderer2, ViewChildren, ElementRef, QueryList, AfterViewInit } from '@angular/core';
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
import { DropdownItem, FiizSelectComponent } from '../../../../../common/components/ui/forms';
import { environment } from '../../../../../../environments/environment';
import { uriOverrides } from '../../../../../data/entity-metadata';
import { CustomDataService } from '../../../../../data/custom.dataservice';
import { HttpClient } from '@angular/common/http';
import { ModuleType } from '../../classes';


@UntilDestroy()
@Component({
  selector: 'flow-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['../_base.scss', './appointment.component.scss']
})
export class FlowAppointmentComponent extends EntityCollectionComponentBase implements OnInit, AfterViewInit {

  public timeZone:any = 'America/New_York';
  public duration:any = 30;
  public dayStart:any = 7;
  public dayEnd:any = 23;
  public moduleType: any;

  public timeSlots:Array<any> = [];
  public selectedBtnId:string;
  public form:FormGroup;
  public objectionForm:FormGroup;
  public showSlots:boolean = true;
  public objections$:Observable<DropdownItem[]> = of([
    {
      id : 'reason1',
      label : 'This is a test reason'
    },
    {
      id : 'reason2',
      label : 'This is a test reason2'
    }
  ]);
  public offices$:Observable<DropdownItem[]>;

  @ViewChildren('slotBtn') slotBtn: QueryList<ElementRef>;
  @ViewChildren('dropdown') dropdowns: QueryList<FiizSelectComponent>;

  constructor(
    private router: Router,
    entityCollectionServiceFactory: EntityCollectionServiceFactory,
    dataServiceFactory: DefaultDataServiceFactory,
    public flowService: FlowService,
    public store:Store<fromApp.AppState>,
    public renderer:Renderer2,
    public fb:FormBuilder,
    public http: HttpClient
  ) {
    super(router, entityCollectionServiceFactory, dataServiceFactory);
    this.offices$ = this.store.select(fromApp.selectOffices);
    this.moduleType = ModuleType;
  }

  async ngOnInit(): Promise<any> {

    this.form = this.fb.group({
      set_appointment : new FormControl(true, [Validators.required]),
      event_title : new FormControl('', [Validators.required]),
      event_desc : new FormControl('', [Validators.required]),
      office : new FormControl('', [Validators.required])
    });

    this.objectionForm = this.fb.group({
      appt_objection : new FormControl('', [Validators.required])
    });

    this.flowService.addVariables({set_appointment : true}); // Set it default to true
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

    this.duration = await firstValueFrom(this.store.select(fromApp.selectSettingByKey('duration')));
    this.dayStart = await firstValueFrom(this.store.select(fromApp.selectSettingByKey('day_start')));
    this.dayEnd = await firstValueFrom(this.store.select(fromApp.selectSettingByKey('day_end')));
    this.timeZone = await firstValueFrom(this.store.select(fromApp.selectSettingByKey('timezone')));

    const today = dayjs().format('YYYY-MM-DD');
    const tomorrow = dayjs().add(1,'day').format('YYYY-MM-DD');
    const dates = [today, tomorrow];

    for( const date of dates ){
      this._dynamicCollectionService.getWithQuery({startDate:date}).pipe(untilDestroyed(this)).subscribe((data:any) => {
        let bookedSlots:Array<any> = [];
        let freeSlots:Array<any> = [];

        if( data.length ) {
          bookedSlots = data.map((appt: IEvent) => dayjs(appt.startTime));
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
    }

  }

  public async ngAfterViewInit() {

    for(const dropdown of this.dropdowns) {
      const data: any = await firstValueFrom(this.http.get(`${environment.dominion_api_url}/${uriOverrides[dropdown.module]}`)) as DropdownItem[];
      dropdown.items$ = of(CustomDataService.toDropdownItems(data.rows));
    }
  }


  public setEventTime( event:any ){
    this.selectedBtnId = event.target.id;
    this.checkValidity();
  }

  public checkValidity(){
    let isValid:boolean = false;
    if( this.form.value.set_appointment && this.form.value.event_title != '' && this.form.value.office != '' && this.selectedBtnId ){
      isValid = true;
      this.flowService.addVariables({
        appt_date : dayjs(this.selectedBtnId).format('YYYY-MM-DD'),
        appt_time : dayjs(this.selectedBtnId).format('HH:mm:ss'),
        appt_date_time : dayjs(this.selectedBtnId).format('YYYY-MM-DD HH:mm:ss'),
        appt_end_date_time : dayjs(this.selectedBtnId).add(this.duration.value, this.duration.unit).format('YYYY-MM-DD HH:mm:ss'),
        office : this.form.value.office
      });

    } else if ( !this.form.value.set_appointment && this.objectionForm.valid ){
      isValid = true;
    }
    this.store.dispatch(flowActions.SetValidityAction({payload: isValid}));
  }

}
