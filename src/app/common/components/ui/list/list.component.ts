import { Component, ElementRef, AfterViewInit, ViewChild, OnDestroy, Input, Output, ViewChildren, QueryList, EventEmitter, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { fromEvent, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { FlowService } from '../../../../modules/flow/flow.service';
import { Contact, Deal, Event, Lead } from '@4iiz/corev2';
import * as pluralize from 'pluralize';
import { EntityCollectionServiceFactory} from '@ngrx/data';
import { EntityCollectionComponentBase } from '../../../../data/entity-collection.component.base';
import { IDropDownMenuItem } from '../dropdown';

export interface IListOptions {
  searchable: boolean;
  editable: boolean;
  perPage: number;
  columns: string[];
}

@Component({
  selector: 'fiiz-list',
  templateUrl: 'list.component.html',
  styleUrls: ['list.component.scss']
})
export class FiizListComponent extends EntityCollectionComponentBase implements OnInit, OnDestroy, AfterViewInit {

  public searchForm: FormGroup;

  // Pagination
  public page: number = 1;
  public offset: number = 0;
  public totalRecords: number = 0;
  public selected: Lead | Contact | Event | Deal | null;

  @ViewChildren('row') rows: QueryList<ElementRef>;

  @Input('options') options: IListOptions = { searchable: true, editable: false, perPage: 10, columns: [] };
  @Input('loadInitial') loadInitial: boolean = false;
  @Output('values') values: EventEmitter<any> = new EventEmitter();
  @Output('btnValue') btnValue:EventEmitter<any> = new EventEmitter();

  public actionItems: IDropDownMenuItem[] = [
    {
      label: 'Delete',
      icon: 'fa-solid fa-trash',
      emitterValue : 'object'
    },
    {
      label: 'Something',
      icon: 'fa-brands fa-500px',
      emitterValue : 'so-something'
    }
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private entityCollectionServiceFactory: EntityCollectionServiceFactory,
    public flowService: FlowService
  ) {
    super(router, entityCollectionServiceFactory);
    if (this.data$) {
      this.data$.subscribe((res: Lead[]) => {
        if (!this.loading$ && this.loaded$ && res.length === 0) {
          // we only want to query if the cache doesn't return a record
        }
      });
    }

    let form: { [key: string]: FormControl } = {};
    form['search'] = new FormControl('');
    this.searchForm = this.fb.group(form);

  }

  public onClick($event: any, record: any) {
    $event.preventDefault();

    if (this.selected?.id === record.id) {
      this.values.emit( { 'module' : this.module, 'record' : record });
      this.selected = null;
      return;
    }

    this.selected = record;
    console.log('this.selected',this.selected);
    this.values.emit( { 'module' : this.module, 'record' : record });
  }

  public onFocusOut($event: any) {
    $event.preventDefault();
    this.values.emit( { 'module' : this.module, 'record' : null });
    this.selected = null;
  }

  public onFocusIn($event: any, record: any) {
    $event.preventDefault();
    this.selected = record;
    this.values.emit( { 'module' : this.module, 'record' : record} );
  }

  public ngOnDestroy() {
    console.log(`[${this.module}] List Component Destroyed`);
  }

  public ngOnInit(){
    const pattern = { q : '' };
    this._dynamicService.setFilter(pattern);
    this._dynamicService.getWithQuery(pattern);
  }

  get pluralModuleName() {
    if (this.state?.module) {
      return pluralize(this.state.module);
    }

    return '';
  }

  public ngAfterViewInit() {
    // @ts-ignore
    this.searchForm.get('search').valueChanges.pipe(
      map(action => {
        console.log(action)
        return action;
      }),
      debounceTime(250),
      distinctUntilChanged()
    ).subscribe((text: string) => {
      this.searchInModule();
    });
  }


  public async searchInModule() {
    if (this.searchForm.valid) {
      const formValues = this.searchForm.value;
      const pattern = { q: formValues.search.toLowerCase() };
      this._dynamicService.setFilter(pattern); // this modifies filteredEntities$ subset
      this._dynamicService.getWithQuery(pattern); // this performs an API call
      await this.udpatePaginationParams();
    } else {
      console.warn('Form not valid');
      return of([]);
    }
  }

  public async udpatePaginationParams(){
    if (this.data$) {
      this.data$.subscribe((res: Lead[]) => {
        this.totalRecords = res.length;
      });
    }
  }

  public performAction( value:any ){
    console.log('value to emit', value);
    this.btnValue.emit(value);
  }

  public handlePageChange(pageNo: number) {
    this.page = pageNo;
    this.offset = this.options.perPage * (this.page - 1);
  }


}
