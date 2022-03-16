import { Component, forwardRef, HostBinding, Input, Renderer2, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'fiiz-textarea',
  templateUrl: './textarea.html',
  styleUrls: ['./textarea.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => FiizTextAreaComponent),
    multi: true
  }]
})
export class FiizTextAreaComponent implements ControlValueAccessor {
  @Input('autofocus') autofocus = false;
  @Input('placeholder') placeholder = '';
  @ViewChild('textarea') textarea:any;

  @Input('height') height = '35px';

  onChange:any;
  onTouched:any;

  writeValue(value: any): void {
    const div = this.textarea.nativeElement;
    this.renderer.setProperty(div, 'textContent', value);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    const div = this.textarea.nativeElement;
    const action = isDisabled ? 'addClass' : 'removeClass';
    this.renderer[action](div, 'disabled');
  }

  constructor(private renderer: Renderer2) {
  }

  change($event:any) {
    this.onChange($event.target.value);
    this.onTouched($event.target.value);
  }

}
