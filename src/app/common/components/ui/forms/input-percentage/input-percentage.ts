import { Component, forwardRef, HostBinding, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'fiiz-input-percentage',
  templateUrl: './input-percentage.html',
  styleUrls: ['./input-percentage.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => FiizInputPercentageComponent),
    multi: true
  }]
})
export class FiizInputPercentageComponent implements ControlValueAccessor {

  @Input('label') _label!: string;
  @Input('id') id!: string;
  @Input('autofocus') autofocus = false;
  @HostBinding('class.disabled')
  isDisabled = false;
  value: number | string = 0;
  placeholder = this.value;

  onChange: (value: any) => void = () => {};
  onTouched: Function = () => {};

  constructor(

  ) {

  }

  get label(): string {
    return this._label;
  }

  writeValue(value: number) {
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

  changed($event:any) {
    this.value = $event.target.value;

    if (this.value < 0 || this.value === '' ) {
      this.value = 0;
    } else if (this.value > 100) {
      this.value = 100;
    }

    this.onChange(this.value);
    this.onTouched();
  }
}
