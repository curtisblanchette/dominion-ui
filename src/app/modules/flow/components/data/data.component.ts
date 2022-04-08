import { Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FlowService } from '../../flow.service';
import { Observable } from 'rxjs';
import { Contact, Deal, Lead, Event, ILeadDTO, ILead, IContact, IDeal, IEvent } from '@4iiz/corev2';

import { ModuleType } from '../../_core/classes/flow.moduleTypes';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DefaultDataServiceFactory } from '@ngrx/data';
import { EntityCollectionDataService } from '@ngrx/data/src/dataservices/interfaces';
import { entityMetadata } from '../../../../data/entity-metadata';

@Component({
  templateUrl: './data.component.html',
  styleUrls: ['../../_core/scss/_base.scss', './data.component.scss'],
  providers: []
})
export class DataComponent implements OnInit, OnDestroy {

  public state: any;
  public data: Lead | Contact | Deal | Event;
  public loading$: Observable<boolean>;
  public errors$: Observable<any>;
  public module: ModuleType;
  public _dynamicService: EntityCollectionDataService<Lead|Contact|Deal|Event>;
  public form: FormGroup;

  public isLoading = false;
  public errors: any;

  constructor(
    private injector: Injector,
    private flowService: FlowService,
    private fb: FormBuilder,
    private router: Router,
    private dataServiceFactory: DefaultDataServiceFactory
  ) {
    this.state = this.router.getCurrentNavigation()!.extras.state;
    this.module = this.state?.module;
    this._dynamicService = this.dataServiceFactory.create(this.module);
  }

  public ngOnInit() {
    if (Object.keys(entityMetadata).includes(this.module)) {
      this.getData();
    } else {
      throw new Error(`There's no such thing as '${this.module}'`);
    }
  }

  public getData(key?: string) {
    this._dynamicService.getById('47fa4910-0e73-44e4-a724-f02dcb7ff74b').subscribe(res => {
      this.data = res;
      // build the form
      this.buildForm();
    });
  }

  private buildForm() {
    let form : { [key:string] : FormControl } = {};
    for (const key of Object.keys(this.data)) {
      if(!['id', 'createdAt', 'updatedAt'].includes(key) && key.substring(key.length, key.length - 2 ) !== 'Id') {
        form[key] = new FormControl((<any>this.data)[key], Validators.required);
      }
    }
    this.form = this.fb.group(form);
  }

  public getFormControls() {
    const controlNames = [];
    for(const key of Object.keys(this.form.controls)) {
      controlNames.push(key);
    }
    return controlNames;
  }

  public saveData() {
    const payload: { id: string, changes: ILeadDTO } = {
      id: '47fa4910-0e73-44e4-a724-f02dcb7ff74b',
      changes: {
        ...this.form.value,
        practiceAreaId: 1
      }
    }
    this._dynamicService.update(payload).subscribe();
  }

  public ngOnDestroy() {
    this.saveData();
  }
}
