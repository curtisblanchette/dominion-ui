import { Inject, Injectable, Optional } from '@angular/core';
import { DefaultDataService, DefaultDataServiceConfig, DefaultDataServiceFactory, EntityCollectionDataService, HttpUrlGenerator, QueryParams } from '@ngrx/data';
import { DominionType } from '../common/models';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap, map } from 'rxjs';

@Injectable()
export class CustomDataService<T> extends DefaultDataService<T> {

  private totalRecords:number = 0;

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
  
  override getWithQuery(queryParams: string | QueryParams): Observable<any> {
    const qParams = typeof queryParams === 'string' ? { fromString: queryParams } : { fromObject: queryParams };
    const params = new HttpParams(qParams);
    
    return this.execute('GET', this.entitiesUrl, undefined, { params }).pipe(
      tap(response => {
        this.totalRecords = response['count'];
      }),
      map((res: any) => res)
    );

  }

   totalCount() {
    return this.totalRecords;
  }

}

@Injectable()
export class CustomDataServiceFactory extends DefaultDataServiceFactory {
  override http: HttpClient;
  override config: DefaultDataServiceConfig | undefined;
  override httpUrlGenerator: HttpUrlGenerator;
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
