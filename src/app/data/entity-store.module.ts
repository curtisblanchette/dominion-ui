import { EntityDataService } from '@ngrx/data';
import { NgModule } from '@angular/core';
import { DataService } from './data.service';

@NgModule({
  providers: [
    DataService
  ]
})
export class EntityStoreModule {
  constructor(
    entityDataService: EntityDataService,
    dataService: DataService
  ) {
    entityDataService.registerServices({
      'contact': dataService,
      'lead': dataService,
      'deal': dataService,
      'event': dataService
    });
  }
}
