import { Component, forwardRef, HostBinding, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'fiiz-input',
  templateUrl: './input.html',
  styleUrls: ['./input.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => FiizInputComponent),
    multi: true
  }]
})
export class FiizInputComponent implements ControlValueAccessor {

  @HostBinding('class.has-label')
  @Input('label') public label: string | undefined;
  @Input('icon') icon: string | undefined;
  @Input('id') id!: string;
  @Input('type') type!: string;
  @Input('minlength') minlength!: string;
  @Input('maxlength') maxlength!: string;
  @Input('placeholder') placeholder = '';

  @Input('max') max = null;
  @Input('min') min = null;

  @Input('disabled') disabled = false;

  @Input('autofocus') autofocus = false;
  // @HostBinding('attr.disabled')
  // isDisabled = false;

  value: number | string = 0;

  onChange: (value: any) => void = () => {};
  onTouched: Function = () => {};

  constructor(

  ) {

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
    this.disabled = disabled;
  }

  changed($event:any) {
    this.value = $event;

    this.onChange(this.value);
    this.onTouched();
  }
}
