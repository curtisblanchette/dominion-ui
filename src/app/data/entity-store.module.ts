import { EntityDataService } from '@ngrx/data';
import { NgModule } from '@angular/core';
import { LeadsDataService } from './data.service';

@NgModule({
  providers: [
    LeadsDataService
  ]
})
export class EntityStoreModule {
  constructor(
    entityDataService: EntityDataService,
    leadsDataService: LeadsDataService
  ) {
    entityDataService.registerService('lead', leadsDataService);
    // entityDataService.registerService('contact', contactDataService);
    // entityDataService.registerService('deal', dealDataService);
    // entityDataService.registerService('event', eventDataService);
  }
}
