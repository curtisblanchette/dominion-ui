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
import { IDropDownMenuItem } from '../dropdown/dropdown';

@Component({
  selector: 'fiiz-list',
  templateUrl: 'list.component.html',
  styleUrls: ['list.component.scss']
})
export class FiizListComponent extends EntityCollectionComponentBase implements OnInit, OnDestroy, AfterViewInit {

  public searchForm!: FormGroup;
  private SearchInput: ElementRef;

  // Pagination
  public perPage: number = 5;
  public page: number = 1;
  public offset: number = 0;
  public totalRecords: number = 0;
  public selected: Lead | Contact | Event | Deal | null;

  @Input('searchOnly') searchOnly: boolean;
  @Input('moduleName') moduleName: boolean;
  @Input('menuItems') menuItems:IDropDownMenuItem[] = [];
  @ViewChild('SearchInput') set content(content: ElementRef) {
    if (content) {
      this.SearchInput = content;
    }
  }
  @ViewChildren('row') rows: QueryList<ElementRef>
  
  @Output('values') values: EventEmitter<any> = new EventEmitter();
  @Output('btnValue') btnValue:EventEmitter<any> = new EventEmitter();

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
    form['key'] = new FormControl('', Validators.required);
    this.searchForm = this.fb.group(form);
  }

  public onClick($event: any, record: any) {
    $event.preventDefault();
    if (this.selected?.id === record.id) {
      // this.flowService.cache[this.module] = null;
      this.values.emit( { 'moduleName' : this.module, 'record' : record} );
      this.selected = null;
      return;
    }
    this.selected = record;
    console.log('this.selected',this.selected);
    // this.flowService.addToCache(this.module, record);
    this.values.emit( { 'moduleName' : this.module, 'record' : record} );
  }

  public onFocusOut($event: any) {
    $event.preventDefault();
    // this.flowService.cache[this.module] = null;
    this.values.emit( { 'moduleName' : this.module, 'record' : null } );
    this.selected = null;
  }

  public onFocusIn($event: any, record: any) {
    $event.preventDefault();
    this.selected = record;
    // this.flowService.addToCache(this.module, record);
    this.values.emit( { 'moduleName' : this.module, 'record' : record} );
  }

  public ngOnDestroy() {
    console.log(`[${this.module}] List Component Destroyed`);
  }

  public ngOnInit(){
    
  }

  get pluralModuleName() {
    if (this.state?.module) {
      return pluralize(this.state.module);
    }

    return '';
  }

  public ngAfterViewInit() {
    fromEvent(this.SearchInput.nativeElement.querySelector('input'), 'keyup').pipe(
      map((event: any) => {
        return event.target.value;
      }),
      // filter(res => res.length > 2),
      debounceTime(250),
      distinctUntilChanged()
    ).subscribe((text: string) => {
      this.searchInModule();
    });
  }


  public searchInModule() {
    if (this.searchForm.valid) {
      const formValues = this.searchForm.value;
      const pattern = { q: formValues.key.toLowerCase() };
      this._dynamicService.setFilter(pattern); // this modifies filteredEntities$ subset
      this._dynamicService.getWithQuery(pattern); // this performs an API call
    } else {
      console.warn('Form not valid');
      return of([]);
    }
  }

  public performAction( value:any ){
    console.log('value to emit', value);
    this.btnValue.emit(value);
  }

  public handlePageChange(pageNo: number) {
    this.page = pageNo;
    this.offset = this.perPage * (this.page - 1);
  }


}
