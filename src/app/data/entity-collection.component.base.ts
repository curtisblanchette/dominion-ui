import { ModuleType } from '../modules/flow/_core';
import { Lead } from '@4iiz/corev2';
import { Router } from '@angular/router';
import { EntityCollectionService, EntityCollectionServiceFactory } from '@ngrx/data';
import { Observable } from 'rxjs';

export class EntityCollectionComponentBase {
  public _dynamicService: EntityCollectionService<Lead>
  public module: ModuleType;
  public state: any;

  public loaded$: Observable<boolean>;
  public loading$: Observable<boolean>;
  public data$: Observable<Lead[]>;
  public count$: Observable<number>;

  constructor(
    router: Router,
    entityCollectionServiceFactory: EntityCollectionServiceFactory
  ) {
    this.state = router.getCurrentNavigation()!.extras.state;
    this.module = this.state?.module;

    if (this.module) {
      // TODO this type "Lead" should be dynamic
      this._dynamicService = entityCollectionServiceFactory.create<Lead>(this.module);
      this.data$ = this._dynamicService.filteredEntities$;
      this.loading$ = this._dynamicService.loading$;
      this.loaded$ = this._dynamicService.loaded$;
      this.count$ = this._dynamicService.count$;
    }
  }


}
