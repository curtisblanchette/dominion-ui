import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FlowService } from '../../../../modules/flow/flow.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { EntityCollectionServiceFactory } from '@ngrx/data';
import { entityConfig } from '../../../../data/entity-metadata';
import { EntityCollectionComponentBase } from '../../../../data/entity-collection.component.base';
import { models } from '../../../models';

@Component({
  selector: 'fiiz-data',
  templateUrl: './data.component.html',
  styleUrls: ['../../../../modules/flow/_core/step-components/_base.scss', './data.component.scss'],
})
export class FiizDataComponent extends EntityCollectionComponentBase implements OnInit, OnDestroy {

  public form: FormGroup;

  constructor(
    private router: Router,
    private entityCollectionServiceFactory: EntityCollectionServiceFactory,
    private flowService: FlowService,
    private fb: FormBuilder
  ) {
    super(router, entityCollectionServiceFactory);
    this.buildForm(models[this.module]);

    this.data$.subscribe(data => {
      if(data.length > 1) {

      }
    })
  }

  public ngOnInit() {
    if (Object.keys(entityConfig.entityMetadata).includes(this.module)) {
      // this.getData();
    } else {
      throw new Error(`There's no such thing as '${this.module}'`);
    }
  }

  public getData(key?: string) {
    this._dynamicService.getByKey(this.flowService.cache[this.module].id);
  }

  private buildForm(model: { [key: string]: any }) {
    let form : { [key:string] : FormControl } = {};

    for (const [key, control] of Object.entries(model)) {
      form[key] = new FormControl((<any>model)[control.defaultValue], control.validators);
    }
    this.form = this.fb.group(form);
  }

  public getFormControls() {
    const controlNames = [];
    for(const key of Object.keys(this.form.controls)) {
      if(key !== 'id') {
        controlNames.push(key);
      }
    }
    return controlNames;
  }

  public saveData() {
    // remove null values from form
    let o = Object.fromEntries(Object.entries(this.form.value).filter(([_, v]) => v != null));
    this._dynamicService.update(o);
    this.flowService.addToCache(this.module, o);
  }

  public ngOnDestroy() {
    this.saveData();
  }
}
