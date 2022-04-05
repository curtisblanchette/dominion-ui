import { Injectable } from '@angular/core';
import { DefaultDataService, DefaultHttpUrlGenerator, DefaultPluralizer, HttpMethods, HttpUrlGenerator, Logger } from '@ngrx/data';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { pluralNames } from './entity-metadata';
import { Lead } from '@4iiz/corev2';
import { environment } from '../../../../../environments/environment';
import { CognitoService } from '../../../../common/cognito/cognito.service';
import { CognitoUserSession } from 'amazon-cognito-identity-js';

@Injectable()
export class LeadsDataService extends DefaultDataService<Lead> {
  public cognitoService: CognitoService;
  public cognitoSession: CognitoUserSession;

  constructor(
    http: HttpClient,
    httpUrlGenerator: HttpUrlGenerator,
    logger: Logger,
    cognitoService: CognitoService
  ) {
    logger.log(http, httpUrlGenerator);
    const url = new DefaultHttpUrlGenerator(new DefaultPluralizer([pluralNames]));
    url.registerHttpResourceUrls({Label: {entityResourceUrl: 'lead', collectionResourceUrl: 'leads'}});
    super('Lead', http, url);

    this.cognitoSession = cognitoService.cognitoUserSession;
  }

  protected override execute(method: HttpMethods, url: string, data?: any, options?: any): Observable<any> {
    if (method === 'GET') {
      url = environment.dominion_api_url + '/leads/search'; // where 1 will be replaced dynamically
    }


    return super.execute(method, url, null, options);
  }
}
