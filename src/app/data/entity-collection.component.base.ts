import { ModuleType } from '../modules/flow/_core';
import { Router } from '@angular/router';
import { DefaultDataServiceFactory, EntityCollectionService, EntityCollectionServiceFactory } from '@ngrx/data';
import { map, Observable, of, Subject } from 'rxjs';
import { DominionType, types } from '../common/models';
import { EntityCollectionDataService } from '@ngrx/data/src/dataservices/interfaces';
import { UntilDestroy } from '@ngneat/until-destroy';
import { AfterContentInit, Inject, Input, OnDestroy } from '@angular/core';

@UntilDestroy()
export class EntityCollectionComponentBase implements AfterContentInit, OnDestroy {

  public _dynamicCollectionService: EntityCollectionService<DominionType>;
  public _dynamicService: EntityCollectionDataService<DominionType>;

  public type: any;
  public additionalData: any;

  public entityMap$: Observable<any> = of([]);
  public count$: Observable<number> = of(0);
  public data$: Observable<DominionType[]> = of([]);
  public loading$: Observable<boolean> = of(false);
  public loaded$: Observable<boolean> = of(true);
  public loadingSubject$: Subject<any> = new Subject<any>();

  public response$: Observable<any>;
  @Input('data') public data: any;
  @Input('options') public options: any;
  @Input('module') public module: ModuleType;

  constructor(
    router: Router,
    @Inject(EntityCollectionServiceFactory) private entityCollectionServiceFactory: EntityCollectionServiceFactory,
    @Inject(DefaultDataServiceFactory) private dataServiceFactory: DefaultDataServiceFactory
  ) {
    const state = (<any>router.getCurrentNavigation()?.extras.state);

    if (state && Object.keys(state).length) {
      this.module = state.module;
      this.options = state.options;
      this.data = state.data;
    }

  }

  public async ngAfterContentInit() {
    if( this.data ){

      if (this.module) {
        this._dynamicCollectionService = this.createService(types[this.module], this.entityCollectionServiceFactory);
        this._dynamicService = this.dataServiceFactory.create(this.module);

        this.data$ = this._dynamicCollectionService.filteredEntities$;
        this.loading$ = this._dynamicCollectionService.loading$;
        this.loaded$ = this._dynamicCollectionService.loaded$;
        this.count$ = this._dynamicCollectionService.count$; // <-- ** always returns the filteredEntities$.length (not the collectionState.count)
      }

      if(this.data.resolveAdditionalData && typeof this.data.resolveAdditionalData === 'function') {
        /**
         * if the step was passed an additionalData <Promise> resolve it now
         */
        this.additionalData = await this.data.resolveAdditionalData();
      }
    }
  }


  ngOnDestroy() {
    this.data$ = of([]);
    console.log('entity collection component destroyed');
  }

  public getById(id: string): Observable<any> {

    this.loadingSubject$.next(true);
    this.loaded$ = of(false);
    this.loading$ = of(true);
    return this._dynamicService.getById(id).pipe(
      map((res: any) => {
        this.data$ = of(res);
        this.loadingSubject$.next(false);
        this.loaded$ = of(true);
        this.loading$ = of(false);
        return res;
      })
    );
  }

  public getWithQuery(params: { [key: string]: any}): Observable<any> {
    this.loaded$ = of(false);
    this.loading$ = of(true);
    this.loadingSubject$.next(true);
    return this._dynamicService.getWithQuery(params).pipe(
      map((res: any) => {
        this.count$ = of(res.count);
        this.data$ = of(res.count ? res.rows : res);
        this.loaded$ = of(true);
        this.loading$ = of(false);
        this.loadingSubject$.next(false);
        return res;
      })
    );
  }

  /** return a service that has a dynamic type defined */
  createService<T>(module: T, factory: EntityCollectionServiceFactory): EntityCollectionService<T> {
    return factory.create<T>(this.module);
  }


}
