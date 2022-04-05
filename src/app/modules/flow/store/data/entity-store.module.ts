import { EntityDataService } from '@ngrx/data';
import { NgModule } from '@angular/core';
import { LeadsDataService } from './leads-data.service';

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
    entityDataService.registerService('Lead', leadsDataService);
  }
}
