import { Component, forwardRef, HostBinding, Input, OnInit } from '@angular/core';
import { AfterViewInit, Component, forwardRef, HostBinding, Input, OnInit, HostListener } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { firstValueFrom, Observable } from 'rxjs';
import { Observable } from 'rxjs';
import { DropDownButtonAnimation } from '../../dropdown-button/dropdown.animations';

export interface DropdownItem {
  id: number | string | boolean;
  label: string;
  disabled?: boolean;
}

@Component({
  selector: 'fiiz-select',
  templateUrl: './select.html',
  styleUrls: ['./select.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => FiizSelectComponent),
    multi: true
  }],
  animations : [
    DropDownButtonAnimation
  ]
})
export class FiizSelectComponent implements ControlValueAccessor, OnInit {

  @Input('items') items$: Observable<DropdownItem[]>;
  @Input('label') public label: string | number | boolean | undefined;
  @Input('id') id!: string;
  @Input('size') size!: 'small' | 'large';
  @Input('default') default:string | number | boolean;
  @Input('autofocus') autofocus = false;
  @Input('position') position:string = 'bottom-right';

  @HostBinding('attr.disabled')
  isDisabled = false;

  @HostListener('click', ['$event'])
  clickInside($event: Event) {
    $event.stopPropagation();
    this.toggle();
  }

  @HostListener('document:click')
  clickOutside() {
    this.showDropDowns = false;
  }

  public showDropDowns:boolean = false;

  onChange: (value: DropdownItem) => void = () => {};
  onTouched: Function = () => {};

  constructor(
  ) {
  }

  async ngOnInit() {
    if( this.default ){
      this.label = this.default;
    }
  }

  public toggle() {
    this.showDropDowns = !this.showDropDowns;
  }

  public setFormValue( item:DropdownItem, index:number, event:any){
    this.label = item.label;
    this.default = item.id;
  }

  async ngAfterViewInit() {}

  writeValue(value: DropdownItem) {

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

  async changed($event:any) {
    this.selected = await firstValueFrom(this.items$).then(items => items.find(item => item.id == $event.target.value));
    this.onChange(this.selected);
    this.onTouched();
  }
}
