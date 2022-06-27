import { Component, Input, Output, EventEmitter, OnInit, HostListener, ElementRef, forwardRef, HostBinding, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { DefaultDataServiceFactory, EntityCollectionServiceFactory } from '@ngrx/data';
import { ControlValueAccessor, FormBuilder, FormControl, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';

import { DropDownAnimation } from './dropdown.animations';
import { DropdownItem } from '../../interfaces/dropdownitem.interface';
import { EntityCollectionComponentBase } from '../../../../data/entity-collection.component.base';
import { environment } from '../../../../../environments/environment';
import { uriOverrides } from '../../../../data/entity-metadata';
import { untilDestroyed } from '@ngneat/until-destroy';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

export interface IDropDownMenu {
  type: string;
  title?: string;
  items: IDropDownMenuItemAnchor[] | IDropDownMenuItem[] | DropdownItem[];
  position?: string;
}

export interface IDropDownMenuItemAnchor {
  label: string;
  icon?: string;
  path: string;
}

export interface IDropDownMenuItem {
  label: string;
  icon: string;
  emitterValue: string;
}

@Component({
  selector: 'fiiz-dropdown',
  templateUrl: './dropdown.html',
  styleUrls: ['./dropdown.scss'],
  animations: [DropDownAnimation],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => FiizDropDownComponent),
    multi: true
  }],
  host: {
    '(document:keydown)': 'navigationByKeys($event)'
  }
})
export class FiizDropDownComponent extends EntityCollectionComponentBase implements ControlValueAccessor, AfterViewInit, OnInit {

  public searchForm: FormGroup;
  public showDropDowns: boolean = false;
  public value: string | number | boolean | undefined;
  public perPage: number = 10;
  public page: number = 1;
  public totalRecords: number;
  public currentIndex: number = -1;

  @Input('items') items: IDropDownMenuItemAnchor[] | IDropDownMenuItem[] | DropdownItem[];
  @Input('position') position: string = 'top-right';
  @Input('title') title!: string | number | boolean | undefined;
  @Input('id') id!: string;
  @Input('default') default: string | number | boolean | undefined;

  @Input('type') dropdownType!: 'anchor' | 'button' | 'search';
  @Input('module') moduleName: string | undefined;

  @Output('onClick') onClick: EventEmitter<any> = new EventEmitter();

  @HostBinding('class.has-label')
  @Input('label') public label: string | undefined;

  @HostListener('click', ['$event'])
  clickInside($event: any) {
    $event.stopPropagation();
    if ($event.target.id !== 'search-dropdown') { // This is to enter input search params
      this.toggle();
    }
  }

  @HostListener('document:click')
  clickOutside() {
    this.showDropDowns = false;
  }

  onChange: (value: string | number | boolean | undefined) => void = () => {};
  onTouched: Function = () => {};

  @ViewChild('dropdownList') dropdownList: ElementRef;

  constructor(
    private fb: FormBuilder,
    entityCollectionServiceFactory: EntityCollectionServiceFactory,
    dataServiceFactory: DefaultDataServiceFactory,
    router: Router,
    private http: HttpClient,
    private el: ElementRef
  ) {
    super(router, entityCollectionServiceFactory, dataServiceFactory);

    let form: { [key: string]: FormControl } = {};
    form['search'] = new FormControl('');
    this.searchForm = this.fb.group(form);
  }

  public ngOnInit() {
    // this.getData();
  }

  public async ngAfterViewInit() {
    // @ts-ignore
    this.searchForm.get('search').valueChanges.pipe(
      untilDestroyed(this),
      map(action => {
        return action;
      }),
      debounceTime(250),
      distinctUntilChanged()
    ).subscribe((value: string) => {
      this.page = 1;
      this.getData(value);
    });
  }

  public onKeyUpEvent(event: Event | KeyboardEvent | any) {
    // this.getData(event.target.value);
    this.navigationByKeys(event);
  }

  public async getData(value: string = '') {
    if (this.moduleName) {
      const params = new HttpParams({fromObject: {q: value, limit: this.perPage, page: this.page}});
      const data = await firstValueFrom(this.http.get(`${environment.dominion_api_url}/${uriOverrides[this.moduleName]}`, {params})) as any;
      if (data && data.rows) {
        this.totalRecords = data.count || 0;
        this.items = data.rows.map((item: any) => {
          return {
            label: item.name ? item.name : item.fullName,
            id: item.id
          } as DropdownItem;
        });
      }
    }
  }

  async writeValue(value: string) {
    if (value && this.moduleName) {
      this.value = value;
      const data = await firstValueFrom(this.http.get(`${environment.dominion_api_url}/${uriOverrides[this.moduleName]}/${this.value}`)) as any;
      if (data) {
        this.title = data.name ? data.name : data.fullName;
      }
    }
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

  public setTheValue(label: string, id: string | number | boolean) {
    this.onChange(id);
    this.onTouched();
    this.title = label;
  }

  public emitTheValue(value: string) {
    this.onClick.emit(value);
  }

  public toggle() {
    this.showDropDowns = !this.showDropDowns;

    if(this.showDropDowns) {
      this.getData();
    }

  }

  public navigationByKeys(event: KeyboardEvent) {
    if (this.showDropDowns) {
      // event.preventDefault();
    } else {
      return;
    }

    if (event.code === 'ArrowUp') {
      if (this.currentIndex < 0) {
        this.currentIndex = 0;
      } else if (this.currentIndex > 0) {
        this.currentIndex--;
      }
      this.dropdownList.nativeElement.querySelectorAll('li').item(this.currentIndex).focus();
      this.setSelectedItem(this.currentIndex);
    } else if (event.code === 'ArrowDown') {
      if (this.currentIndex < 0) {
        this.currentIndex = 0;
      } else if (this.currentIndex < this.items.length - 1) {
        this.currentIndex++;
      }
      this.dropdownList.nativeElement.querySelectorAll('li').item(this.currentIndex).focus();
      this.setSelectedItem(this.currentIndex);
    } else if ((event.code === 'Enter' || event.code === 'NumpadEnter') && this.currentIndex >= 0) {
      this.setSelectedItem(this.currentIndex);
      this.showDropDowns = false;
    } else if (event.code === 'Escape') {
      this.showDropDowns = false;
    }
  }

  public setSelectedItem(index: number) {
    const selectedItem = this.items[index] as DropdownItem;
    this.setTheValue(selectedItem.label, selectedItem.id);
  }

}
