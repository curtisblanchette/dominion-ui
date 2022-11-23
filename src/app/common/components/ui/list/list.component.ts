import { AfterContentInit, AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, QueryList, TemplateRef, ViewChild, ViewChildren, HostListener } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom, Observable, of, startWith, take } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { FlowService } from '../../../../modules/flow/flow.service';
import { Call, Contact, Deal, Event, Lead, User } from '@4iiz/corev2';
import pluralize from 'pluralize';
import { DefaultDataServiceFactory, EntityCollectionServiceFactory, QueryParams } from '@ngrx/data';
import { IDropDownMenuItem } from '../dropdown';
import * as fromApp from '../../../../store/app.reducer'
import { Store } from '@ngrx/store';
import * as dataActions from '../../../../modules/data/store/data.actions';
import * as fromData from '../../../../modules/data/store/data.reducer';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { EntityCollectionComponentBase } from '../../../../data/entity-collection.component.base';
import { ModuleTypes } from '../../../../data/entity-metadata';
import { getColumns } from './display-columns';
import { getSearchableColumns } from './searchable-columns';
import { DropdownItem } from '../../interfaces/dropdownitem.interface';

export interface IListOptions {
  searchable: boolean;
  editable: boolean;
  columns: Array<Object>;
  controls: {
    perPage?: boolean;
    pagination?: boolean;
    createNew?: boolean;
  };
  loadInitial?: boolean;
  query?: any;
  createModule?: ModuleTypes; // if you need to override the module that should be
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
export class FiizListComponent extends EntityCollectionComponentBase implements AfterContentInit, AfterViewInit {

  public searchForm: FormGroup;

  // Sorting Options
  public sortColumn: string = 'createdAt'; // Sort by createdAt as default
  public sortableColumns: DropdownItem[];
  public sortOrgColumn: string = '';
  public sortDirection: SortDirections = SortDirections.DESC; // DESC = 1, ASC = 0
  public sortDirections: any = SortDirections;

  public perPageOptions$: Observable<DropdownItem[]> = of([{id: 25, label: '25' }, {id: 50, label: '50'}, {id: 100, label: '100'}]);

  // Pagination
  public perPage: number;
  public perPage$: Observable<number>;
  public page: number = 1;
  public limit: number = 25;
  public offset: number = 0;
  public selected: Call | Lead | Contact | Deal | Event | User | null;
  public columns: DropdownItem[] = [];

  @ViewChildren('row') rows: QueryList<ElementRef>;

  @Input('data') public override data: any;
  @Input('module') public override module: ModuleTypes;
  @Input('options') public override options: IListOptions = { loadInitial: true, editable: true, searchable: true, columns: [], controls: { perPage: true, pagination: true, createNew: true }};

  @Output('values') values: EventEmitter<any> = new EventEmitter();
  @Output('onCreate') onCreate: EventEmitter<any> = new EventEmitter();
  @Output('onEdit') onEdit: EventEmitter<any> = new EventEmitter();
  @Output('onDelete') onDelete: EventEmitter<any> = new EventEmitter();
  @Output('btnValue') btnValue: EventEmitter<any> = new EventEmitter();

  public template$: Observable<TemplateRef<any> | undefined>;
  @ViewChild('main') mainTemplate: TemplateRef<any>;
  @ViewChild('loading') loadingTemplate: TemplateRef<any>;
  @ViewChild('noDataFound') noDataTemplate: TemplateRef<any>;
  @ViewChild('initial') initialTemplate: TemplateRef<any>

  public actionItems$: Observable<IDropDownMenuItem[]> = of([
    {
      label: 'Delete',
      icon: 'fa-solid fa-trash',
      emitterValue : 'delete'
    }
  ]);

  public buttonLabels:{[key:string] : string };

  @HostListener('window:resize', ['$event'])
  onResize(event:any) {
    this.getButtonLabels();
  }

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

