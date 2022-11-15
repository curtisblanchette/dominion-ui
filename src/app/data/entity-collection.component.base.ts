import { Router } from '@angular/router';
import { DefaultDataServiceFactory, EntityCollectionService, EntityCollectionServiceFactory } from '@ngrx/data';
import { map, Observable, of, Subject, take } from 'rxjs';
import { DominionType, types } from '../common/models';
import { EntityCollectionDataService } from '@ngrx/data/src/dataservices/interfaces';
import { UntilDestroy } from '@ngneat/until-destroy';
import { AfterContentInit, Inject, Input, OnDestroy } from '@angular/core';
import { ModuleTypes } from './entity-metadata';
import { FiizSelectComponent } from '../common/components/ui/forms';
import { delay } from 'rxjs/operators';


@UntilDestroy()
export class EntityCollectionComponentBase implements AfterContentInit, OnDestroy {

  public _dynamicCollectionService: EntityCollectionService<DominionType>;
  public _dynamicService: EntityCollectionDataService<DominionType>;

  public type: any;
  public additionalData: any = {};

  public entityMap$: Observable<any> = of([]);
  public count$: Observable<number>;
  public data$: Observable<DominionType[]>;
  public loading$: Observable<boolean>;
  public loaded$: Observable<boolean>;
  public loadingSubject$: Subject<[boolean, boolean, DominionType[]]> = new Subject<any>();

  public response$: Observable<any>;

  public parentContext: any;

  @Input('data') public data: any;
  @Input('options') public options: any;
  @Input('module') public module: ModuleTypes;

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

  /**
   * A lot of classes extended this data collection base
   * we need to get the parent component context to set nonStandard members like items$
   * which aren't available at the child base class
   * @param parentContext
   */
  public setContext(parentContext: any) {
    this.parentContext = parentContext;
  }

  public async ngAfterContentInit() {

    if (this.module) {
      this._dynamicCollectionService = this.createService(this.module, this.entityCollectionServiceFactory);
      this._dynamicService = this.dataServiceFactory.create(this.module);

      this.data$ = this._dynamicCollectionService.filteredEntities$;
      this.loading$ = this._dynamicCollectionService.loading$;
      this.loaded$ = this._dynamicCollectionService.loaded$;
      this.count$ = this._dynamicCollectionService.count$;
    }
  }

  public resolveDropdowns() {
    if(this.parentContext instanceof FiizSelectComponent) {
      if(this.options?.remote) {

        this.parentContext.items$ = this._dynamicService.getWithQuery({}).pipe(
          map((res: any) => {
            return res.map((res: any) => {
              return {id: res.id, label: res.name };
            });
          })
        );
      }
    }
  }


  ngOnDestroy() {
    console.log('entity collection component destroyed');
  }

  public getById(id: string): Observable<any> {

    this.loaded$ = of(false);
    this.loading$ = of(true);
    this.loadingSubject$.next([false, true, []]);
    return this._dynamicService.getById(id).pipe(
      map((res: any) => {
        this.data$ = of(res);
        this.loaded$ = of(true);
        this.loading$ = of(false);
        this.loadingSubject$.next([false, true, res]);
        return res;
      })
    );
  }

  public getWithQuery(params: { [key: string]: any} = {}): Observable<any> {
    this.loaded$ = of(false);
    this.loading$ = of(true);
    this.loadingSubject$.next([true, false, []]);
    return this._dynamicService.getWithQuery(params).pipe(
      map((res: any) => {
        this.count$ = of(res.count);
        this.data$ = of(res.count ? res.rows : res);
        this.loaded$ = of(true);
        this.loading$ = of(false);
        this.loadingSubject$.next([false, true, res.count ? res.rows : res]);
        return res;
      })
    );
  }

  /** return a service that has a dynamic type defined */
  createService<T>(module:string , factory: EntityCollectionServiceFactory): EntityCollectionService<T> {
    return factory.create<T>(module);
  }


}
