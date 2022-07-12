import { AfterViewInit, Component, ElementRef, forwardRef, HostBinding, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import * as intlTelInput from 'intl-tel-input';
import { BehaviorSubject, Subject } from 'rxjs';

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
export class FiizInputComponent implements ControlValueAccessor, AfterViewInit {

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

  @ViewChild('inputElement', { read: ElementRef }) inputElement: ElementRef;

  // @HostBinding('attr.disabled')
  // isDisabled = false;

  value: number | string;

  intlTelInput?: any;

  onChange: (value: any) => void = () => {};
  onTouched: Function = () => {};

  constructor(

  ) {


  }

  public ngAfterViewInit() {
    if(this.type === 'tel') {
      this.inputElement.nativeElement.setAttribute('type', 'tel');
      this.inputElement.nativeElement.setAttribute('pattern', '^[- +()]*[0-9][- +()0-9]*$');

      this.intlTelInput = intlTelInput(this.inputElement.nativeElement, {
        // any initialization options go here
        utilsScript: 'https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.13/js/utils.js',
        preferredCountries: ['US', 'MX', 'CA']
      });
    }
  }


  writeValue(value: number) {
    if(this.intlTelInput && value) {
      this.intlTelInput.setNumber(value.toString());
    } else {
      this.value = value;
    }
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
    this.value =  $event;

    if(this.intlTelInput) {
      this.intlTelInput.setNumber(this.value.toString());
      this.onChange(this.phoneNumber);
    } else {
      this.onChange(this.value);
    }

    this.onTouched();
  }

  get phoneNumber() {
    if (this.intlTelInput && this.intlTelInput.getNumber()) {
      return this.intlTelInput.getNumber();
    } else {
      return '';
    }
  }
}
