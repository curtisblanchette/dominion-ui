import { AfterContentInit, AfterViewChecked, AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom, Observable, of, take } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { FlowService } from '../../../../modules/flow/flow.service';
import { Call, Contact, Deal, Event, Lead, User } from '@4iiz/corev2';
import * as pluralize from 'pluralize';
import { DefaultDataServiceFactory, EntityCollectionServiceFactory, QueryParams } from '@ngrx/data';
import { IDropDownMenuItem } from '../dropdown';
import * as fromApp from '../../../../store/app.reducer'
import { Store } from '@ngrx/store';
import * as dataActions from '../../../../modules/data/store/data.actions';
import * as fromData from '../../../../modules/data/store/data.reducer';
import { DropdownItem } from '../forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { EntityCollectionComponentBase } from '../../../../data/entity-collection.component.base';
import { ModuleTypes } from '../../../../data/entity-metadata';
import { getColumns } from './display-columns';
import { getSearchableColumns } from './searchable-columns';

export interface IListOptions {
  searchable: boolean;
  editable: boolean;
  columns: Array<Object>;
  query?: any;
  resolveQuery?: { [key: string]: string }
}

export enum SortDirections {
  ASC,
  DESC
}

@UntilDestroy()
@Component({
  selector: 'fiiz-list',
  templateUrl: 'list.component.html',
  styleUrls: ['list.component.scss']
})
export class FiizListComponent extends EntityCollectionComponentBase implements AfterContentInit, AfterViewInit, AfterViewChecked {

  public searchForm: FormGroup;

  // Sorting Options
  public sortColumn: string = 'createdAt'; // Sort by createdAt as default
  public sortableColumns: DropdownItem[];
  public sortOrgColumn: string = '';
  public sortDirection: SortDirections = SortDirections.ASC; // DESC = 1, ASC = 0
  public sortDirections: any = SortDirections;

  public perPageOptions$: Observable<DropdownItem[]> = of([{id: 25, label: '25' }, {id: 50, label: '50'}, {id: 100, label: '100'}]);

  // Pagination
  public perPage: number;
  public perPage$: Observable<number>;
  public page: number = 1;
  public offset: number = 0;
  public selected: Call | Lead | Contact | Deal | Event | User | null;
  public columns: DropdownItem[] = [];

  @ViewChildren('row') rows: QueryList<ElementRef>;

  @Input('data') public override data: any;
  @Input('module') public override module: ModuleTypes;
  @Input('options') public override options: IListOptions;

  @Input('loadInitial') loadInitial: boolean = false;
  @Output('values') values: EventEmitter<any> = new EventEmitter();
  @Output('onCreate') onCreate: EventEmitter<any> = new EventEmitter();
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
    private store: Store<fromApp.AppState>,
    private fb: FormBuilder,
    public flowService: FlowService,
    entityCollectionServiceFactory: EntityCollectionServiceFactory,
    dataServiceFactory: DefaultDataServiceFactory,
    router: Router
  ) {
    super(router, entityCollectionServiceFactory, dataServiceFactory);

    const state = (<any>router.getCurrentNavigation()?.extras.state);

    if(state && Object.keys(state).length){
      this.module = state.module;
      this.options = state.options;
      this.data = state.data;
    }

    let form: { [key: string]: FormControl } = {};
    form['search'] = new FormControl('');
    this.searchForm = this.fb.group(form);

    this.perPage$ = this.store.select(fromData.selectPerPage).pipe(map(value => {
      this.perPage = value; // ngx-pagination doesn't like observable itemsPerPage
      this.searchInModule();
      return value;
    }));
  }

  public override async ngAfterContentInit() {
    await super.ngAfterContentInit();

    this.columns = getColumns(this.module);

    // set the default sort column from ./searchable-columns.ts
    this.sortableColumns = getSearchableColumns(this.module);
    this.sortColumn = this.sortableColumns[0].id as string;
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
    ).subscribe((text: string) => {
      this.page = 1;
      this.searchInModule();
    });
  }

  public onClick($event: any, record: any) {
    $event.preventDefault();

    if([2,3].includes($event.which)) {
      // don't process if it's a middle-click or right-click
      return false;
    }

    if (this.selected?.id === record.id) {
      this.values.emit( { module: this.module, record: null });
      this.selected = null;
      return;
    }

    this.selected = record;
    this.values.emit( { module: this.module, record: record });
  }

  public onPerPageChange($event: any) {
    this.page = 1;
    this.store.dispatch(dataActions.SetPerPageAction({payload: parseInt($event.target.value, 0)}));
  }

  public onFocusOut($event: any) {
    $event.preventDefault();
    this.values.emit( { module: this.module, record: null });
    this.selected = null;
  }

  public onFocusIn($event: any, record: any) {
    $event.preventDefault();
    this.selected = record;
    this.values.emit( { module: this.module, record: record } );
  }


  get pluralModuleName() {
    if (this.module) {
      return pluralize(this.module);
    }

    return '';
  }

  get moduleName() {
    if(this.module) {
      return this.module[0].toUpperCase() + this.module.substring(1, this.data.length);
    }
  }

  public onCreateNew() {
    this.selected = null;
    this.values.emit( { module: this.module, record: null });
    this.onCreate.emit( { module: this.module, record: null } );
  }

  public searchInModule() {
    if (this.searchForm.valid) {
      this.getData();
    } else {
      console.warn('Form not valid');
      return of([]);
    }
  }

  public async getData() {
    const params = await this.parseQuery();
    // this._dynamicCollectionService.setFilter(params); // this modifies filteredEntities$ subset
    /** Proxy to the underlying dataService to do some processing */
    this.getWithQuery(params).pipe(take(1)).subscribe(); // this performs an API call
  }

  private async parseQuery(): Promise<QueryParams> {
    const params: QueryParams = {
      page: this.page.toString(),
      limit: (await firstValueFrom(this.store.select(fromData.selectPerPage))).toString()
    };

    if( this.searchForm.value.search.toLowerCase().length ){
      params['q'] = this.searchForm.value.search.toLowerCase();
    }

    if( this.sortColumn ){
      params['sort_by'] = this.sortColumn;
    }

    if( this.sortDirection ){
      params['sort'] = 'DESC';
    } else {
      params['sort'] = 'ASC';
    }

    return {...params, ...this.options.resolveQuery};
  }

  public performAction( value:any ){
    this.btnValue.emit(value);
  }

  public handlePageChange(pageNo: number) {
    this.page = pageNo;
    this.searchInModule();
  }

  public sortListBy( column:string ) {
    const isSortable = this.sortableColumns.find(item => item.id === column);
    if(!isSortable) {
      return;
    }
    if( column === this.sortOrgColumn ){
      this.toggleSort();
    } else {
      this.sortDirection = SortDirections.DESC;
    }
    this.sortOrgColumn = column;
    if (column === 'fullName') {
      column = 'firstName';
    }
    this.sortColumn = column;
    this.searchInModule();
  }

  private toggleSort() {
    return this.sortDirection = this.sortDirection === SortDirections.DESC ? SortDirections.ASC : SortDirections.DESC;
  }

}
