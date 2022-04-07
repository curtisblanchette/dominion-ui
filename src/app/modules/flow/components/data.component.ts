import { Component, Input, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { FlowService } from "../flow.service";
import { Observable } from 'rxjs';
import { Lead } from '@4iiz/corev2';
import { LeadsDataService } from '../../../data/services/leads.service';
import { LeadCollection } from '../../../data/collections/lead.collection';

@Component({
  template: `
    <div *ngIf="data$ | async">
      <h3>{{data.title}}</h3>
      <fiiz-input type="text" id="firstName" placeholder="First Name" [ngModel]="data$.firstName | async"></fiiz-input>
      <fiiz-input type="text" id="lastName" placeholder="Last Name" [ngModel]="data$.lastName"></fiiz-input>
      <fiiz-input type="text" id="phone" placeholder="Mobile" [ngModel]="data$.phone"></fiiz-input>
      <fiiz-input type="text" id="email" placeholder="Email" [ngModel]="data$.email"></fiiz-input>
    </div>
  `,
  styleUrls: ['scss/_base.scss']
})
export class DataComponent implements OnDestroy {

  public data: any;
  loading$: Observable<boolean>;
  data$: Observable<Lead[]>;

  @Input() module: string;

  constructor(
    private flowService: FlowService,
    private router: Router,
    private leadsCollection: LeadCollection
  ) {
    this.data = this.router.getCurrentNavigation()!.extras.state;

    this.data$ = leadsCollection.entities$;
    this.loading$ = leadsCollection.loading$;
    this.getData();
  }

  public getData() {
    this.leadsCollection.getByKey('df382ba3-1784-4801-a299-fe357ccae34b');
  }

  public save() {

  }

  public ngOnDestroy() {
  }
}
