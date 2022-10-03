import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromReports from '../store/reports.reducer';
import * as reportsActions from '../store/reports.actions';
import { ViewStatus } from '../store/reports.reducer';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UntilDestroy } from '@ngneat/until-destroy';
import dayjs from 'dayjs';

import { FiizDatePickerComponent } from '../../../common/components/ui/forms';

@UntilDestroy()
@Component({
  selector: 'total-pipeline-report',
  templateUrl: './total-pipeline.component.html',
  styleUrls: ['../../../../assets/css/_container.scss','./total-pipeline.component.scss']
})
export class TotalPipelineComponent implements OnInit, AfterViewInit {

  public today: any = dayjs().format();
  public status$: Observable<ViewStatus>;
  public in$: Observable<any>;
  public out$: Observable<any>;
  public grid$: Observable<any[]>;
  public form: FormGroup;

  @ViewChild('dateRange', {static : false}) dateRangePicker: FiizDatePickerComponent;

  constructor(
    private store: Store<fromReports.ReportsState>,
    private fb: FormBuilder
  ) {
    
  }

  ngOnInit(): void {

    this.status$ = this.store.select(fromReports.selectTotalPipeline).pipe(map((res:any) => res.status));
    this.in$ = this.store.select(fromReports.selectTotalPipeline).pipe(map((res: any) => {
      return res.in;
    }));
    this.out$ = this.store.select(fromReports.selectTotalPipeline).pipe(map((res: any) => {
      return res.out;
    }));
    this.grid$ = this.store.select(fromReports.selectTotalPipeline).pipe(map((res: any) => {
      return res.grid;
    }));
    this.getData();
  }

  ngAfterViewInit(): void {
    this.store.select(fromReports.selectDateRange).subscribe((data:any) => {
      if( data ){
        const dates = Object.values(data).map( (val:any) => {
          return new Date(val);
        });
        
        this.dateRangePicker.writeValue(dates);
      }
    });
  }

  getData() {
    this.store.dispatch(reportsActions.FetchTotalPipeline());
  }

  public getChangedValues( value:any ){
    const range = {
      startDate : dayjs(value.from).startOf('day').format('YYYY-MM-DD HH:mm:ss'),
      endDate : dayjs(value.to).endOf('day').format('YYYY-MM-DD HH:mm:ss')
    };
    this.store.dispatch(reportsActions.SetDateRangeAction(range));
    this.store.dispatch(reportsActions.FetchTotalPipeline());
  }

}
