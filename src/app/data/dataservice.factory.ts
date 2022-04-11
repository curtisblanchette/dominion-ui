import { Injectable, Optional } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DefaultDataServiceConfig, EntityCollectionDataService, HttpUrlGenerator } from '@ngrx/data';
import { CustomDataService } from './custom.dataservice';

@Injectable()
export class ExtendedDataServiceFactory {
  constructor(
    protected http: HttpClient,
    protected httpUrlGenerator: HttpUrlGenerator,
    @Optional() protected config?: DefaultDataServiceConfig
  ) {
    config = config || {};
    httpUrlGenerator.registerHttpResourceUrls(config.entityHttpResourceUrls);
  }
  /**
   * Create a default {EntityCollectionDataService} for the given entity type
   * @param entityName Name of the entity type for this data service
   */
  create<T>(entityName: string): EntityCollectionDataService<T> {
    return new CustomDataService<T>(entityName, this.http, this.httpUrlGenerator, this.config);
  }
}
