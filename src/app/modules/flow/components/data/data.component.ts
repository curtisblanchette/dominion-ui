import { Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FlowService } from '../../flow.service';
import { map, Observable } from 'rxjs';
import { Contact, Deal, Lead, Event } from '@4iiz/corev2';

import { ModuleType } from '../../_core/classes/flow.moduleTypes';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DefaultDataServiceFactory } from '@ngrx/data';
import { entityConfig } from '../../../../data/entity-metadata';
import { LeadCollection } from '../../../../data/collections/lead.collection';

@Component({
  templateUrl: './data.component.html',
  styleUrls: ['../../_core/scss/_base.scss', './data.component.scss'],
  providers: [
    LeadCollection
  ]
})
export class DataComponent implements OnInit, OnDestroy {

  public state: any;
  public data: Lead | Contact | Deal | Event;
  public errors$: Observable<any>;
  public module: ModuleType;
  public form: FormGroup;

  loading$: Observable<boolean>;
  data$: Observable<Lead[]>;


  public isLoading = false;
  public errors: any;

  constructor(
    private injector: Injector,
    private flowService: FlowService,
    private fb: FormBuilder,
    private router: Router,
    private dataServiceFactory: DefaultDataServiceFactory,
    private leadService: LeadCollection
  ) {
    this.state = this.router.getCurrentNavigation()!.extras.state;
    this.module = this.state?.module;

    // TODO CHOOSE THE COLLECTION BASED ON THE MODULE


    this.data$ = leadService.entities$;
    this.loading$ = leadService.loading$;

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
    this.leadService.getByKey(this.flowService.cache[this.module].id);
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
    this.leadService.update(o);
  }

  public ngOnDestroy() {
    this.saveData();
  }
}
