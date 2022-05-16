import { AfterViewInit, Component, EventEmitter, OnDestroy, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { FlowService } from '../../../../modules/flow/flow.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DefaultDataServiceFactory, EntityCollectionServiceFactory } from '@ngrx/data';
import { entityConfig } from '../../../../data/entity-metadata';
import { EntityCollectionComponentBase } from '../../../../data/entity-collection.component.base';
import { DominionType, models } from '../../../models';
import { Store } from '@ngrx/store';

import * as fromApp from '../../../../store/app.reducer'
import { FiizSelectComponent } from '../forms';

@Component({
  selector: 'fiiz-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.scss'],
})
export class FiizDataComponent extends EntityCollectionComponentBase implements OnInit, AfterViewInit, OnDestroy {

  public form: FormGroup;
  public controlData: any;

  @ViewChildren('dropdown') dropdowns: QueryList<FiizSelectComponent>;

  @Output('onSuccess') onSuccess: EventEmitter<any> = new EventEmitter<any>();
  @Output('onFailure') onFailure: EventEmitter<Error> = new EventEmitter<Error>();

  constructor(
    private store: Store<fromApp.AppState>,
    private router: Router,
    private entityCollectionServiceFactory: EntityCollectionServiceFactory,
    private dataServiceFactory: DefaultDataServiceFactory,
    private flowService: FlowService,
    private fb: FormBuilder
  ) {
    super(router, entityCollectionServiceFactory, dataServiceFactory);
    this.buildForm(models[this.module]);
  }

  public ngOnInit() {
    if (Object.keys(entityConfig.entityMetadata).includes(this.module)) {
      // this.getData();

    } else {
      throw new Error(`There's no such thing as '${this.module}'`);
    }
  }

  public ngAfterViewInit() {
    this.dropdowns.forEach(dropdown => {
      // instantiate the data services and retrieve data for each dropdown. set the items
      const service = dropdown.createService(dropdown.module, this.entityCollectionServiceFactory);
      service.load();
      dropdown.items$ = service.filteredEntities$ as any;
    });
  }

  public getData(key?: string) {
    this._dynamicCollectionService.getByKey(this.flowService.cache[this.module].id);
  }

  private buildForm(model: { [key: string]: any }) {
    let form: { [key: string]: FormControl } = {};

    for (const [key, control] of Object.entries(model)) {
      form[key] = new FormControl((<any>model)[control.defaultValue], control.validators);
    }
    this.form = this.fb.group(form);
    this.controlData = this.getControlData(this.form, model);
  }

  public getControlData(formGroup: FormGroup, model: any) {
    const controls = [];
    for(const key of Object.keys(formGroup.controls)) {
      if(key !== 'id') {
        controls.push({
          key,
          ...model[key]
        });
      }
    }
    return controls;
  }

  public saveData() {
    if (this.form.valid) {
      const payload = this.form.value;

      this._dynamicCollectionService.add(<DominionType>payload);
    } else {

    }
  }

  public ngOnDestroy() {
  }
}
