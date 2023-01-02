import { Inject, Injectable, Optional } from '@angular/core';
import { DefaultDataService, DefaultDataServiceConfig, DefaultDataServiceFactory, HttpUrlGenerator, QueryParams } from '@ngrx/data';
import { DominionType } from '../common/models';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, map, mergeMap, Observable, of, tap } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Update } from '@ngrx/entity';
import { LookupTypes, ModuleTypes } from './entity-metadata';

@Injectable()
export class CustomDataService<T> extends DefaultDataService<T> {

  public data$: Observable<DominionType[]>;
  public count$: Observable<number>;

  constructor(
    @Inject('entityName') entityName: string,
    http: HttpClient,
    httpUrlGenerator: HttpUrlGenerator,
    private toastr: ToastrService,
    config?: DefaultDataServiceConfig,
  ) {
    super(
      entityName,
      http,
      httpUrlGenerator,
      config
    );
  }

  async convertLead(entity: Partial<DominionType>, notify: boolean = true) {
    if(this.entityName !== ModuleTypes.LEAD) {
      throw new Error('Cannot convert a non-Lead');
    }
    return firstValueFrom( super.execute('POST', `${this.entityUrl}${entity.id}/convert-lead`) );
  }

  override add(entity: Partial<T>, notify: boolean = true) {
    const data = this.removeNulls(entity);
    const entityLabel = this.entityName[0].toUpperCase() + this.entityName.substring(1, this.entityName.length)

    /**
      * Use this dummy observable to add arbitrary delays to requests
      * sometimes they are too fast for what you're testing
      */
    return of('dummy-delay').pipe(
      // delay(2000),
      mergeMap(() => super.add(data)),
      tap((res: any) => {
        notify && this.toastr.success(`${entityLabel} Created`);
      })
    );
  }

  override update(entity: Update<T>, notify: boolean = true) {
    // const data = this.removeNulls(entity);
    const data = entity;
    const entityLabel = this.entityName[0].toUpperCase() + this.entityName.substring(1, this.entityName.length)

    return of('dummy-delay').pipe(
      // delay(2000),
      mergeMap(() => super.update(data)),
      tap((res: any) => {
        notify && this.toastr.success(`${entityLabel} Updated`)
      })
    )
  }

  override getAll(): Observable<T[]> {
    // transform lookups into DropDownItem's
    if((<string[]>Object.values(LookupTypes)).includes(this.entityName)) {
      return super.getAll().pipe(map((res: any) => CustomDataService.toDropdownItems(res)));
    }
    return super.getAll();
  }

  override getById(id: string | number): Observable<T> {
    return super.getById(id);
  }

  override getWithQuery(params: string | QueryParams): Observable<T[]> {
    return super.getWithQuery(params);
  }

  public static toDropdownItems(items: {[key:string]: any}[]): any {
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
export class CustomDataServiceFactory extends DefaultDataServiceFactory {
  override http: HttpClient;
  override config: DefaultDataServiceConfig | undefined;
  override httpUrlGenerator: HttpUrlGenerator;
  constructor(
    http: HttpClient,
    httpUrlGenerator: HttpUrlGenerator,
    private toastr: ToastrService,
    @Optional() config?: DefaultDataServiceConfig
  ) {
    super(http, httpUrlGenerator, config);
  }

  override create<T>(entityName: string): CustomDataService<T> {
    return new CustomDataService<T>(
      entityName,
      this.http,
      this.httpUrlGenerator,
      this.toastr,
      this.config
    );
  }
}
