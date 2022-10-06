import { Component, Input, Output, EventEmitter, OnInit, HostListener, ElementRef, forwardRef, HostBinding, ViewChild, AfterViewInit } from '@angular/core';
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

export interface IDropDownMenuItemAnchor {
  id?: string | number;
  label: string;
  icon?: string;
  path: string;
}

export interface IDropDownMenuItem {
  id?: string | number;
  label: string;
  icon: string;
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
export class FiizDropDownComponent extends EntityCollectionComponentBase implements ControlValueAccessor, AfterViewInit, OnInit {

  public searchForm: FormGroup;
  public showDropDowns: boolean = false;
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
  @Input('position') position: string = 'top-right';
  @Input('title') title!: string | number | boolean | undefined;
  @Input('id') id!: string;
  @Input('default') default: string | number | boolean | undefined;
  @Input('mandatory') mandatory: boolean | undefined = true;
  @Input('disabled') disabled: boolean = false;
  @Input('multiselect') multiselect: boolean = false;

  @Input('type') dropdownType!: 'anchor' | 'button' | 'search';
  @Input('module') moduleName: ModuleTypes | LookupTypes;

  @Output('onClick') onClick: EventEmitter<any> = new EventEmitter();
  @Output('getValues') getValues: EventEmitter<any> = new EventEmitter();

  @HostBinding('class.has-label')
  @Input('label') public label: string | undefined;

  @HostBinding('attr.size')
  @Input('size') public size: ButtonSizes;

  @HostListener('click', ['$event'])
  clickInside($event: any) {
    $event.stopPropagation();
    if ($event.target.id !== 'search-dropdown') { // This is to enter input search params
      if (!this.disabled || !this.multiselect) {
        this.toggle();
      }
    }
  }

  @HostListener('document:click', ['$event'])
  clickOutside($event: any) {
    $event.stopPropagation();
    console.log($event.target.id);
    this.showDropDowns = false;
  }

  onChange: (value: string | number | boolean | any[] | DropdownItem | DropdownItem[] | undefined | null) => void = () => {};
  onTouched: Function = () => {};

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

  public async ngAfterViewInit() {
    // TODO remove the need for this.apiData. observable streams can filter the results automatically while keeping the source intact.
    // keeps the source data updated, filtering mutates this.items$
    this.items$.pipe(untilDestroyed(this), map(items => {
      this.apiData = items;
    })).subscribe();


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

  public async getData(value: string = '') {
    if (this.moduleName) {
      this.currentIndex = -1;
      let data: any = {};

      // figure out if it's an entity or a lookup
      if (this.isEntity()) {
        const params = new HttpParams({fromObject: {q: value, limit: this.perPage, page: this.page}});
        data = await firstValueFrom(this.http.get(`${environment.dominion_api_url}/${uriOverrides[this.moduleName]}`, {params}).pipe(map((res: any) => !!res.rows ? res.rows : res)));
        this.apiData = data;
        data = data.map((item: any) => {
          return {
            label: item.name ? item.name : item.fullName,
            id: item.id,
            checked: false
          } as DropdownItem;
        });
      }

      if (this.isLookup()) {
        data = await firstValueFrom(
          this.store.select(fromApp.selectLookupByKey(this.moduleName))
            .pipe(
              map((items: any) => {
                return items.filter((item: DropdownItem) => item.label.toLowerCase().includes(value.toLowerCase()));
              })
            )
        )
      }

      if (data) {
        this.totalRecords = data.count || 0;
        this.items$ = of(data);
      }
    } else {
      const data = this.apiData.filter(item => item.label.toLowerCase().includes(value.toLowerCase()));
      if (data) {
        this.totalRecords = data.length || 0;
        this.items$ = of(data);
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
        if(!this.multiselect) {
          data = await firstValueFrom(this.http.get(`${environment.dominion_api_url}/${uriOverrides[this.moduleName]}/${this.value}`));
          this.title = data.name ? data.name : data.fullName;
        } else {
          if(this.values) {
            data = await firstValueFrom(this.http.get(`${environment.dominion_api_url}/${uriOverrides[this.moduleName]}?id=${this.values.join(',')}`).pipe(map((res:any) => res.rows)));
            this.title = data.map((x: any) => x.name).join(', ');
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

  public isPreselected(value: any): boolean {
    if(!this.values) {
      return false;
    }
    return !!this.values.find(x => x === value);
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

  public async setTheValue(value: string) {
    // check if it's already selected
    const found = this.values?.find((id) => id === value);
    if(found) {
      this.values = this.values.filter((id) => id !== value);
    } else {
      this.values.push(value);
    }

    if( !value ){
      this.onChange(value);
      this.title = '--None--';
    } else {

      this.onTouched();
      this.title = (await firstValueFrom(this.items$.pipe(map(items => items.find(x => x.id === value)))))?.label;
      if (this.apiData?.length) {
        if(this.multiselect) {
          this.getValues.emit(this.values);
          return this.onChange(this.values);
        } else {
          const find = this.apiData.find( c => c.id === value );
          this.getValues.emit(find);
        }
      }
      this.onChange(value);
    }
  }

  // only used for dropdown anchors/links
  public emitTheValue(value: any) {
    this.onClick.emit(value as string);
  }

  public toggle() {
    this.showDropDowns = this.multiselect ? true : !this.showDropDowns;

    if (this.showDropDowns) {
      this.getData();
    }

  }

  public getDisplayValue() {
    return this.title;
  }

  public async navigationByKeys(event: KeyboardEvent) {
    if (!this.showDropDowns) {
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
      this.setSelectedItem(this.currentIndex);
    } else if (event.code === 'ArrowDown') {
      if (this.currentIndex < 0) {
        this.currentIndex = 0;
      } else if (this.currentIndex < (await firstValueFrom(this.items$)).length - 1) {
        this.currentIndex++;
      }
      this.dropdownList.nativeElement.querySelectorAll('fiiz-button button').item(this.currentIndex).focus();
      this.setSelectedItem(this.currentIndex);
    } else if ((event.code === 'Enter' || event.code === 'NumpadEnter') && this.currentIndex >= 0) {
      this.dropdownList.nativeElement.querySelectorAll('fiiz-button button').item(this.currentIndex).focus();
      this.setSelectedItem(this.currentIndex);
    } else if (event.code === 'Escape') {
      this.showDropDowns = false;
    }
  }

  public setSelectedItem(index: number) {
    // const selectedItem = this.items[index] as DropdownItem;
    // this.setTheValue(selectedItem.label, selectedItem.id);
  }

}
