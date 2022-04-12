import { Component, ElementRef, AfterViewInit, ViewChild, OnDestroy, Input } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { fromEvent, Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { FlowService } from '../../flow.service';
import { ModuleType } from '../../_core/classes/flow.moduleTypes';
import { Lead } from '@4iiz/corev2';
import * as pluralize from 'pluralize';
import { EntityCollectionService, EntityCollectionServiceFactory, EntityServices } from '@ngrx/data';

@Component({
  templateUrl: 'list.component.html',
  styleUrls: ['../../_core/scss/_base.scss', 'list.component.scss']
})
export class ListComponent implements OnDestroy, AfterViewInit {

  public state: any;
  public module: ModuleType;
  public searchForm!: FormGroup;
  @Input() searchable: boolean = true;

  // Pagination
  public perPage: number = 2;
  public page: number = 1;
  public offset: number = 0;
  public totalRecords: number = 0;

  private SearchInput: ElementRef;

  @ViewChild('SearchInput') set content(content: ElementRef) {
    if (content) {
      this.SearchInput = content;
    }
  }

  public _dynamicService: EntityCollectionService<Lead>
  loaded$: Observable<boolean>;
  loading$: Observable<boolean>;
  data$: Observable<Lead[]>;
  count$: Observable<number>;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private flowService: FlowService,
    private router: Router,
    private entityServices: EntityServices,
    private entityCollectionServiceFactory: EntityCollectionServiceFactory
  ) {
    this.state = this.router.getCurrentNavigation()!.extras.state;
    this.module = this.state?.module;
    this._dynamicService = entityCollectionServiceFactory.create<Lead>(this.module);

    this.data$ = this._dynamicService.filteredEntities$;
    this.loading$ = this._dynamicService.loading$;
    this.loaded$ = this._dynamicService.loaded$;
    this.count$ = this._dynamicService.count$;

    this.data$.subscribe((res: Lead[]) => {
      console.log(res);

      if (!this.loading$ && this.loaded$ && res.length === 0) {
        // we only want to query if the cache doesn't return a record
      }
    });

    let form: { [key: string]: FormControl } = {};
    form['key'] = new FormControl('', Validators.required);
    this.searchForm = this.fb.group(form);
  }

  public onSelect(record: any) {
    this.flowService.addToCache(this.module, record);
  }

  public ngOnDestroy() {
    console.log(`[${this.module}] List Component Destroyed`);
  }

  get pluralModuleName() {
    if(this.state?.module) {
      return pluralize(this.state.module);
    }

    return '';
  }

  public ngAfterViewInit() {
    fromEvent(this.SearchInput.nativeElement.querySelector('input'), 'keyup').pipe(
      map((event: any) => {
        return event.target.value;
      }),
      filter(res => res.length > 2),
      debounceTime(350),
      distinctUntilChanged()
    ).subscribe((text: string) => {
      this.searchInModule();
    });
  }

  public searchInModule() {
    if (this.searchForm.valid) {
      const formValues = this.searchForm.value;
      const pattern = {'q': formValues.key.toLowerCase()}
      this._dynamicService.setFilter(pattern); // this is to get the right filteredEntities$ subset
      this._dynamicService.getWithQuery(pattern); // this performs the API call
    } else {
      console.warn('Form not valid');
      return of([]);
    }
  }

  public handlePageChange(pageNo: number) {
    this.page = pageNo;
    this.offset = this.perPage * (this.page - 1);
  }



}
