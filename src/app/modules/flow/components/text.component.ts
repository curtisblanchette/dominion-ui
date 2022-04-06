import { Component, OnDestroy } from "@angular/core";
import { FlowService } from "../flow.service";
import { Router } from "@angular/router";
import { LeadService } from '../../../data/lead.service';
import { Observable } from 'rxjs';
import { Lead } from '@4iiz/corev2';

@Component({
  template: `
    <div *ngIf="data">
      <h3>{{data.title}}</h3>
      {{data.body}}
      <div *ngFor="let lead of leads$ | async">{{lead.id}}</div>
    </div>
  `,
    styleUrls: ['scss/_base.scss'],
})
export class TextComponent implements OnDestroy {

  loading$: Observable<boolean>;
  leads$: Observable<Lead[]>;

  public data: any;

  constructor(
    private router: Router,
    private flowService: FlowService,
    private leadService: LeadService
  ) {
    this.data = this.router.getCurrentNavigation()!.extras.state;
    this.leads$ = leadService.entities$;
    this.loading$ = leadService.loading$;
    this.getLeads();
  }

  getLeads() {
    this.leadService.getAll();
  }

  public ngOnDestroy() {
  }
}
