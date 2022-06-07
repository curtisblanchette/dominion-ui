import { Component, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { FlowService } from "../../../flow.service";
import { DefaultDataServiceFactory, EntityCollectionServiceFactory } from '@ngrx/data';

@Component({
  selector: 'flow-intro',
  template: `
    <div>
      <h3>Welcome to Flow!</h3>
    </div>
  `,
  styleUrls: ['../_base.scss']
})
export class FlowIntroComponent implements OnDestroy {

  public data: any;

  constructor(
    private router: Router,
    private flowService: FlowService,
    entityCollectionServiceFactory: EntityCollectionServiceFactory,
    dataServiceFactory: DefaultDataServiceFactory
  ) {
    // this.data = this.router.getCurrentNavigation()!.extras.state;
  }

  public save() {
  }

  public ngOnDestroy() {
  }
}
