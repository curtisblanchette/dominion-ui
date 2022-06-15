import { AfterContentInit, AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
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
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { delay } from 'rxjs/operators';

export interface IDataOptions {
  controls: boolean;
  state: 'edit' | 'create'
}

@UntilDestroy()
@Component({
  selector: 'fiiz-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.scss']
})
export class FiizDataComponent extends EntityCollectionComponentBase implements AfterContentInit, AfterViewInit, OnDestroy {

  public form: any;
  public controlData: any;
  public submitText: string;
  public id: string | null;

  @Input('data') public override data: any;
  @Input('options') options: IDataOptions = { controls: true, state: 'create' };

  @ViewChild('submit') submit: ElementRef;
  @ViewChildren('dropdown') dropdowns: QueryList<FiizSelectComponent>;

  @Output('onSuccess') onSuccess: EventEmitter<any> = new EventEmitter<any>();
  @Output('onFailure') onFailure: EventEmitter<Error> = new EventEmitter<Error>();
  @Output('isValid') isValid: EventEmitter<boolean> = new EventEmitter<boolean>();

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
  }

  public override ngAfterContentInit() {
    super.ngAfterContentInit();

    if(!this.id) {
      this.id = this.data.id
    }

    this.buildForm(models[this.module]);

    switch(this.options.state) {
      case 'create': {
        this.submitText = `Create New ${this.module}`;
      }
      break;
      case 'edit': {
        this.submitText = `Review ${this.module}`;
      }
      break;
    }

    this.data$.pipe(
      untilDestroyed(this),
      delay(0) // DO NOT REMOVE! -> ensure dropdowns loaded + initial values set
    ).subscribe(record => {
      if(record[0]) {
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
      }
    });

  }

  public ngAfterViewInit() {
    this.dropdowns.forEach(async (dropdown) => {
      const data = await firstValueFrom(this.http.get(`${environment.dominion_api_url}/${uriOverrides[dropdown.module]}`)) as DropdownItem[];
      dropdown.items$ = of(CustomDataService.toDropdownItems(data));
    });

    this._dynamicCollectionService.setFilter({id: this.id}); // clear the filters
    this._dynamicCollectionService.clearCache();

    if (this.id) {
      this.getData();
    }
  }

  public getData() {
    this._dynamicCollectionService.getByKey(this.id);
    this._dynamicCollectionService.setFilter({id: this.id}); // this modifies filteredEntities$ subset
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

    if(this.module === 'lead') {
      this.form.controls.statusId.valueChanges.subscribe((res: number) => {
        let fnName = res === 3 ? 'enable' : 'disable';
        this.form.controls.lostReasonId[fnName]({emitEvent: false});
      });

      this.form.statusChanges.pipe(untilDestroyed(this)).subscribe((valid: 'VALID' | 'INVALID') => {
        this.isValid.next(valid === 'VALID');
      });
    }

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
    const payload = this.form.value;

    if (this.form.valid) {
      this.form.disable();

      if (this.id) {
        return this._dynamicCollectionService.update(<DominionType>payload).subscribe().add(() => this.form.enable());
      }

      return this._dynamicCollectionService.add(<DominionType>payload).subscribe().add(() => this.resetForm());

    }
  }

  public resetForm() {
    this.form.reset();
    this.form.enable();
    this.id = null;
    this._dynamicCollectionService.setFilter({id: this.id}); // clear the filters
    this._dynamicCollectionService.clearCache();
  }

  public override ngOnDestroy() {
    console.log('data component destroyed');
  }
}
