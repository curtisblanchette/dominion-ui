import { AfterViewInit, Component, ElementRef, forwardRef, HostBinding, Input, OnInit, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import intlTelInput from 'intl-tel-input';

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
export class FiizInputComponent implements ControlValueAccessor, OnInit, AfterViewInit {

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
  @Input('required') required:boolean = false;

  @Input('disabled') disabled = false;

  @Input('autofocus') autofocus = false;

  @ViewChild('inputElement', { read: ElementRef }) inputElement: ElementRef;
  @ViewChild('imgPreview') imgPreview: ElementRef;

  @HostBinding('attr.disabled')
  isDisabled = false;

  @HostBinding('attr.data-qa') qaAttribute: string;

  value: number | string | any;

  intlTelInput?: any;

  onChange: (value: any) => void = () => {};
  onTouched: Function = () => {};

  constructor(

  ) {

  }

  public ngOnInit() {
    this.qaAttribute = 'input:' + this.id;
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

  private showPreview($event: any) {
      const file = $event.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.imgPreview.nativeElement.src = reader.result;
      }
      reader.readAsDataURL(file);
  }

  changed($event:any) {

    if(this.type === 'file') {
      // this.showPreview($event);
      console.log($event)
    }

    this.value =  $event;

    if(this.intlTelInput) {
      this.intlTelInput.setNumber(this.value.toString());
      this.onChange(this.phoneNumber);
    } else {
      if(this.type === 'number') {
        this.value = parseInt(<string>this.value, 0);
      }
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
