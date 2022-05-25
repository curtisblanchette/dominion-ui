import { Component, ElementRef, AfterViewInit, OnDestroy, Input, Output, ViewChildren, QueryList, EventEmitter, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom, Observable, of, Subject, take } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { FlowService } from '../../../../modules/flow/flow.service';
import { Call, Contact, Deal, Event, Lead, User } from '@4iiz/corev2';
import * as pluralize from 'pluralize';
import { DefaultDataServiceFactory, EntityCollectionServiceFactory, QueryParams } from '@ngrx/data';
import { EntityCollectionComponentBase } from '../../../../data/entity-collection.component.base';
import { IDropDownMenuItem } from '../dropdown';
import { DominionType, getColumnsForModule } from '../../../models';
import { AppState } from '../../../../store/app.reducer';
import { Store } from '@ngrx/store';
import * as dataActions from '../../../../modules/data/store/data.actions';
import * as fromData from '../../../../modules/data/store/data.reducer';
import { DropdownItem } from '../forms';

export interface IListOptions {
  searchable: boolean;
  editable: boolean;
  columns: Array<Object>;
}

@Component({
  selector: 'fiiz-list',
  templateUrl: 'list.component.html',
  styleUrls: ['list.component.scss']
})
export class FiizListComponent extends EntityCollectionComponentBase implements OnInit, OnDestroy, AfterViewInit {

  public searchForm: FormGroup;
  public destroyed$: Subject<any> = new Subject<any>();

  // Sorting Options
  public sortColumn:string = 'createdAt'; // Sort by createdAt as default
  public sortOrgColumn:string = '';
  public sortDirection:boolean = true; // DESC = true, ASC = false


  public perPageOptions$: Observable<DropdownItem[]> = of([{id: 25, label: '25' }, {id: 50, label: '50'}, {id: 100, label: '100'}]);

  // Pagination
  public perPage: number;
  public perPage$: Observable<number>;
  public page: number = 1;
  public offset: number = 0;
  public selected: Call | Lead | Contact | Deal | Event | User | null;
  public columns: DropdownItem[] = [];

  @ViewChildren('row') rows: QueryList<ElementRef>;

  @Input('options') options: IListOptions;
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
    private store: Store<AppState>,
    private fb: FormBuilder,
    private router: Router,
    private entityCollectionServiceFactory: EntityCollectionServiceFactory,
    private dataServiceFactory: DefaultDataServiceFactory,
    public flowService: FlowService
  ) {
    super(router, entityCollectionServiceFactory, dataServiceFactory);

    if(!this.options) {
      /** route state is immutable so we gotta clone it */
      this.options = Object.assign({}, this.state.options);
    }

    // get default visible columns
    this.columns = getColumnsForModule(this.module);

    let form: { [key: string]: FormControl } = {};
    form['search'] = new FormControl('');
    this.searchForm = this.fb.group(form);

    this.perPage$ = this.store.select(fromData.selectPerPage).pipe(map(value => {
      this.perPage = value; // ngx-pagination doesn't like observable itemsPerPage
      this.searchInModule();
      return value;
    }));

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

  public onPerPageChange($event: any) {
    this.store.dispatch(dataActions.SetPerPageAction({payload: parseInt($event.target.value, 0)}));
  }

  public onFocusOut($event: any) {
    $event.preventDefault();
    this.values.emit( { 'module' : this.module, 'record' : null });
    this.selected = null;
  }

  public onFocusIn($event: any, record: any) {
    $event.preventDefault();
    this.selected = record;
    this.values.emit( { 'module' : this.module, 'record' : record } );
  }

  public ngOnDestroy() {
    console.log(`[${this.module}] List Component Destroyed`);
    this.destroyed$.next(true);
  }

  public ngOnInit(){

  }

  get pluralModuleName() {
    if (this.state?.module) {
      return pluralize(this.state.module);
    }

    return '';
  }

  onCreateNew() {
    this.edit(null);
  }

  public edit(record: DominionType | null) {
    this.state.editPath.extras.state.record = record;
    this.router.navigate(this.state.editPath.route, this.state.editPath.extras);
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


  public searchInModule() {
    if (this.searchForm.valid) {
      const formValues = this.searchForm.value;
      this.getData( formValues.search.toLowerCase() );
    } else {
      console.warn('Form not valid');
      return of([]);
    }
  }

  public async getData( searchkey:string = '' ) {
    const params:QueryParams = {
      page: this.page.toString(),
      limit: (await firstValueFrom(this.store.select(fromData.selectPerPage))).toString()
    };

    if( searchkey ){
      params['q'] = searchkey;
    }

    if( this.sortColumn ){
      params['sort_by'] = this.sortColumn;
    }

    if( this.sortDirection ){
      params['sort'] = 'DESC';
    } else {
      params['sort'] = 'ASC';
    }

    // this._dynamicCollectionService.setFilter(params); // this modifies filteredEntities$ subset
    /** Proxy to the underlying dataService to do some processing */
    this.getWithQuery(params).pipe(take(1)).subscribe(); // this performs an API call
  }

  public performAction( value:any ){
    console.log('value to emit', value);
    this.btnValue.emit(value);
  }

  public handlePageChange(pageNo: number) {
    this.page = pageNo;
    this.searchInModule();
  }

  public sortListBy( column:string ){
    if( column === this.sortOrgColumn ){
      this.sortDirection = !this.sortDirection;
    } else {
      this.sortDirection = true;
    }    
    this.sortOrgColumn = column;
    if( column == 'fullName'){
      column = 'firstName';
    }
    this.sortColumn = column;
    this.searchInModule();
  }

}
