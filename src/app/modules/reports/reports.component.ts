import { Component, OnInit } from '@angular/core';
import { ReportsService } from './reports.service';
import { Observable, take } from 'rxjs';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['../../../assets/css/_container.scss','./reports.component.scss']
})
export class ReportsComponent implements OnInit {

  public data$: Observable<any>;

  constructor(
    private reportsService: ReportsService
  ) {
    this.data$ = this.reportsService.getTotalPipeline().pipe(take(1));
  }

  ngOnInit(): void {

  }

}
