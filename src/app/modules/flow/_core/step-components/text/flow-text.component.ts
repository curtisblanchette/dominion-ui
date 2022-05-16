import { Component, OnDestroy } from "@angular/core";
import { FlowService } from "../../../flow.service";
import { Router } from "@angular/router";
import { EntityCollectionComponentBase } from '../../../../../data/entity-collection.component.base';
import { DefaultDataServiceFactory, EntityCollectionServiceFactory } from '@ngrx/data';

@Component({
  selector: 'flow-text',
  templateUrl: './flow-text.component.html',
  styleUrls: ['../_base.scss', './flow-text.component.scss'],
})
export class FlowTextComponent extends EntityCollectionComponentBase implements OnDestroy {

  public data: any;

  constructor(
    private router: Router,
    private entityCollectionServiceFactory: EntityCollectionServiceFactory,
    private dataServiceFactory: DefaultDataServiceFactory,
    private flowService: FlowService
  ) {
    super(router, entityCollectionServiceFactory, dataServiceFactory)
    this.data = this.router.getCurrentNavigation()!.extras.state;
  }


  public ngOnDestroy() {
  }
}
