import { Component, forwardRef, HostBinding, Input, OnInit, HostListener } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { firstValueFrom, Observable, of } from 'rxjs';
import { DefaultDataServiceFactory, EntityCollectionServiceFactory } from '@ngrx/data';
import { EntityCollectionComponentBase } from '../../../../../data/entity-collection.component.base';
import { ModuleType } from '../../../../../modules/flow/_core';
import { Router } from '@angular/router';
import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';

export interface DropdownItem {
  id: number | string | boolean;
  label: string;
  disabled?: boolean;
}

@UntilDestroy()
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
export class FiizSelectComponent extends EntityCollectionComponentBase implements ControlValueAccessor, OnInit {
  public selected!: any;

  @Input('items') items$: Observable<DropdownItem[]> = of([]);

  @HostBinding('class.has-label')
  @Input('label') public label: string | number | boolean | undefined;

  @Input('id') id!: string;
  @Input('size') size!: 'small' | 'large';
  @Input('default') default: string | number | boolean | undefined;
  @Input('autofocus') autofocus = false;
  @Input('position') position:string = 'bottom-right';
  @Input('showDefault') showDefault!: boolean;
  @Input('module') override module: ModuleType;
  @Input('remote') remote: boolean = false;

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

    if(this.remote) {
      const service = this.createService(this.module, entityCollectionServiceFactory);
      service.load();
      this.items$ = service.filteredEntities$ as any;
    }
  }

  async ngOnInit() {
    if( this.default ){
      this.label = this.default;
    }

    this.items$.pipe(untilDestroyed(this)).subscribe(items => {
      this.selected = items[0];
    });


  }

  public toggle() {
    this.showDropDowns = !this.showDropDowns;
  }

  public setFormValue( item:DropdownItem, index:number, event:any){
    this.label = item.label;
    this.default = item.id;
  }

  async ngAfterViewInit() {

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
