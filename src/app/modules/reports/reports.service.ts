import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Store } from '@ngrx/store';
import { ReportsState } from './store/reports.reducer';

@Injectable()
export class ReportsService {

  public startDate: string;
  public endDate: string;

  constructor(
    private http: HttpClient,
    private store: Store<ReportsState>
  ) {

  }

  public getleadsByLeadSource() {
    return this.http.get(environment.dominion_api_url + '/reports/leads-by-leadsource');
  }

  public getTotalPipeline() {
    return this.http.get(environment.dominion_api_url + '/reports/total-pipeline?startDate=2022-01-01&endDate=2022-08-18');
  }
}
