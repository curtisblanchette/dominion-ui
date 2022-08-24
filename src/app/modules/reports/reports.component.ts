import { Component, OnInit } from '@angular/core';
import { map, Observable, take } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromReports from './store/reports.reducer';
import * as reportsActions from './store/reports.actions';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['../../../assets/css/_container.scss','./reports.component.scss']
})
export class ReportsComponent implements OnInit {

  public data$: Observable<any>;
  public grid: any[] = [];

  constructor(
    private store: Store<fromReports.ReportsState>
  ) {

  }

  ngOnInit(): void {
    this.data$ = this.store.select(fromReports.getTotalPipeline).pipe(map(res => {

      for(const key of Object.keys(res)) {
        if (!['in', 'out'].includes(res[key])) {
          this.grid.push(Object.values(res[key]));
        }
      }
      this.grid = this.grid.flat();
      return res;

    }));
    this.getData();
  }

  getData() {
    this.store.dispatch(reportsActions.FetchTotalPipeline());
  }





}