    this.perPage$ = this.store.select(fromData.selectPerPage).pipe(untilDestroyed(this), map(value => {
      this.perPage = value; // ngx-pagination doesn't like observable itemsPerPage
      this.searchInModule();
      return value;
    }));

    this.getButtonLabels();

  }

  public override async ngAfterContentInit() {
    await super.ngAfterContentInit();

    this.template$ = this.loadingSubject$.asObservable().pipe(
      untilDestroyed(this),
      startWith([false, false, [1, 2]]),
      map((res) => {
        const [loading, loaded, data]: any = res;

        switch(true) {
          case !loading && loaded && data.length > 0: {
            return this.mainTemplate;
          }
          case loading && !loaded: {
            return this.loadingTemplate;
          }
          case !loading && loaded && (!data.length || data.length === 0): {
            return this.noDataTemplate;
          }
        }
        return this.initialTemplate;
      }),

    );
    this.columns = getColumns(this.module);
    if(this.options.columns?.length) {
      this.columns = this.columns.filter(col => this.options.columns.includes(col.id));
    }
    // set the default sort column from ./searchable-columns.ts
    this.sortableColumns = getSearchableColumns(this.module);
    this.sortColumn = this.sortableColumns[0].id as string;
  }

  public async ngAfterViewInit() {

    this.searchForm.get('search')?.valueChanges.pipe(
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

    if(this.options.loadInitial) {
      this.searchInModule();
    }
  }

  public onClick($event: any, record: any) {
    $event.preventDefault();

    if([2,3].includes($event.which)) {
      // don't proceed if it's `middle-click` or `right-click`
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

  public onPerPageChange(perPage: number) {
    this.page = 1;
    this.store.dispatch(dataActions.SetPerPageAction({payload: perPage}));
  }

  public onKeyUp($event: any, record: any) {
    $event.preventDefault();
    if(this.selected?.id === $event.target.attributes['data-id']) {
      this._dynamicCollectionService.setFilter({});
      return;
    }
    if([13, 32].includes($event.keyCode) || ['Space', 'Enter'].includes($event.code)) {
      this.selected = record;
      this.values.emit( { module: this.module, record: record } );
    }
  }

  get pluralModuleName() {
    if (this.module) {
      const pluralLowerCase = pluralize(this.module);
      return pluralLowerCase[0].toUpperCase() + pluralLowerCase.substring(1, pluralLowerCase.length);
    }

    return '';
  }

  public getButtonLabels(){
    if( window.innerWidth >= 800 ){
      this.buttonLabels = {
        'action' : 'Action',
        'add' : `New ${this.getModuleName()}`,
        'edit' : 'Edit'
      }
    } else {
      this.buttonLabels = {
        'action' : '',
        'add' : '',
        'edit' : ''
      }
    }
  }

  public getModuleName(){
    const module = this.options.createModule || this.module
    if(module) {
      return module[0].toUpperCase() + module.substring(1, module.length);
    }
  }

  public onCreateNew() {
    this.selected = null;
    this.values.emit( { module: this.module, record: null });
    this._dynamicCollectionService.setFilter({});
    this.onCreate.emit( { module: this.module, record: null } );
  }

  public onEditRecord() {
    if( this.selected ){
      this.onEdit.emit( { module: this.module, record: this.selected } );
    }
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
    /** Proxy to the underlying dataService for processing */
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

    // TODO needs to be fixed - setting is not explicit
    if( this.sortDirection ){
      params['sort'] = 'DESC';
    } else {
      params['sort'] = 'ASC';
    }

    for(const param in this.options.query) {
      if(typeof this.options.query[param] === 'object' && !Array.isArray(this.options.query[param])) {
        const op = Object.keys(this.options.query[param]).shift();
        if(op) {
          params[`${param}[${op}]`] = this.options.query[param][op];
        }
      } else {
          params[param] = this.options.query[param];
      }
    }

    return params;
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

  public getActionItemValue( value:any ){
    if( value == 'delete' && this.selected ){
      this.onDelete.emit( { module: this.module, record: this.selected } );
    }
  }
}
