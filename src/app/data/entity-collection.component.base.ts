import { ModuleType } from '../modules/flow/_core';
import { Router } from '@angular/router';
import { DefaultDataServiceFactory, EntityCollectionService, EntityCollectionServiceFactory } from '@ngrx/data';
import { map, Observable, of } from 'rxjs';
import { DominionType, types } from '../common/models';
import { EntityCollectionDataService } from '@ngrx/data/src/dataservices/interfaces';

export class EntityCollectionComponentBase {

  public _dynamicCollectionService: EntityCollectionService<DominionType>;

  public _dynamicService: EntityCollectionDataService<DominionType>;

  public module: ModuleType;
  public type: any;
  public state: any;

  public count$: Observable<number>;
  public data$: Observable<any>;
  public loaded$: Observable<boolean>;
  public loading$: Observable<boolean>;

  public response$: Observable<any>;

  constructor(
    router: Router,
    entityCollectionServiceFactory: EntityCollectionServiceFactory,
    dataServiceFactory: DefaultDataServiceFactory
  ) {
    this.state = router.getCurrentNavigation()?.extras.state || {};
    this.module = this.state?.module || this.module;
    this.type = types[this.module];
    if (this.module) {
      this._dynamicCollectionService = this.createService(this.type, entityCollectionServiceFactory);
      this._dynamicService = dataServiceFactory.create(this.module);

      // this.data$ = this._dynamicCollectionService.filteredEntities$;
      // this.loading$ = this._dynamicCollectionService.loading$;
      // this.loaded$ = this._dynamicCollectionService.loaded$;
      // this.count$ = this._dynamicCollectionService.count$; <-- ** always returns the filteredEntities$.length (not the collectionState.count)
    }
  }

  public getWithQuery(params: { [key: string]: any}): Observable<any> {
    return this._dynamicService.getWithQuery(params).pipe(
      map((res: any) => {
        this.count$ = of(res.count);
        this.data$ = of(res.rows);
        return res;
      })
    );
  }

  /** return a service that has a dynamic type defined */
  createService<T>(module: T, factory: EntityCollectionServiceFactory): EntityCollectionService<T> {
    return factory.create<T>(this.module);
  }


}
