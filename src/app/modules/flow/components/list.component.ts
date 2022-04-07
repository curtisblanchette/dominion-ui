import { Component, Input, ElementRef, AfterViewInit, ViewChild, OnInit, OnDestroy } from "@angular/core";
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { fromEvent, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';

import { DropdownItem } from '../../../common/components/ui/forms';
import { environment } from '../../../../environments/environment';
import { FlowService } from '../flow.service';
import { ModuleType } from '../common/flow.moduleTypes';

@Component({
  templateUrl : 'templates/search-list.component.html',
  styleUrls : ['scss/_base.scss','scss/search_n_list.scss']
})
export class ListComponent implements OnDestroy, AfterViewInit {

  public leadSearchColumns: DropdownItem[] = [ 
    {id: 'firstName', label: 'First Name'}, 
    {id: 'lastName', label: 'Last Name'},
    {id: 'phone', label: 'Phone'}
  ];

  public DealSearchColumns: DropdownItem[] = [
    {id: 'name', label: 'Name'}
  ];

  public ContactSearchColumns: DropdownItem[] = [
    {id: 'firstName', label: 'First Name'}, 
    {id: 'lastName', label: 'Last Name'},
    {id: 'email', label: 'Email'},
    {id: 'phone', label: 'Phone'}
  ];

  public CampaignsSearchColumns: DropdownItem[] = [
    {id: 'name', label: 'Name'}
  ];

  public moduleColumnsMap:{ [key:string]:DropdownItem[] } = {
    [ModuleType.LEAD] : this.leadSearchColumns,
    [ModuleType.DEAL] : this.DealSearchColumns,
    [ModuleType.CAMPAIGNS] : this.CampaignsSearchColumns,
    [ModuleType.CONTACTS] : this.ContactSearchColumns
  };
  
  public searchColumns:DropdownItem[] = [];

  public searchForm!: FormGroup;
  public searchable:boolean = true;
  public listData:[] = [];
  public paginatedData:any[] = [];
  public dataFound:boolean = true;

  // Pagination
  public perPage:number = 5;
  public page:number = 1;
  public offset:number = 0;
  public totalRecords:number = 0;

  public data: any;
  @Input() module: string;
  
  private SearchInput: ElementRef;
  @ViewChild('SearchInput') set content(content: ElementRef) {
    if(content) {
      this.SearchInput = content;
    }
  }
  public apiResponse: any;
  public isSearching: boolean;

  constructor(
    private fb : FormBuilder,
    private http : HttpClient,
    private flowService: FlowService,
    private router: Router
  ){      
      this.isSearching = false;
      this.data = this.router.getCurrentNavigation()!.extras.state;
      if( this.data && this.data.module ){
        this.searchColumns = this.moduleColumnsMap[this.data.module];
      }      

      let form : { [key:string] : FormControl } = {};
      form['key'] = new FormControl('', Validators.required);
      form['field'] = new FormControl('', Validators.required);
      this.searchForm = this.fb.group(form);
  }

    public ngOnDestroy(){
      console.log('Destroyed');
    }

    public ngAfterViewInit() {
      fromEvent(this.SearchInput.nativeElement.querySelector('input'), 'keyup').
      pipe(
        map((event: any) => {
          return event.target.value;
        }),
        filter(res => res.length > 2),
        debounceTime(1000),
        distinctUntilChanged()
      ).
      subscribe((text: string) => {
        this.searchInModule();
      });
    }

    public searchInModule(){
      if( this.searchForm.valid ){
        this.isSearching = true;
        const formValues = this.searchForm.value;
        this.http.get(`${environment.api_private_url}${this.data.module}/search?${formValues.field.id}=${formValues.key}`).subscribe((data:any) => {
          if( data && data.count > 0 ){
            this.totalRecords = data.count;
            this.listData = data.rows;
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
        console.error('From not valid');
        return of([]);        
      }
    }

    public handlePageChange( pageNo:number ){
      this.page = pageNo;
      this.offset = this.perPage * (this.page - 1);
      this.arrangePaginatedData( this.offset );
      
    }

    private arrangePaginatedData( offset:number ){
      this.paginatedData = this.listData.slice(offset, offset+this.perPage);
    }

}