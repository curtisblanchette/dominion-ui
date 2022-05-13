import { Inject, Injectable, Optional } from '@angular/core';
import { DefaultDataService, DefaultDataServiceConfig, EntityCollectionDataService, HttpUrlGenerator, QueryParams } from '@ngrx/data';
import { HttpClient } from '@angular/common/http';
import { DominionType } from '../common/models';
import { map, Observable } from 'rxjs';

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

  override getAll(): Observable<T[]> {

    if(['role', 'practiceArea'].includes(this.entityName)) {
      return super.getAll().pipe(map(this.toDropdownItems));
    }
    return super.getAll();
  }

  override getById(id: string | number): Observable<T> {
    return super.getById(id);
  }

  override getWithQuery(params: string | QueryParams): Observable<T[]> {
    return super.getWithQuery(params);
  }

  toDropdownItems(items: {[key:string]: any}[]): any {
    // return { ...hero, dateLoaded: new Date() };
    return items.map((item: any) => { return { id: item.id, label: item.name }});
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
