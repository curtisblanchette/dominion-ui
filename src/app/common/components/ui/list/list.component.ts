import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom, Observable, of, take } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { FlowService } from '../../../../modules/flow/flow.service';
import { Call, Contact, Deal, Event, Lead, User } from '@4iiz/corev2';
import * as pluralize from 'pluralize';
import { DefaultDataServiceFactory, EntityCollectionServiceFactory, QueryParams } from '@ngrx/data';
import { IDropDownMenuItem } from '../dropdown';
import { getColumnsForModule } from '../../../models';
import { AppState } from '../../../../store/app.reducer';
import { Store } from '@ngrx/store';
import * as dataActions from '../../../../modules/data/store/data.actions';
import * as fromData from '../../../../modules/data/store/data.reducer';
import { DropdownItem } from '../forms';
import { ModuleType } from '../../../../modules/flow/_core';
import { ComponentStateBase } from '../../../class.component-state-base';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { EntityCollectionComponentBase } from '../../../../data/entity-collection.component.base';

export interface IListOptions {
  searchable: boolean;
  editable: boolean;
  columns: Array<Object>;
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
export class FiizListComponent extends EntityCollectionComponentBase implements OnInit, AfterViewInit {

  public searchForm: FormGroup;

  // Sorting Options
  public sortColumn:string = 'createdAt'; // Sort by createdAt as default
  public sortOrgColumn:string = '';
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

  @Input('options') options: IListOptions;
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
    private store: Store<AppState>,
    private fb: FormBuilder,
    private router: Router,
    entityCollectionServiceFactory: EntityCollectionServiceFactory,
    dataServiceFactory: DefaultDataServiceFactory,
    public flowService: FlowService
  ) {
    super(router, entityCollectionServiceFactory, dataServiceFactory);

    if(!this.options || !this.state?.options) {
      /** route state is immutable so we gotta clone it */

      this.state = {
        options: {
          searchable: true,
          editable: false,
          columns: []
        }
      }
    }

    if(!this.module) {
      this.module = ModuleType.LEAD;
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
      this.values.emit( { module: this.module, record: record });
      this.selected = null;
      return;
    }

    this.selected = record;
    this.values.emit( { module: this.module, record: record });
  }

  public onPerPageChange($event: any) {
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

  public ngOnInit(){

  }

  get pluralModuleName() {
    if (this.state?.module) {
      return pluralize(this.state.module);
    }

    return '';
  }

  onCreateNew() {
    this.onCreate.emit({module: this.state.module, record: {}});
  }

  public ngAfterViewInit() {
    console.log(this.state);
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
