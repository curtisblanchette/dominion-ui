import { Component, Input, OnDestroy } from '@angular/core';
import { FlowService } from '../../../flow.service';
import { Router } from '@angular/router';
import { DefaultDataServiceFactory, EntityCollectionServiceFactory } from '@ngrx/data';
import { EntityCollectionComponentBase } from '../../../../../data/entity-collection.component.base';

@Component({
  selector: 'flow-list',
  templateUrl: './flow-list.component.html' ,
  styleUrls: ['../_base.scss','./flow-list.component.scss']
})
export class FlowListComponent extends EntityCollectionComponentBase implements OnDestroy {

  @Input('state') override state: any;

  constructor(
    entityCollectionServiceFactory: EntityCollectionServiceFactory,
    dataServiceFactory: DefaultDataServiceFactory,
    router: Router,
    public flowService: FlowService
  ) {
    super(router, entityCollectionServiceFactory, dataServiceFactory);
  }

  public ngOnDestroy(): void {
    console.log('Flow List component destroy');
  }

  public EmitValues( value:any ){
    if( value ){
      this.flowService.addVariables( {existing_lead : 'yes', existing_lead_record: value });
    }
  }

}
