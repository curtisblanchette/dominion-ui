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
import { selectLookupByKeyAndId } from '../../../../store/app.reducer';

export interface IDropDownMenu {
  type: string;
  title?: string;
  items: (IDropDownMenuItemAnchor[] | IDropDownMenuItem[] | DropdownItem[]);
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
  public value: string | number | boolean | undefined;
  public perPage: number = 10;
  public page: number = 1;
  public totalRecords: number;
  public currentIndex: number = -1;

  public apiData:Array<any>;

  public moduleTypes: any;
  public lookupTypes: any;

  @Input('items') items$: Observable<(IDropDownMenuItemAnchor | IDropDownMenuItem | DropdownItem)[]> = of([]);
  @Input('position') position: string = 'top-right';
  @Input('title') title!: string | number | boolean | undefined;
  @Input('id') id!: string;
  @Input('default') default: string | number | boolean | undefined;
  @Input('disabled') disabled: boolean = false;

  @Input('type') dropdownType!: 'anchor' | 'button' | 'search';
  @Input('module') moduleName: ModuleTypes | LookupTypes;

  @Output('onClick') onClick: EventEmitter<any> = new EventEmitter();
  @Output('getValues') getValues: EventEmitter<any> = new EventEmitter();

  @HostBinding('class.has-label')
  @Input('label') public label: string | undefined;

  @HostListener('click', ['$event'])
  clickInside($event: any) {
    $event.stopPropagation();
    if ($event.target.id !== 'search-dropdown') { // This is to enter input search params
      if(!this.disabled){
        this.toggle();
      }
    }
  }

  @HostListener('document:click')
  clickOutside() {
    this.showDropDowns = false;
  }

  onChange: (value: string | number | boolean | DropdownItem | undefined) => void = () => {};
  onTouched: Function = () => {};

  @ViewChild('dropdownList') dropdownList: ElementRef;

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
    // this.getData();
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
      let data:any = {};

      // figure out if it's an entity or a lookup
      if(this.isEntity()) {
        const params = new HttpParams({fromObject: {q: value, limit: this.perPage, page: this.page}});
        data = await firstValueFrom(this.http.get(`${environment.dominion_api_url}/${uriOverrides[this.moduleName]}`, {params}).pipe(map((res: any) => !!res.rows ? res.rows : res)));
        data = data.map((item: any) => {
          return {
            label: item.name ? item.name : item.fullName,
            id: item.id
          } as DropdownItem;
        });
      }

      if(this.isLookup()) {
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
    if (value && this.moduleName) {
      this.value = value;
      let data:any;

      // have to get the initial value from api or store
      // because we haven't loaded any data into the component yet

      if(this.isEntity()){
        data = await firstValueFrom(this.http.get(`${environment.dominion_api_url}/${uriOverrides[this.moduleName]}/${this.value}`));
        this.title = data.name ? data.name : data.fullName;
      }

      if(this.isLookup()) {
        data = await firstValueFrom(this.store.select(fromApp.selectLookupByKeyAndId(this.moduleName, value)));
        if(data?.label) {
          this.title = data?.label ? data?.label : data?.id;
        }
      }

      if (data) {
        this.apiData = data;
      }
    } else {
      this.value = value;
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

  public setTheValue(value: DropdownItem) {
    this.onChange(value.id);
    this.onTouched();
    this.title = value.label;
    if( this.apiData ){
      const find = this.apiData.find( c => c.id === value.id );
      this.getValues.emit(find);
    } else {
      this.getValues.emit(value);
    }
    // else {
    //   const find = [...this.items$].find( (c: any) => c.id === id);
    //   this.getValues.emit(find);
    // }
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
    if (!this.showDropDowns) {
      return;
    }

    if (event.code === 'ArrowUp') {
      if (this.currentIndex < 0) {
        this.currentIndex = 0;
      } else if (this.currentIndex > 0) {
        this.currentIndex--;
      }
      this.dropdownList.nativeElement.querySelectorAll('fiiz-button button').item(this.currentIndex).focus();
      this.setSelectedItem(this.currentIndex);
    } else if (event.code === 'ArrowDown') {
      // if (this.currentIndex < 0) {
      //   this.currentIndex = 0;
      // } else if (this.currentIndex < this.items$.length - 1) {
      //   this.currentIndex++;
      // }
      // this.dropdownList.nativeElement.querySelectorAll('fiiz-button button').item(this.currentIndex).focus();
      // this.setSelectedItem(this.currentIndex);
    } else if ((event.code === 'Enter' || event.code === 'NumpadEnter') && this.currentIndex >= 0) {
      this.showDropDowns = false;
    } else if (event.code === 'Escape') {
      this.showDropDowns = false;
    }
  }

  public setSelectedItem(index: number) {
    // const selectedItem = this.items[index] as DropdownItem;
    // this.setTheValue(selectedItem.label, selectedItem.id);
  }

}
