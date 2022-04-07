import { Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FlowService } from '../../flow.service';
import { Observable } from 'rxjs';
import { Contact, Deal, Lead, Event } from '@4iiz/corev2';
import { LeadCollection } from '../../../../data/collections/lead.collection';
import { ContactCollection } from '../../../../data/collections/contact.collection';
import { EventCollection } from '../../../../data/collections/event.collection';
import { DealCollection } from '../../../../data/collections/deal.collection';
import { ModuleCollectionMap } from '../../../../data/collections';
import { ModuleType } from '../../_core/classes/flow.moduleTypes';
import { FormBuilder } from '@angular/forms';
import { EntityCollectionServiceBase } from '@ngrx/data/src/entity-services/entity-collection-service-base';
import { Store } from '@ngrx/store';

@Component({
  templateUrl: './data.component.html',
  styleUrls: ['../../_core/scss/_base.scss', './data.component.scss'],
  providers: [
    ContactCollection,
    LeadCollection,
    EventCollection,
    DealCollection
  ]
})
export class DataComponent implements OnInit, OnDestroy {

  public state: any;
  public data$: Observable<(Lead | Contact | Deal | Event)[]> | Store<(Lead | Contact | Deal | Event)[]>;
  public loading$: Observable<boolean>;
  public module: ModuleType = ModuleType.LEAD;
  public _dynamicService: EntityCollectionServiceBase<Lead|Contact|Deal|Event>;

  public isLoading = false;
  public data: Lead|Contact|Deal|Event;

  constructor(
    private injector: Injector,
    private flowService: FlowService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.state = this.router.getCurrentNavigation()!.extras.state;
    this.module = this.state?.module;
  }

  public ngOnInit() {
    if (ModuleCollectionMap.hasOwnProperty(this.module)) {
      this._dynamicService = this.injector.get<any>(ModuleCollectionMap[this.module]);

      this.data$ = this._dynamicService.entities$;
      this.loading$ = this._dynamicService.loading$;

      this.data$.subscribe((record:any) => {
        this.data = record[0];
      });

      this.loading$.subscribe((loading: boolean) => {
        this.isLoading = loading;
      });

      this.getData();

    } else {
      throw new Error(`There's no such thing as '${this.module}'`);
    }
  }

  public getData(key?: string) {
    this._dynamicService.getByKey('47fa4910-0e73-44e4-a724-f02dcb7ff74b');
  }

  public saveData() {
    this._dynamicService.update(this.data);
  }

  public ngOnDestroy() {
    this.saveData();
  }
}
