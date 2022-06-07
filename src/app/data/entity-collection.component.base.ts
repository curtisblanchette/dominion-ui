import { ModuleType } from '../modules/flow/_core';
import { Router } from '@angular/router';
import { DefaultDataServiceFactory, EntityCollectionService, EntityCollectionServiceFactory } from '@ngrx/data';
import { map, Observable, of } from 'rxjs';
import { DominionType, types } from '../common/models';
import { EntityCollectionDataService } from '@ngrx/data/src/dataservices/interfaces';
import { UntilDestroy } from '@ngneat/until-destroy';
import { AfterContentInit, Inject, Input, OnDestroy } from '@angular/core';

@UntilDestroy()
export class EntityCollectionComponentBase implements AfterContentInit, OnDestroy {

  public _dynamicCollectionService: EntityCollectionService<DominionType>;
  public _dynamicService: EntityCollectionDataService<DominionType>;

  public module: ModuleType;
  public type: any;

  public count$: Observable<number> = of(0);
  public data$: Observable<DominionType[]> = of([]);
  public loading$: Observable<boolean> = of(false);
  public loaded$: Observable<boolean> = of(true);

  public response$: Observable<any>;
  @Input('data') public data: any;

  constructor(
    router: Router,
    @Inject(EntityCollectionServiceFactory) private entityCollectionServiceFactory: EntityCollectionServiceFactory,
    @Inject(DefaultDataServiceFactory) private dataServiceFactory: DefaultDataServiceFactory
  ) {
    this.data = router.getCurrentNavigation()?.extras.state || this.data;
  }

  public ngAfterContentInit() {
    if( this.data ){
      this.module = this.data?.module;

      this.type = types[this.data.module];

      if (this.module) {
        this._dynamicCollectionService = this.createService(this.type, this.entityCollectionServiceFactory);
        this._dynamicService = this.dataServiceFactory.create(this.module);

        // this.data$ = this._dynamicCollectionService.filteredEntities$;
        this.loading$ = this._dynamicCollectionService.loading$;
        // this.loaded$ = this._dynamicCollectionService.loaded$;
        // this.count$ = this._dynamicCollectionService.count$; <-- ** always returns the filteredEntities$.length (not the collectionState.count)
      }
    }
  }

  ngOnDestroy() {
    console.log('component destroyed');
  }


  public getWithQuery(params: { [key: string]: any}): Observable<any> {
    this.loaded$ = of(false);
    this.loading$ = of(true);
    return this._dynamicService.getWithQuery(params).pipe(
      map((res: any) => {
        this.count$ = of(res.count);
        this.data$ = of(res.rows);
        this.loaded$ = of(true);
        this.loading$ = of(false);
        return res;
      })
    );
  }

  /** return a service that has a dynamic type defined */
  createService<T>(module: T, factory: EntityCollectionServiceFactory): EntityCollectionService<T> {
    return factory.create<T>(this.module);
  }


}
