import { Component, ElementRef, AfterViewInit, OnDestroy, Input, Output, ViewChildren, QueryList, EventEmitter, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { FlowService } from '../../../../modules/flow/flow.service';
import { Call, Contact, Deal, Event, Lead, User } from '@4iiz/corev2';
import * as pluralize from 'pluralize';
import { EntityCollectionServiceFactory, QueryParams } from '@ngrx/data';
import { EntityCollectionComponentBase } from '../../../../data/entity-collection.component.base';
import { IDropDownMenuItem } from '../dropdown';
import { models, DominionType, defaultListColumns } from '../../../models';

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
  public totalRecords: number = 50;
  public perPage:number = 5;
  public selected: Call | Lead | Contact | Deal | Event | User | null;
  public columns: { id: string; label: string; }[] = [];

  @ViewChildren('row') rows: QueryList<ElementRef>;

  @Input('options') options: IListOptions = { searchable: true, editable: false, perPage: this.perPage, columns: [] };
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

    if(!this.options) {
      this.options = this.state.options;
    }

    // set the default visible columns
    for(const [key, value] of Object.entries(models[this.module]) ) {
      if(defaultListColumns[this.module].includes(key)) {
        this.columns.push({id: key, label: (<any>value).label});
      }
    }

    if (this.data$) {
      this.data$.subscribe((res: Partial<DominionType>[]) => {
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
    this.getData();
  }

  get pluralModuleName() {
    if (this.state?.module) {
      return pluralize(this.state.module);
    }

    return '';
  }

  onCreateNew() {
    this.router.navigate(this.state.onCreate.route, this.state.onCreate.extras);
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
      await this.getData( formValues.search.toLowerCase() );
    } else {
      console.warn('Form not valid');
      return of([]);
    }
  }

  public async getData( searchkey:string = '' ){
    const params:QueryParams = {
      page : this.page.toString(),
      limit : this.perPage.toString()
    };

    if( searchkey ){
      params['q'] = searchkey;
    }

    this._dynamicService.setFilter(params); // this modifies filteredEntities$ subset
    this._dynamicService.getWithQuery(params); // this performs an API call
  }

  public performAction( value:any ){
    console.log('value to emit', value);
    this.btnValue.emit(value);
  }

  public handlePageChange(pageNo: number) {
    this.page = pageNo;
    this.getData();
  }


}
