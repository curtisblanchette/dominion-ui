import { AfterViewInit, Component, ElementRef, forwardRef, HostBinding, Input, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Observable, of } from 'rxjs';

export interface RadioItem {
  id: number | string | boolean;
  label: string;
  checked?: boolean;
  disabled?: boolean;
}

@Component({
  selector: 'fiiz-radio',
  templateUrl: './radio.html',
  styleUrls: ['./radio.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => FiizRadioComponent),
    multi: true
  }]
})
export class FiizRadioComponent implements ControlValueAccessor, AfterViewInit {

  @HostBinding('class.has-label')
  @Input('label') public label: string | undefined;
  @Input('icon') icon: string | undefined;
  @Input('id') id!: string;
  @Input('name') name = '';
  @Input('placeholder') placeholder = '';

  @Input('items') items$: Observable<RadioItem[]> = of([]);

  @Input('disabled') disabled = false;

  @Input('autofocus') autofocus = false;

  @ViewChild('inputElement', { read: ElementRef }) inputElement: ElementRef;

  // @HostBinding('attr.disabled')
  // isDisabled = false;

  value: number | string = 0;

  onChange: (value: any) => void = () => {};
  onTouched: Function = () => {};

  constructor(

  ) {


  }

  public ngAfterViewInit() {
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
    this.value = $event.target.value;
    this.onChange(this.value);
    this.onTouched();
  }

}
