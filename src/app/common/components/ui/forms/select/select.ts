import { Component, forwardRef, HostBinding, Input, OnInit, HostListener, AfterViewInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { firstValueFrom, Observable, of } from 'rxjs';
import { DefaultDataServiceFactory, EntityCollectionServiceFactory } from '@ngrx/data';
import { EntityCollectionComponentBase } from '../../../../../data/entity-collection.component.base';
import { Router } from '@angular/router';
import { ModuleTypes } from '../../../../../data/entity-metadata';

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
})
export class FiizSelectComponent extends EntityCollectionComponentBase implements ControlValueAccessor, OnInit, AfterViewInit {
  public selected!: any;

  @Input('items') items$: Observable<DropdownItem[]> = of([]);

  @HostBinding('class.has-label')
  @Input('label') public label: string | number | boolean | undefined;

  @Input('id') id!: string;
  @Input('module') override module: ModuleTypes;
  @Input('options') override options: { remote?: boolean };

  @Input('size') size!: 'small' | 'large';
  @Input('default') default: string | number | boolean | undefined;
  @Input('autofocus') autofocus = false;
  @Input('position') position:string = 'bottom-right';
  @Input('showDefault') showDefault!: boolean;


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
    router: Router,
    entityCollectionServiceFactory: EntityCollectionServiceFactory,
    dataServiceFactory: DefaultDataServiceFactory,
  ) {
    super(router, entityCollectionServiceFactory, dataServiceFactory);


  }

  public async ngAfterViewInit() {
    this.setContext(this);
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


  async writeValue(value: string) {
    this.selected = await firstValueFrom(this.items$).then(items => items.find(item => item.id == value));
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
    this.onChange(this.selected.id);
    this.onTouched();
  }
}
