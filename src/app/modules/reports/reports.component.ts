import { Component, OnInit } from '@angular/core';
import { firstValueFrom, map, Observable, take } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromReports from './store/reports.reducer';
import * as reportsActions from './store/reports.actions';
import { ViewStatus } from './store/reports.reducer';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import * as dayjs from 'dayjs';

@UntilDestroy()
@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['../../../assets/css/_container.scss','./reports.component.scss']
})
export class ReportsComponent implements OnInit {

  public today: any = dayjs().format();
  public status$: Observable<ViewStatus>;
  public in$: Observable<any>;
  public out$: Observable<any>;
  public grid$: Observable<any[]>;
  public form: FormGroup;

  constructor(
    private store: Store<fromReports.ReportsState>,
    private fb: FormBuilder
  ) {

  }

  ngOnInit(): void {
    this.buildForm();
    this.status$ = this.store.select(fromReports.getTotalPipeline).pipe(map((res:any) => res.status));
    this.in$ = this.store.select(fromReports.getTotalPipeline).pipe(map((res: any) => {
      return res.in;
    }));
    this.out$ = this.store.select(fromReports.getTotalPipeline).pipe(map((res: any) => {
      return res.out;
    }));
    this.grid$ = this.store.select(fromReports.getTotalPipeline).pipe(map((res: any) => {
      return res.grid;
    }));
    this.getData();
  }

  private async buildForm() {
    let form: { [key: string]: FormControl } = {};
    const dateRange = await firstValueFrom(this.store.select(fromReports.getDateRange));
    form['startDate'] = new FormControl(dateRange.startDate, Validators.required);
    form['endDate'] = new FormControl(dateRange.endDate, Validators.required);

    this.form = this.fb.group(form);
    this.form.valueChanges.pipe(untilDestroyed(this)).subscribe((values: any) => {
      this.store.dispatch(reportsActions.SetDateRangeAction(values));
      this.store.dispatch(reportsActions.FetchTotalPipeline());
    });
  }

  getData() {
    this.store.dispatch(reportsActions.FetchTotalPipeline());
  }

}
