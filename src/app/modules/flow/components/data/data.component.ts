import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FlowService } from '../../flow.service';
import { Observable } from 'rxjs';
import { Contact, Deal, Lead, Event } from '@4iiz/corev2';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { EntityCollectionServiceFactory } from '@ngrx/data';
import { entityConfig } from '../../../../data/entity-metadata';
import { FlowComponentBase } from '../flow.component.base';

@Component({
  templateUrl: './data.component.html',
  styleUrls: ['../../_core/scss/_base.scss', './data.component.scss'],
})
export class DataComponent extends FlowComponentBase implements OnInit, OnDestroy {
  public data: Lead | Contact | Deal | Event;
  public errors$: Observable<any>;
  public form: FormGroup;

  constructor(
    private router: Router,
    private entityCollectionServiceFactory: EntityCollectionServiceFactory,
    private flowService: FlowService,
    private fb: FormBuilder
  ) {
    super(router, entityCollectionServiceFactory);

    this.data$.subscribe(data => {
      if(data.length > 0) {
        this.buildForm(data[0]);
      }
    })
  }

  public ngOnInit() {
    if (Object.keys(entityConfig.entityMetadata).includes(this.module)) {
      this.getData();
    } else {
      throw new Error(`There's no such thing as '${this.module}'`);
    }
  }

  public getData(key?: string) {
    this._dynamicService.getByKey(this.flowService.cache[this.module].id);
  }

  private buildForm(data: any) {
    let form : { [key:string] : FormControl } = {};
    for (const key of Object.keys(data)) {
      if(!['createdAt', 'updatedAt'].includes(key)) {
        form[key] = new FormControl((<any>data)[key], Validators.required);
      }
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
