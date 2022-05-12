import { Inject, Injectable, Optional } from '@angular/core';
import { DefaultDataService, DefaultDataServiceConfig, EntityCollectionDataService, HttpUrlGenerator } from '@ngrx/data';
import { HttpClient } from '@angular/common/http';
import { DominionType } from '../common/models';

@Injectable()
export class CustomDataService<T> extends DefaultDataService<T> {

  constructor(
    @Inject('entityName') entityName: string,
    http: HttpClient,
    httpUrlGenerator: HttpUrlGenerator,
    config?: DefaultDataServiceConfig,
  ) {
    super(
      entityName,
      http,
      httpUrlGenerator,
      config
    );
  }

  override add(entity: Partial<DominionType>) {
    const data = this.removeNulls(entity);
    return super.add(data);
  }

  removeNulls(obj: any): any {
    return Object.fromEntries(
      Object.entries(obj)
        .filter(([_, v]) => v != null)
        .map(([k, v]) => [k, v === Object(v) ? this.removeNulls(v) : v])
    );
  }

}

@Injectable()
export class CustomDataServiceFactory {
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
