import { AfterViewInit, Component, ElementRef, forwardRef, HostBinding, Input, Renderer2, ViewChild } from '@angular/core';
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
export class FiizTextAreaComponent implements ControlValueAccessor, AfterViewInit {

  @Input('label') public label: string | undefined;
  @Input('id') id!: string;
  @Input('autofocus') autofocus = false;
  @Input('placeholder') placeholder = '';
  @ViewChild('textarea', { read: ElementRef }) textarea:ElementRef;

  @Input('height') height = '35px';

  onChange:any;
  onTouched:any;

  constructor(private renderer: Renderer2) {}

  public ngAfterViewInit() {

  }

  writeValue(value: any): void {
    if(this.textarea?.nativeElement) {
      const div = this.textarea.nativeElement;
      this.renderer.setProperty(div, 'textContent', value);
    }

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

  change($event:any) {
    this.onChange($event.target.value);
    this.onTouched($event.target.value);
  }

}
