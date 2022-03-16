import { Component, forwardRef, HostBinding, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'fiiz-input-currency',
  templateUrl: './input-currency.html',
  styleUrls: ['./input-currency.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => FiizInputCurrencyComponent),
    multi: true
  }]
})
export class FiizInputCurrencyComponent implements ControlValueAccessor {

  @Input('label') _label!: string;
  @Input('id') id!: string;
  @Input('autofocus') autofocus = false;
  @HostBinding('class.disabled')
  isDisabled = false;

  value: number | string = 0;

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

    if ( this.value === '' ) {
      this.value = 0;
    }

    this.onChange(this.value);
    this.onTouched();
  }
}
