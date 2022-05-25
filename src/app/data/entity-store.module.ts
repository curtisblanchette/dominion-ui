import {
  DefaultDataServiceConfig,
  DefaultDataServiceFactory,
  DefaultPersistenceResultHandler,
  EntityAction,
  EntityCollection,
  EntityCollectionReducerMethods,
  EntityCollectionReducerMethodsFactory,
  EntityCollectionReducerMethodMap,
  EntityDefinitionService,
  EntityDefinition,
  EntityDataModule,
  EntityDataService,
  HttpUrlGenerator,
  PersistenceResultHandler, DefaultDataService
} from '@ngrx/data';
import { Action } from '@ngrx/store';
import { NgModule, Injectable } from '@angular/core';
import { entityConfig } from './entity-metadata';
import { CustomDataService, CustomDataServiceFactory } from './custom.dataservice';
import { PluralHttpUrlGenerator } from './plural.httpUrlGenerator';
import { environment } from '../../environments/environment';

const defaultDataServiceConfig: DefaultDataServiceConfig = {
  root: environment.dominion_api_url, // default root path to the server's web api
  timeout: 3000 // request timeout
};

@Injectable()
export class AdditionalPersistenceResultHandler extends DefaultPersistenceResultHandler {
  override handleSuccess(originalAction: EntityAction): (data: any) => Action {
    const actionHandler = super.handleSuccess(originalAction);
    const page = originalAction.payload.data?.page! || 0;
    return (data: any) => {
      const action = actionHandler.call(this, data);
      // check for rows | a collection or not
      // single entity adds/updates should remain unchanged
      if (action && data && data.rows) {
        (action as any).payload.count = data.count;
        (action as any).payload.data = data.rows;
        (action as any).payload.page = parseInt(page, 0);
      }

      return action;
    };
  }
}

export class AdditionalEntityCollectionReducerMethods<T> extends EntityCollectionReducerMethods<T> {
  constructor(
    public override entityName: string,
    public override definition: EntityDefinition<T>
  ) {
    super(entityName, definition);
  }

  protected override queryManySuccess(
    collection: EntityCollection<T>,
    action: EntityAction<T[]>
  ): EntityCollection<T> {
    const ec = super.queryManySuccess(collection, action);
    if (action.payload as any) {
      (ec as any).count = (action.payload as any).count;
      (ec as any).data = (action.payload as any).data;
      (ec as any).page = (action.payload as any).page;
    }
    return ec;
  }
}

@Injectable()
export class AdditionalEntityCollectionReducerMethodsFactory {
  constructor(
    private entityDefinitionService: EntityDefinitionService
  ) {
  }

  create<T>(entityName: string): EntityCollectionReducerMethodMap<T> {
    const definition = this.entityDefinitionService.getDefinition<T>(entityName);
    const methodsClass = new AdditionalEntityCollectionReducerMethods(entityName, definition);
    return methodsClass.methods;
  }
}

@NgModule({
  providers: [
    { provide: DefaultDataServiceConfig, useValue: defaultDataServiceConfig },
    { provide: DefaultDataService, useClass: CustomDataService },
    { provide: DefaultDataServiceFactory, useClass: CustomDataServiceFactory },
    { provide: HttpUrlGenerator, useClass: PluralHttpUrlGenerator },
    { provide: PersistenceResultHandler, useClass: AdditionalPersistenceResultHandler },
    { provide: EntityCollectionReducerMethodsFactory, useClass: AdditionalEntityCollectionReducerMethodsFactory }
  ],
  imports: [
    EntityDataModule.forRoot(entityConfig)
  ]
})
export class EntityStoreModule {
  constructor(
    entityDataService: EntityDataService,
    private dataServiceFactory: DefaultDataServiceFactory
  ) {
    entityDataService.registerService('lead', this.dataServiceFactory.create('lead'));
  }
}
