import { Injectable } from '@angular/core';
import { DefaultDataService, DefaultHttpUrlGenerator, DefaultPluralizer, HttpMethods, HttpUrlGenerator, Logger } from '@ngrx/data';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { pluralNames } from '../entity-metadata';
import { Lead } from '@4iiz/corev2';
import { environment } from '../../../environments/environment';

@Injectable()
export class LeadsDataService extends DefaultDataService<Lead> {

  constructor(
    http: HttpClient,
    httpUrlGenerator: HttpUrlGenerator,
    logger: Logger
  ) {
    logger.log(http, httpUrlGenerator);
    const url = new DefaultHttpUrlGenerator(new DefaultPluralizer([pluralNames]));
    url.registerHttpResourceUrls({Label: {entityResourceUrl: 'leads', collectionResourceUrl: 'leads'}});
    super('leads', http, url);
  }

  // override search url as our api trails /search on those resource
  public override getAll(): Observable<any> {
    const url = environment.dominion_api_url + `/leads/search`;
    return super.execute('GET', url, null, {}).pipe(map((response => response.rows)));
  }

  public override getById(key: string | number): Observable<any> {
    const url = environment.dominion_api_url + `/leads/${key}`;
    return super.execute('GET', url, null, {});
  }

  protected override execute(method: HttpMethods, url: string, data?: any, options?: any): Observable<any> {
    return super.execute(method, url, data, options);
  }
}
