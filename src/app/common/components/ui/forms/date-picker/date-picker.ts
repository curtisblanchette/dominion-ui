import { AfterViewInit, Component, EventEmitter, forwardRef, HostBinding, Input, OnInit, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import dayjs from 'dayjs';
import { Dayjs } from 'dayjs';
import { Store } from '@ngrx/store';

import * as fromReports from '../../../../../modules/reports/store/reports.reducer';
import * as reportsActions from '../../../../../modules/reports/store/reports.actions';
import { firstValueFrom } from 'rxjs';
import { isObject } from 'lodash';

interface IReport {
  startDate : string,
  endDate : string
}

@Component({
  selector: 'fiiz-date-picker',
  templateUrl: './date-picker.html',
  styleUrls: ['./date-picker.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => FiizDatePickerComponent),
    multi: true
  }]
})
export class FiizDatePickerComponent implements ControlValueAccessor, AfterViewInit, OnInit {


  @HostBinding('class.has-label')
  @Input('label') public label: string | number | boolean | undefined;

  @Input('id') id!: string;
  @Input('pickerType') pickerType: "calendar"|"timer"|"both";
  @Input('reporting') reporting:boolean = false;
  @Input('placeholder') placeholder: string = "Select Date";
  @Input('selectMode') selectMode: "single"|"range"|"rangeFrom"|"rangeTo" = 'single';
  @Input('stepMinute') stepMinute: number = 1;
  @Input('min') min!: Dayjs | string | null;
  @Input('max') max!: Dayjs | string | null;
  @Input() isDisabled!: boolean;
  @Input('autofocus') autofocus = false;

  @Output('change') change: EventEmitter<any> = new EventEmitter<any>();

  public value!: any;
  public startEndValidation:boolean = false;
  public separator:string = '~';


  onChange: (value: any) => void = () => { console.log('this.value',this.value) };
  onTouched: Function = () => {};

  constructor(
    private store: Store<fromReports.ReportsState>,
  ) {

  }

  async ngOnInit() {
    if( this.reporting ){
      const dateRange = await firstValueFrom(this.store.select(fromReports.selectDateRange));
      this.writeValue(dateRange);
    }
  }

  ngAfterViewInit(): void {
  }

  writeValue( value:IReport | string ) {
    if( value ){
      if( isObject(value) ){
        this.value = Object.values(value).map( val => {
          return new Date(val);
        });  
      } else {
        this.value = dayjs(value).format();
      }
    }
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean) {
    this.isDisabled = disabled;
  }

  changed( value:any ) {
    if( this.selectMode != 'single' ){
      let format = '';
      if( this.pickerType == 'calendar' ){
        format = 'YYYY-MM-DD';
      } else if ( this.pickerType == 'timer' ){
        format = 'HH:mm';
      }
      let range = {
        from : dayjs(value[0]).format(format),
        to : dayjs(value[1]).format(format)
      };

      if( this.reporting ){
        let range = {
          startDate : dayjs(value[0]).startOf('day').format('YYYY-MM-DD HH:mm:ss'),
          endDate : dayjs(value[1]).endOf('day').format('YYYY-MM-DD HH:mm:ss')
        };
        this.store.dispatch(reportsActions.SetDateRangeAction(range));
        this.store.dispatch(reportsActions.FetchTeam());
      }
      
      this.change.emit(range);
    } else if (value && dayjs(value).isValid()){
      this.value = dayjs(value).format();
      this.onChange(this.value);
      this.change.emit(this.value);
      this.onTouched();
    }
  }

  valueChanged(){

  }

}
