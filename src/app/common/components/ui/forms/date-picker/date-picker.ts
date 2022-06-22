import { Component, EventEmitter, forwardRef, HostBinding, Input, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import * as dayjs from 'dayjs';
import {Dayjs} from 'dayjs';
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
export class FiizDatePickerComponent implements ControlValueAccessor {


  @HostBinding('class.has-label')
  @Input('label') public label: string | number | boolean | undefined;

  @Input('id') id!: string;
  @Input('mode') mode: "day"|"month"|"time"|"daytime";

  @Input('min') min!: string;
  @Input('max') max!: Date | string;

  @Input() isDisabled!: boolean;

  @Input('autofocus') autofocus = false;

  @Output('change') change: EventEmitter<any> = new EventEmitter<any>();

  @Input('config') config: IDatePickerConfig = {
    showGoToCurrent: false
  };

  value!: string | Dayjs;

  onChange: (value: any) => void = () => {};
  onTouched: Function = () => {};

  constructor(
  ) {
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

}
