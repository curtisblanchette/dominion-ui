import { NgModule } from '@angular/core';
import { DefaultDataServiceConfig, DefaultDataServiceFactory, EntityDataModule, EntityDataService, HttpUrlGenerator } from '@ngrx/data';
import { entityConfig } from './entity-metadata';
import { environment } from '../../environments/environment';
import { PluralHttpUrlGenerator } from './plural.httpUrlGenerator';
import { ExtendedDataServiceFactory } from './custom.dataservice.factory';

const defaultDataServiceConfig: DefaultDataServiceConfig = {
  root: environment.dominion_api_url, // default root path to the server's web api

  // Optionally specify resource URLS for HTTP calls
  entityHttpResourceUrls: {
    // Case matters. Match the case of the entity name.
    // Hero: {
    //   // You must specify the root as part of the resource URL.
    //   entityResourceUrl: 'api/hero/',
    //   collectionResourceUrl: 'api/heroes/'
    // }
  },

  timeout: 3000 // request timeout

};

@NgModule({
  imports: [
    EntityDataModule.forRoot(entityConfig),
  ],
  providers: [
    { provide: DefaultDataServiceConfig, useValue: defaultDataServiceConfig},
    { provide: HttpUrlGenerator, useClass: PluralHttpUrlGenerator},
    { provide: DefaultDataServiceFactory, useClass: ExtendedDataServiceFactory }
  ]
})
export class EntityStoreModule {
  constructor(
    entityDataService: EntityDataService
  ) {
    // Register custom EntityDataServices
    // we don't need to do this because we are creating them on the fly via DataServiceFactory
    // who likes writing duplicate code anyway?
    // entityDataService.registerService('lead', leadService);
  }
}
