import { Component, Input, ElementRef, AfterViewInit, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { fromEvent, Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { DropdownItem } from '../../../../common/components/ui/forms';
import { FlowService } from '../../flow.service';
import { getSearchableColumns } from './searchable-columns';
import { ModuleType } from '../../_core/classes/flow.moduleTypes';
import { Lead } from '@4iiz/corev2';
import { LeadCollection } from '../../../../data/collections/lead.collection';
import * as pluralize from 'pluralize';

@Component({
  templateUrl: 'list.component.html',
  styleUrls: ['../../_core/scss/_base.scss', 'list.component.scss']
})
export class ListComponent implements OnDestroy, AfterViewInit {

  public state: any;
  public module: ModuleType;

  public searchColumns: DropdownItem[] = [];

  public searchForm!: FormGroup;
  public searchable: boolean = true;
  public listData: [] = [];
  public paginatedData: any[] = [];
  public dataFound: boolean = true;

  // Pagination
  public perPage: number = 5;
  public page: number = 1;
  public offset: number = 0;
  public totalRecords: number = 0;

  private SearchInput: ElementRef;

  @ViewChild('SearchInput') set content(content: ElementRef) {
    if (content) {
      this.SearchInput = content;
    }
  }

  public isSearching: boolean;

  loaded$: Observable<boolean>;
  loading$: Observable<boolean>;
  data$: Observable<Lead[]>;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private flowService: FlowService,
    private router: Router,
    private leadService: LeadCollection
  ) {
    this.state = this.router.getCurrentNavigation()!.extras.state;
    this.module = this.state?.module;

    this.isSearching = false;

    this.data$ = leadService.entities$;
    this.loading$ = leadService.loading$;
    this.loaded$ = leadService.loaded$;

    this.data$.subscribe(res => {
      if(res.length && this.state?.module) {
        this.searchColumns = getSearchableColumns(this.state.module);
      }
    })

    let form: { [key: string]: FormControl } = {};
    form['key'] = new FormControl('', Validators.required);
    // form['field'] = new FormControl(this.searchColumns[0], Validators.required);
    this.searchForm = this.fb.group(form);
  }

  public onSelect(record: any) {
    this.flowService.addToCache(this.module, record);
  }

  public ngOnDestroy() {
    console.log('Destroyed');
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
      this.isSearching = true;
      const formValues = this.searchForm.value;
      this.leadService.getWithQuery({'q': formValues.key}).subscribe((res: any) => {
        if (res && res.count > 0) {
          this.totalRecords = res.count;
          this.listData = res.rows;
          this.dataFound = true;
          this.arrangePaginatedData(0);
        } else {
          this.totalRecords = 0;
          this.listData = [];
          this.dataFound = false;
          this.paginatedData = [];
        }
        this.isSearching = false;
      });
    } else {
      console.error('Form not valid');
      return of([]);
    }
  }

  public handlePageChange(pageNo: number) {
    this.page = pageNo;
    this.offset = this.perPage * (this.page - 1);
    this.arrangePaginatedData(this.offset);

  }

  private arrangePaginatedData(offset: number) {
    this.paginatedData = this.listData.slice(offset, offset + this.perPage);
  }

}
