import { Inject, Injectable, Optional } from '@angular/core';
import { DefaultDataService, DefaultDataServiceConfig, DefaultDataServiceFactory, EntityCollectionDataService, HttpUrlGenerator, QueryParams } from '@ngrx/data';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable, of, tap } from 'rxjs';

@Injectable()
export class CustomDataService<T> extends DefaultDataService<T> {

  private totalRecords:number = 0;

  constructor(
    @Inject('entityName') entityName: string,
    http: HttpClient,
    httpUrlGenerator: HttpUrlGenerator,
    config?: DefaultDataServiceConfig
  ) {
    super(entityName, http, httpUrlGenerator, config);
  }

  override getWithQuery(queryParams: string | QueryParams): Observable<any> {
    const qParams = typeof queryParams === 'string' ? { fromString: queryParams } : { fromObject: queryParams };
    const params = new HttpParams(qParams);
    
    return this.execute('GET', this.entitiesUrl, undefined, { params }).pipe(
      tap(response => {
        this.totalRecords = response['count'];
      })
      // map(response => response)
    );
    // return of();
  }

   totalCount() {
    return this.totalRecords;
  }

}

@Injectable()
export class CustomDataServiceFactory extends DefaultDataServiceFactory {
  constructor(
    http: HttpClient,
    httpUrlGenerator: HttpUrlGenerator,
    @Optional() config?: DefaultDataServiceConfig
  ) {
    super(http, httpUrlGenerator, config);
  }

  override create<T>(entityName: string): EntityCollectionDataService<T> {
    return new CustomDataService<T>(
      entityName,
      this.http,
      this.httpUrlGenerator,
      this.config
    );
  }
}
