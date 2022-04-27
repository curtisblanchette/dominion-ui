import { AfterViewInit, Component, forwardRef, HostBinding, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { first, firstValueFrom, Observable } from 'rxjs';

export interface DropdownItem {
  id: number | string | boolean;
  label: string;
  disabled?: boolean;
}

@Component({
  selector: 'fiiz-dropdown',
  templateUrl: './dropdown.html',
  styleUrls: ['./dropdown.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => FiizDropdownComponent),
    multi: true
  }]
})
export class FiizDropdownComponent implements ControlValueAccessor, OnInit, AfterViewInit {

  @Input('items') items$: Observable<DropdownItem[]>;
  @Input('label') public label: string | undefined;
  @Input('id') id!: string;
  @Input('size') size!: 'small' | 'large';
  @Input('showDefault') showDefault = false;
  @Input('autofocus') autofocus = false;

  @HostBinding('attr.disabled')
  isDisabled = false;

  // selected!: DropdownItem;
  selected!: any;

  onChange: (value: DropdownItem) => void = () => {};
  onTouched: Function = () => {};

  constructor(
  ) {
  }

  async ngOnInit() {

  }

  async ngAfterViewInit() {
    // auto-select the first value
    const selected = await firstValueFrom(this.items$.pipe(first(items => !!items.length)));
    this.selected = selected[0];
  }

  writeValue(value: DropdownItem) {
    this.selected = value;
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
    this.selected = firstValueFrom(this.items$).then(items => items.find(item => item.id === $event.target.value));
    this.onChange(this.selected);
    this.onTouched();
  }
}
