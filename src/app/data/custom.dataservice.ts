import { Inject, Injectable } from '@angular/core';
import { DefaultDataService, DefaultDataServiceConfig, HttpUrlGenerator, QueryParams } from '@ngrx/data';
import { HttpClient } from '@angular/common/http';
import { map, Observable, of, tap } from 'rxjs';
import { ILeadDTO, Lead } from '@4iiz/corev2';
import { Update } from '@ngrx/entity';

@Injectable({
  providedIn: 'root'
})
export class ExtendedDataService<T> extends DefaultDataService<T> {

  constructor(
    @Inject('entityName') entityName: string,
    http: HttpClient,
    httpUrlGenerator: HttpUrlGenerator,
    config?: DefaultDataServiceConfig) {
    super(entityName, http, httpUrlGenerator, config);
  }
  // override parent class members here
  // override update(payload: Update<T>): Observable<T> {
  //   return super.update(payload);
  // }

}
