import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { FlowService } from '../../../../modules/flow/flow.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DefaultDataServiceFactory, EntityCollectionServiceFactory } from '@ngrx/data';
import { entityConfig } from '../../../../data/entity-metadata';
import { EntityCollectionComponentBase } from '../../../../data/entity-collection.component.base';
import { DominionType, models } from '../../../models';
import { Store } from '@ngrx/store';

import * as fromApp from '../../../../store/app.reducer'
import { FiizSelectComponent } from '../forms';
import { NavigationService } from '../../../navigation.service';

@Component({
  selector: 'fiiz-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.scss']
})
export class FiizDataComponent extends EntityCollectionComponentBase implements OnInit, AfterViewInit, OnDestroy {

  public form: FormGroup;
  public controlData: any;
  public submitText: string;

  @ViewChild('submit') submit: ElementRef;
  @ViewChildren('dropdown') dropdowns: QueryList<FiizSelectComponent>;

  @Output('onSuccess') onSuccess: EventEmitter<any> = new EventEmitter<any>();
  @Output('onFailure') onFailure: EventEmitter<Error> = new EventEmitter<Error>();

  constructor(
    private store: Store<fromApp.AppState>,
    private router: Router,
    private entityCollectionServiceFactory: EntityCollectionServiceFactory,
    private dataServiceFactory: DefaultDataServiceFactory,
    private flowService: FlowService,
    private fb: FormBuilder,
    public navigation: NavigationService,
    public changeDetector: ChangeDetectorRef
  ) {
    super(router, entityCollectionServiceFactory, dataServiceFactory);
    this.submitText = this.state.record ? `Save ${this.state.module}` : `Create ${this.state.module}`;
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

    // instantiate dataService for each dropdown and set options
    this.dropdowns.forEach(dropdown => {
      const service = dropdown.createService(dropdown.module, this.entityCollectionServiceFactory);
      service.load();
      dropdown.items$ = service.filteredEntities$ as any;
    });

    if (this.state.record) {
      const properties = Object.keys(models[this.module]);
      Object.keys(this.state.record).forEach(prop => {
        if (!properties.includes(prop) && prop !== 'id' || prop === 'fullName' || ['updatedAt', 'createdAt'].includes(prop)) {
          delete this.state.record[prop];
        }
      });
      this.form.addControl('id', new FormControl('', Validators.required));
      this.form.setValue(this.state.record);
    }
  }

  public getData(key?: string) {
    this._dynamicCollectionService.getByKey(this.flowService.cache[this.module].id);
  }

  private buildForm(model: { [key: string]: any }) {
    let form: { [key: string]: FormControl } = {};

    for (const [key, control] of Object.entries(model)) {
      if (!['virtual', 'timestamp'].includes(control.type)) {
        form[key] = new FormControl((<any>model)[control.defaultValue], control.validators);
      }

    }
    this.form = this.fb.group(form);
    this.controlData = this.getControlData(this.form, model);
  }

  public getControlData(formGroup: FormGroup, model: any) {
    const controls = [];
    for (const key of Object.keys(formGroup.controls)) {
      if (key !== 'id') {
        controls.push({
          key,
          ...model[key]
        });
      }
    }
    return controls;
  }

  public saveData(): void {
    if (this.form.valid) {
      this.form.disable();

      const payload = this.form.value;

      if (this.state.record) {
        return this._dynamicCollectionService.update(<DominionType>payload).subscribe().add(()=>this.form.enable());
      }

      return this._dynamicCollectionService.add(<DominionType>payload).subscribe().add(()=>this.resetForm());

    }
  }

  private resetForm() {
    this.form.reset();
    this.form.enable();
  }

  public ngOnDestroy() {
  }
}
