import { DefaultDataServiceConfig, DefaultDataServiceFactory, EntityCollectionReducerMethodsFactory, EntityDataModule, EntityDataService, HttpUrlGenerator, PersistenceResultHandler } from '@ngrx/data';
import { NgModule } from '@angular/core';
import { entityConfig } from './entity-metadata';
import { CustomDataService } from './custom.dataservice';
import { PluralHttpUrlGenerator } from './plural.httpUrlGenerator';
import { environment } from '../../environments/environment';

const defaultDataServiceConfig: DefaultDataServiceConfig = {
  root: environment.dominion_api_url, // default root path to the server's web api
  timeout: 3000 // request timeout
};

import { Action } from '@ngrx/store';
import { EntityAction, DefaultPersistenceResultHandler } from '@ngrx/data';

export class AdditionalPersistenceResultHandler extends DefaultPersistenceResultHandler {
  override handleSuccess(originalAction: EntityAction): (data: any) => Action {
    const actionHandler = super.handleSuccess(originalAction);
    return (data: any) => {
      const action = actionHandler.call(this, data);
      if (action && data) {
        (action as any).payload.count = data.count;
        (action as any).payload.data = data.rows;
      }
      return action;
    };
  }
}

import { EntityCollection, EntityDefinition, EntityCollectionReducerMethods } from '@ngrx/data';

export class AdditionalEntityCollectionReducerMethods<T> extends EntityCollectionReducerMethods<T> {
  constructor(public override entityName: string, public override definition: EntityDefinition<T>) {
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
    }
    return ec;
  }
}

import { Injectable } from "@angular/core";
import { EntityDefinitionService, EntityCollectionReducerMethodMap } from '@ngrx/data';

@Injectable()
export class AdditionalEntityCollectionReducerMethodsFactory {
  constructor(private entityDefinitionService: EntityDefinitionService) { }
  create<T>(entityName: string): EntityCollectionReducerMethodMap<T> {
    const definition = this.entityDefinitionService.getDefinition<T>(entityName);
    const methodsClass = new AdditionalEntityCollectionReducerMethods(entityName, definition);
    return methodsClass.methods;
  }
}

@NgModule({
  providers: [
    CustomDataService,
    { provide: DefaultDataServiceConfig, useValue: defaultDataServiceConfig},
    { provide: HttpUrlGenerator, useClass: PluralHttpUrlGenerator},
    {
      provide: PersistenceResultHandler,
      useClass: AdditionalPersistenceResultHandler
    },
    {
      provide: EntityCollectionReducerMethodsFactory,
      useClass: AdditionalEntityCollectionReducerMethodsFactory
    },
  ],
  imports: [
    EntityDataModule.forRoot(entityConfig),
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
