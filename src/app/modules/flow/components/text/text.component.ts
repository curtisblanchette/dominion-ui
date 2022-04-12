import { Component, OnDestroy } from "@angular/core";
import { FlowService } from "../../flow.service";
import { Router } from "@angular/router";
import { EntityCollectionComponentBase } from '../../../../data/entity-collection.component.base';
import { EntityCollectionServiceFactory } from '@ngrx/data';

@Component({
  templateUrl: './text.component.html',
    styleUrls: ['../../_core/scss/_base.scss', './text.component.scss'],
})
export class TextComponent extends EntityCollectionComponentBase implements OnDestroy {

  public data: any;

  constructor(
    private router: Router,
    private entityCollectionServiceFactory: EntityCollectionServiceFactory,
    private flowService: FlowService
  ) {
    super(router, entityCollectionServiceFactory)
    this.data = this.router.getCurrentNavigation()!.extras.state;
  }


  public ngOnDestroy() {
  }
}
