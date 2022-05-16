import { Component, ElementRef, AfterViewInit, OnDestroy, Input, Output, ViewChildren, QueryList, EventEmitter, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { of, Subject, takeUntil } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { FlowService } from '../../../../modules/flow/flow.service';
import { Call, Contact, Deal, Event, Lead, User } from '@4iiz/corev2';
import * as pluralize from 'pluralize';
import { DefaultDataServiceFactory, EntityCollectionServiceFactory, QueryParams } from '@ngrx/data';
import { EntityCollectionComponentBase } from '../../../../data/entity-collection.component.base';
import { IDropDownMenuItem } from '../dropdown';
import { models, defaultListColumns } from '../../../models';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../store/app.reducer';

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
  public destroyed$: Subject<any> = new Subject<any>();

  // Pagination
  public page: number = 1;
  public offset: number = 0;
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
    private dataServiceFactory: DefaultDataServiceFactory,
    public flowService: FlowService
  ) {
    super(router, entityCollectionServiceFactory, dataServiceFactory);

    if(!this.options) {
      this.options = this.state.options;
    }

    // set the default visible columns
    for(const [key, value] of Object.entries(models[this.module]) ) {
      if(defaultListColumns[this.module].includes(key)) {
        this.columns.push({id: key, label: (<any>value).label});
      }
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
    this.destroyed$.next(true);
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

    // this._dynamicCollectionService.setFilter(params); // this modifies filteredEntities$ subset
    /** Proxy to the underlying dataService to do some processing */
    this.getWithQuery(params).pipe(takeUntil(this.destroyed$)).subscribe(); // this performs an API call
  }

  public performAction( value:any ){
    console.log('value to emit', value);
    this.btnValue.emit(value);
  }

  public handlePageChange(pageNo: number) {
    this.page = pageNo;
    this.searchInModule();
  }


}
