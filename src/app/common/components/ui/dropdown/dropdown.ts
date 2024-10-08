import { Component, Input, Output, EventEmitter, OnInit, HostListener, ElementRef, forwardRef, HostBinding, ViewChild, AfterViewInit, AfterContentInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom, Observable, of } from 'rxjs';
import { DefaultDataServiceFactory, EntityCollectionServiceFactory } from '@ngrx/data';
import { ControlValueAccessor, FormBuilder, FormControl, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';

import { DropDownAnimation } from './dropdown.animations';
import { DropdownItem } from '../../interfaces/dropdownitem.interface';
import { EntityCollectionComponentBase } from '../../../../data/entity-collection.component.base';
import { environment } from '../../../../../environments/environment';
import { LookupTypes, ModuleTypes, uriOverrides } from '../../../../data/entity-metadata';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import * as fromApp from '../../../../store/app.reducer';
import { ButtonSizes } from '../../../directives/buttonSize.directive';

export interface IDropDownMenu {
  type: string;
  title?: string;
  items: (IDropDownMenuItemAnchor[] | IDropDownMenuItem[] | DropdownItem[]);
  position?: string;
}

export interface IDropDownMenuBase {
  id?: string | number;
  checked?: boolean;
  label: string;
  icon?: string;
  disabled?: boolean;
}

export interface IDropDownMenuItemAnchor extends IDropDownMenuBase{
  path: string;
}

export interface IDropDownMenuItem extends IDropDownMenuBase {
  emitterValue: string;
}

@UntilDestroy()
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
export class FiizDropDownComponent extends EntityCollectionComponentBase implements ControlValueAccessor, AfterViewInit, AfterContentInit, OnInit {

  public searchForm: FormGroup;
  public isOpen: boolean = false;
  public value: string | number | boolean | string[] | number[] | undefined;
  public values: string[] = [];
  public perPage: number = 10;
  public page: number = 1;
  public totalRecords: number;
  public currentIndex: number = -1;

  public apiData: Array<any>;

  public moduleTypes: any;
  public lookupTypes: any;

  @Input('items') items$: Observable<(IDropDownMenuItemAnchor | IDropDownMenuItem | DropdownItem)[]> = of([]);
  @Input('position') position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' = 'bottom-right';
  @Input('title') title!: string | number | boolean | undefined;
  @Input('id') id!: string;
  @Input('default') default: string | number | boolean | undefined;
  @Input('mandatory') mandatory: boolean | undefined = true;
  @Input('required') required: boolean = false;
  @Input('disabled') disabled: boolean = false;
  @Input('multiselect') multiselect: boolean = false;
  @Input('autofocus') autofocus = false;

  @Input('type') dropdownType: 'anchor' | 'button' | 'search' | 'basic' = 'basic';
  @Input('module') moduleName: ModuleTypes | LookupTypes;

  @Output('onClick') onClick: EventEmitter<any> = new EventEmitter();
  @Output('getValues') getValues: EventEmitter<any> = new EventEmitter();

  @HostBinding('class.has-label')
  @Input('label') public label: string | undefined;

  @HostBinding('attr.size')
  @Input('size') public size: ButtonSizes;

  @HostBinding('attr.data-qa') qaAttribute: string;

  @HostListener('click', ['$event'])
  clickInside($event: any) {
    // check the event target
    if (!($event.currentTarget.classList.contains('search')) || !$event.target.parentElement.classList.contains('multiselect-item')) { // This is to enter input search params

      const elements = document.getElementsByClassName('dropdown-menu');
      if (elements.length > 0) {
        for (let element of elements) {
          element.remove();
        }
      }
      this.isOpen = !this.isOpen;

      if (this.isOpen && !this.apiData) {
        this.getData();
      }
      $event.stopPropagation();
    }
  }

  // ensures all dropdowns close when clicking outside.
  @HostListener('document:click', ['$event'])
  clickOutside($event: any) {
    $event.stopPropagation();
    this.isOpen = false;
  }

  onChange: (value: string | number | boolean | any[] | DropdownItem | DropdownItem[] | undefined | null) => void = () => {
  };
  onTouched: Function = () => {
  };

  @ViewChild('dropdownList') dropdownList: ElementRef;
  @ViewChild('searchInput') searchInput: ElementRef;

  constructor(
    private fb: FormBuilder,
    private store: Store<fromApp.AppState>,
    entityCollectionServiceFactory: EntityCollectionServiceFactory,
    dataServiceFactory: DefaultDataServiceFactory,
    router: Router,
    private http: HttpClient
  ) {
    super(router, entityCollectionServiceFactory, dataServiceFactory);

    let form: { [key: string]: FormControl } = {};
    form['search'] = new FormControl('');
    this.searchForm = this.fb.group(form);

    this.moduleTypes = ModuleTypes;
    this.lookupTypes = LookupTypes;
  }

  public ngOnInit() {
  }

  public override async ngAfterContentInit(): Promise<void> {
    super.ngAfterContentInit();
    this.qaAttribute = `dropdown:${this.id}`;
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
    this.navigationByKeys(event);
  }

  private isLookup() {
    const enumValues = Object.values(this.lookupTypes);
    return enumValues.includes(this.moduleName);
  }

  private isEntity() {
    const enumValues = Object.values(this.moduleTypes);
    return enumValues.includes(this.moduleName);
  }

  private applySelected(items: any[]) {
    return items.map((item: any) => {
      if(Object.isExtensible((item))) {
        item.checked = this.values.includes(item.id);
      }
      return item;
    });
  }

  public async getData(value: string = '') {
    let data: any = {};

    if (this.moduleName) {
      this.currentIndex = -1;

      // figure out if it's an entity or a lookup
      if (this.isEntity()) {
        const params = new HttpParams({fromObject: {q: value, limit: this.perPage, page: this.page}});
        data = await firstValueFrom(this.http.get(`${environment.dominion_api_url}/${uriOverrides[this.moduleName]}`, {params}).pipe(map((res: any) => !!res.rows ? res.rows : res)));
        this.apiData = data;
        data = data.map((item: any) => {
          return {
            label: item.name ? item.name : item.fullName,
            id: item.id,
            checked: this.values.includes(item.id)
          } as DropdownItem;
        });
        if (this.required && this.dropdownType == 'search') {
          data.unshift({label: '--None--', id: null, checked: false});
        }

      }

      if (this.isLookup()) {
        data = await firstValueFrom(
          this.store.select(fromApp.selectLookupsByKey(this.moduleName))
            .pipe(
              map((items: any) => {
                return items.filter((item: DropdownItem) => item.label.toLowerCase().includes(value.toLowerCase()));
              })
            )
        );
        if (!this.required && this.dropdownType == 'search') {
          data.unshift({label: '--None--', id: null, checked: false});
        }
      }

      if (data) {
        this.totalRecords = data.count || 0;
        // if( !this.required ){
        //   data = {...{}, ...data};
        // }
        this.items$ = of(data).pipe(map((items) => this.applySelected(items)));
      }
    } else {
      if (this.apiData) {
        data = this.apiData.filter(item => item.label.toLowerCase().includes(value.toLowerCase()));
        if (data) {
          this.totalRecords = data.length || 0;
          this.items$ = of(data).pipe(map((items) => this.applySelected(items)));
        }
      }
    }
  }

  async writeValue(value: any) {
    if (this.multiselect) {
      this.values = [...value]; // incoming value is data-bound to ngrx, must clone it or else it's not extensible.
    } else {
      this.value = value;
    }

    if (value && this.moduleName) {
      let data: any;

      // have to get the initial value from api or store
      // because we haven't loaded any data into the component yet
      if (this.isEntity()) {
        if (!this.multiselect) {
          data = await firstValueFrom(this.http.get(`${environment.dominion_api_url}/${uriOverrides[this.moduleName]}/${this.value}`));
          this.title = data.name ? data.name : data.fullName;
        } else {
          if (this.values) {
            data = await firstValueFrom(this.http.get(`${environment.dominion_api_url}/${uriOverrides[this.moduleName]}?id=${this.values.join(',')}`).pipe(map((res: any) => res.rows)));
            this.title = data.filter((c: any) => this.values.includes(c.id)).map((x: any) => x.name).join(', ');
          }
        }
      }
      if (this.isLookup()) {
        data = await firstValueFrom(this.store.select(fromApp.selectLookupByKeyAndId(this.moduleName, value)));
        if (data?.label) {
          this.title = data?.label ? data?.label : data?.id;
        }
      }
    } else {
      // the data source was statically provided (aka. its not a module or lookup)
      const data = [...(await firstValueFrom(this.items$))].find((item: any) => item.id === value) as any;
      this.title = data?.label ? data?.label : this.title;
    }
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

  public async setTheValue($event:any = {}, item: DropdownItem | null) {

    if(this.multiselect) {
      $event.stopPropagation();
    }

    if (!item?.label) {
      this.title = '--None--';
    } else {

      this.onTouched();
      if (this.multiselect) {
        // check if it's already selected
        const found = this.values?.find((id) => id === item.id);
        if (found) {
          // remove it from values
          this.values = this.values.filter((id) => id !== item.id);
        } else {
          // add to values
          this.values.push(item.id as string);
        }
        this.title = (await firstValueFrom(this.items$.pipe(map(items => items.filter((x: any) => this.values.includes(x.id))))))?.map(x => x.label).join(', ');
        if (this.apiData?.length) {
          this.getValues.emit(this.values);
          return this.onChange(this.values);
        }
      } else {
        this.title = item.label;
        this.getValues.emit(item.id);
        this.value = item.id as string;
      }
    }
    return this.onChange(this.value);
  }

  // only used for dropdown anchors/links
  public emitTheValue(value: any) {
    this.onClick.emit(value as string);
  }

  public getDisplayValue() {
    return this.title;
  }

  public async navigationByKeys(event: KeyboardEvent) {
    if (!this.isOpen) {
      return;
    }

    if (event.code === 'ArrowUp') {
      if (this.currentIndex < 0) {
        this.currentIndex = 0;
        // focus on the search
        this.searchInput.nativeElement.focus();
      } else if (this.currentIndex > 0) {
        this.currentIndex--;
      }
      this.dropdownList.nativeElement.querySelectorAll('fiiz-button button').item(this.currentIndex).focus();
    } else if (event.code === 'ArrowDown') {
      if (this.currentIndex < 0) {
        this.currentIndex = 0;
      } else if (this.currentIndex < (await firstValueFrom(this.items$)).length - 1) {
        this.currentIndex++;
      }
      this.dropdownList.nativeElement.querySelectorAll('fiiz-button button').item(this.currentIndex).focus();
    } else if ((event.code === 'Enter' || event.code === 'NumpadEnter') && this.currentIndex >= 0) {
      this.dropdownList.nativeElement.querySelectorAll('fiiz-button button').item(this.currentIndex).focus();
    } else if (event.code === 'Escape') {
      this.isOpen = false;
    }
  }


}
