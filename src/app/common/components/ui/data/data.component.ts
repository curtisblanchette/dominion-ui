import { ChangeDetectorRef, Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FlowService } from '../../../../modules/flow/flow.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DefaultDataServiceFactory, EntityCollectionServiceFactory } from '@ngrx/data';
import { EntityCollectionComponentBase } from '../../../../data/entity-collection.component.base';
import { DominionType, models } from '../../../models';
import { Store } from '@ngrx/store';

import * as fromApp from '../../../../store/app.reducer'
import { FiizSelectComponent } from '../forms';
import { NavigationService } from '../../../navigation.service';
import * as dayjs from 'dayjs';

@Component({
  selector: 'fiiz-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.scss']
})
export class FiizDataComponent extends EntityCollectionComponentBase implements OnInit, OnDestroy {

  public form: any;
  public controlData: any;
  public submitText: string;
  public id: string | null;

  @ViewChild('submit') submit: ElementRef;
  @ViewChildren('dropdown') dropdowns: QueryList<FiizSelectComponent>;

  @Output('onSuccess') onSuccess: EventEmitter<any> = new EventEmitter<any>();
  @Output('onFailure') onFailure: EventEmitter<Error> = new EventEmitter<Error>();

  constructor(
    private store: Store<fromApp.AppState>,
    private router: Router,
    private route: ActivatedRoute,
    private entityCollectionServiceFactory: EntityCollectionServiceFactory,
    private dataServiceFactory: DefaultDataServiceFactory,
    private flowService: FlowService,
    private fb: FormBuilder,
    public navigation: NavigationService,
    public changeDetector: ChangeDetectorRef
  ) {
    super(router, entityCollectionServiceFactory, dataServiceFactory);

    route.paramMap.subscribe(params => {
      this.id = params.get('id');
      console.log(this.id);
    });

    this.buildForm(models[this.module]);

    this.data$.subscribe(record => {
      let entity: any = record.length && JSON.parse(JSON.stringify(record[0])) || null;

      if (entity) {
        const properties = Object.keys(models[this.module]);
        Object.keys(entity).forEach(prop => {

          if (dayjs(entity[prop]).isValid() && ['day', 'daytime'].includes(models[this.module][prop].type)) {
            entity[prop] = dayjs(entity[prop]).format();
          }

          if (!properties.includes(prop) && prop !== 'id' || prop === 'fullName' || ['updatedAt', 'createdAt'].includes(prop)) {
            delete entity[prop];
          }
        });
        this.form.addControl('id', new FormControl('', Validators.required));
        this.form.setValue(entity);
      }

      this.submitText = entity ? `Save ${this.state.module}` : `Create ${this.state.module}`;
    });

  }

  public ngOnInit() {
    if (this.id !== 'new') {
      this.getData();
    } else {
      // throw new Error(`There's no such thing as '${this.module}'`);
    }
  }

  public getData(key?: string) {
    this._dynamicCollectionService.getByKey(this.id);
  }

  private buildForm(model: { [key: string]: any }) {
    let form: { [key: string]: FormControl } = {};

    for (const [key, control] of Object.entries(model)) {
      if (!['virtual', 'timestamp'].includes(control.type)) {
        form[key] = new FormControl((<any>model)[control.defaultValue], control.validators);
      }

      if (['day', 'daytime'].includes(control.type)) {
        form[key] = new FormControl({value: undefined, disabled: control.disabled}, [
          ...control.validators
          // (control: any) => {
          //   return dayjs(control.value, 'DD-MM-YYYY').isBefore(dayjs()) ? {minDate: 'minDate Invalid'} : undefined
          // },
          // control => this.validationMaxDate && this.config &&
          // dayjs(control.value, 'DD-MM-YYYY' || DemoComponent.getDefaultFormatByMode(this.pickerMode))
          //   .isAfter(this.validationMaxDate)
          //   ? {maxDate: 'maxDate Invalid'} : undefined
        ])
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
        return this._dynamicCollectionService.update(<DominionType>payload).subscribe().add(() => this.form.enable());
      }

      return this._dynamicCollectionService.add(<DominionType>payload).subscribe().add(() => this.resetForm());

    }
  }

  private resetForm() {
    this.form.reset();
    this.form.enable();
  }

  public ngOnDestroy() {
    console.log('data component destroyed');
  }
}
