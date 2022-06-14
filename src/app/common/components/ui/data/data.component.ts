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

export interface IDataOptions {
  controls: boolean;
}


@UntilDestroy()
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

  @Input('data') public override data: any;
  @Input('options') options: IDataOptions = { controls: true };

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

  public ngOnInit() {
  }

  public override ngAfterContentInit() {
    super.ngAfterContentInit();

    this.id = this.data.id

    this.buildForm(models[this.module]);

    this.submitText = this.id ? `Save ${this.module}` : `Create ${this.module}`;

    this.data$.pipe(
      untilDestroyed(this),
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

    this.form.controls.statusId.valueChanges.subscribe((res: number) => {
      let fnName = res === 3 ? 'enable' : 'disable';
      this.form.controls.lostReasonId[fnName]({emitEvent: false});
    });

    this.form.statusChanges.pipe(untilDestroyed(this)).subscribe((valid: 'VALID' | 'INVALID') => {
      this.isValid.next(valid === 'VALID');
    });

  }



  public ngAfterViewInit() {
    this.dropdowns.forEach(async (dropdown) => {
      const data = await firstValueFrom(this.http.get(`${environment.dominion_api_url}/${uriOverrides[dropdown.module]}`)) as DropdownItem[];
      dropdown.items$ = of(CustomDataService.toDropdownItems(data));
    });

    if (this.id !== 'new') {
      this.getData();
    }
  }

  public getData(key?: string) {
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

  private resetForm() {
    this.form.reset();
    this.form.enable();
  }

  public override ngOnDestroy() {
    console.log('data component destroyed');
  }
}
