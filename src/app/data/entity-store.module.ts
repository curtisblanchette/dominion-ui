import { EntityDataService } from '@ngrx/data';
import { NgModule } from '@angular/core';
// import { LeadsDataService } from './services/leads.service';

@NgModule({
  providers: [
    // LeadsDataService
  ]
})
export class EntityStoreModule {
  constructor(
    entityDataService: EntityDataService,
    // leadsDataService: LeadsDataService
  ) {
    // entityDataService.registerService('leads', leadsDataService);
    // entityDataService.registerService('contact', customDataService);
    // entityDataService.registerService('deal', customDataService);
    // entityDataService.registerService('event', customDataService);
  }
}
