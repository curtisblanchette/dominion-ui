import { Component, EventEmitter, forwardRef, HostBinding, Input, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

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

  @Input('label') label!: string;
  @Input('id') id!: string;

  @Input('min') min!: string;
  @Input('max') max!: Date | string;

  @Input() isDisabled!: boolean;

  @Input('autofocus') autofocus = false;

  @Output('change') change: EventEmitter<any> = new EventEmitter<any>();

  value!: string;

  onChange: (value: any) => void = () => {};
  onTouched: Function = () => {};

  constructor(
  ) {
  }

  writeValue(value: string) {
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

  changed(value: any) {
    this.value = value;

    this.onChange(this.value);
    this.change.emit(this.value);
    this.onTouched();
  }

}
