import { Component, forwardRef, HostBinding, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'fiiz-toggle',
  templateUrl: './toggle.html',
  styleUrls: ['./toggle.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => FiizToggleComponent),
    multi: true
  }]
})
export class FiizToggleComponent implements ControlValueAccessor {

  @Input('label') public label: string | undefined;
  @Input('name') identifier!: string;
  @Input('placeholder') placeholder!: string;
  @Input('checked') checked!: boolean;

  @HostBinding('class.disabled')
  isDisabled = false;

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
    this.isDisabled = disabled;
  }

  changed($event:any) {
    this.value = $event;

    this.onChange(this.value);
    this.onTouched();
  }
}
