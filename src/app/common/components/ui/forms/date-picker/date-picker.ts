import { AfterViewInit, Component, EventEmitter, forwardRef, HostBinding, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import * as dayjs from 'dayjs';
import { Dayjs } from 'dayjs';
import { DatePickerComponent } from 'ng2-date-picker';
import { IDatePickerConfig } from 'ng2-date-picker/lib/date-picker/date-picker-config.model';

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
  @Input('mode') mode: "day"|"month"|"time"|"daytime";

  @Input('min') min!: Dayjs | string | undefined;
  @Input('max') max!: Dayjs | string | undefined;

  @Input() isDisabled!: boolean;

  @Input('autofocus') autofocus = false;

  @Output('change') change: EventEmitter<any> = new EventEmitter<any>();

  @Input('config') config: IDatePickerConfig;

  value!: string | Dayjs;
  public startEndValidation:boolean = false;

  @ViewChild('picker') picker:DatePickerComponent;

  onChange: (value: any) => void = () => {};
  onTouched: Function = () => {};

  constructor(
  ) {
    
  }

  ngOnInit(): void {
   
  }

  ngAfterViewInit(): void {
    // this.picker.registerOnChange((value:Dayjs | string) => {
    //   const id = this.picker.inputElement.nativeElement.parentElement?.parentElement?.parentElement?.id;
    //   if( id === 'startTime' ){
    //     if( value == undefined ){
    //       // this.config.min = dayjs().format('YYYY-MM-DD');
    //       // console.log( dayjs().format('YYYY-MM-DD'), dayjs().format('HH:mm') );
    //       // this.picker.minDate = dayjs().format('YYYY-MM-DD');
    //       // this.picker.minTime = dayjs().format('HH:mm');
    //       console.log(this.picker);
    //     }
    //   }
    //   // console.log('value',value);
    // });
    
  }

  writeValue(value: any) {
    this.value = value;
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

  changed(value: Dayjs) {
    if(value && dayjs(value).isValid() ){
      this.value = value;
      this.onChange(this.value.format());
      this.change.emit(this.value.format());
      this.onTouched();
    }

  }

  valueChanged(){

  }

}
