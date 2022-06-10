import { AfterContentInit, AfterViewInit, Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FlowService } from '../../../../modules/flow/flow.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DefaultDataServiceFactory, EntityCollectionServiceFactory } from '@ngrx/data';
import { DominionType, models } from '../../../models';
import { Store } from '@ngrx/store';

import * as fromApp from '../../../../store/app.reducer'
import { DropdownItem, FiizSelectComponent } from '../forms';
import { NavigationService } from '../../../navigation.service';
import * as dayjs from 'dayjs';
import { EntityCollectionComponentBase } from '../../../../data/entity-collection.component.base';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { uriOverrides } from '../../../../data/entity-metadata';
import { firstValueFrom, of } from 'rxjs';
import { CustomDataService } from '../../../../data/custom.dataservice';

@Component({
  selector: 'fiiz-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.scss']
})
export class FiizDataComponent extends EntityCollectionComponentBase implements OnInit, AfterContentInit, AfterViewInit, OnDestroy {

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
    private route: ActivatedRoute,

    private flowService: FlowService,
    private fb: FormBuilder,
    public navigation: NavigationService,
    private http: HttpClient,
    entityCollectionServiceFactory: EntityCollectionServiceFactory,
    dataServiceFactory: DefaultDataServiceFactory,
    router: Router,
  ) {
    super(router, entityCollectionServiceFactory, dataServiceFactory);

    route.paramMap.subscribe(params => {
      this.id = params.get('id');
    });

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


    });

  }

  public ngOnInit() {

  }

  public ngAfterViewInit() {
    this.dropdowns.forEach(async (dropdown) => {
      const data = await firstValueFrom(this.http.get(`${environment.dominion_api_url}/${uriOverrides[dropdown.module]}`)) as DropdownItem[];
      dropdown.items$ = of(CustomDataService.toDropdownItems(data));
    });
  }

  public override ngAfterContentInit() {
    super.ngAfterContentInit();
    this.buildForm(models[this.module]);
    this.submitText = this.id ? `Save ${this.data.module}` : `Create ${this.data.module}`;

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

      // if (this.state.record) {
      //   return this._dynamicCollectionService.update(<DominionType>payload).subscribe().add(() => this.form.enable());
      // }

      return this._dynamicCollectionService.add(<DominionType>payload).subscribe().add(() => this.resetForm());

    }
  }

  private resetForm() {
    this.form.reset();
    this.form.enable();
  }

  public override ngOnDestroy() {
    console.log('data component destroyed');
  }
}
