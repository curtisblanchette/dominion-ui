import { AfterContentInit, AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DefaultDataServiceFactory, EntityCollectionServiceFactory } from '@ngrx/data';
import { DominionType, models } from '../../../models';
import { Store } from '@ngrx/store';

import * as fromApp from '../../../../store/app.reducer'
import { FiizDatePickerComponent, FiizInputComponent, FiizSelectComponent } from '../forms';
import { NavigationService } from '../../../navigation.service';
import * as dayjs from 'dayjs';
import { ManipulateType } from 'dayjs';
import { EntityCollectionComponentBase } from '../../../../data/entity-collection.component.base';
import { HttpClient } from '@angular/common/http';
import { ModuleTypes } from '../../../../data/entity-metadata';
import { combineLatest, lastValueFrom, Observable, of, take } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { delay } from 'rxjs/operators';
import * as fromFlow from '../../../../modules/flow/store/flow.reducer';
import { FormInvalidError } from '../../../../modules/flow';

import { Fields as LeadFields } from '../../../models/lead.model';
import { Fields as DealFields } from '../../../models/deal.model';
import { INestedSetting } from '../../../../store/app.effects';

export interface FiizDataComponentOptions {
  controls?: boolean;
  state: 'edit' | 'create';
  dictation?: string;
  fields: Array<string>;
}

@UntilDestroy()
@Component({
  selector: 'fiiz-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.scss']
})
export class FiizDataComponent extends EntityCollectionComponentBase implements AfterContentInit, AfterViewInit, OnDestroy {

  public form: FormGroup;
  public controlData: any;

  public submitText: string;
  public id: string | null;

  public configuration:any = {
    // Events, Calls
    'startTime' : {
      min : dayjs().format(), // Default as now
      max : null
    },
    'endTime' : {
      min : null,
      max : null
    },
    // Campaigns
    'startDate' : {
      min : null,
      max : null
    },
    'endDate' : {
      min : null,
      max : null
    }
  };

  public appointmentSettings: INestedSetting;
  public awaitValidations$: Observable<any>;

  @Input('module') public override module: ModuleTypes;
  @Input('data') public override data: any;
  @Input('options') public override options: FiizDataComponentOptions = { controls: true, state: 'create', dictation: '', fields: [] };

  @ViewChild('submit') submit: ElementRef;
  @ViewChildren('dropdown') dropdowns: QueryList<FiizSelectComponent>;
  @ViewChildren('picker') pickers: QueryList<FiizDatePickerComponent>;

  @Output('onSuccess') onSuccess: EventEmitter<any> = new EventEmitter<any>();
  @Output('onFailure') onFailure: EventEmitter<Error> = new EventEmitter<Error>();
  @Output('isValid') isValid: EventEmitter<boolean> = new EventEmitter<boolean>();

  @ViewChildren('inputList') inputList: QueryList<FiizInputComponent>

  constructor(
    private store: Store<fromApp.AppState>,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    public navigation: NavigationService,
    private http: HttpClient,
    entityCollectionServiceFactory: EntityCollectionServiceFactory,
    dataServiceFactory: DefaultDataServiceFactory,
    router: Router
  ) {
    super(router, entityCollectionServiceFactory, dataServiceFactory);
    route.paramMap.pipe(untilDestroyed(this)).subscribe(params => {
      this.id = params.get('id');
    });

    const state = (<any>router.getCurrentNavigation()?.extras.state);
    if(state && Object.keys(state).length) {
      this.options = state.options;
      this.module = state.module;
      this.data = state.data;
    }
    this.form = this.fb.group({});

    this.store.select(fromApp.selectSettingGroup('appointment')).pipe(untilDestroyed(this)).subscribe((settings: INestedSetting) => {
      this.appointmentSettings = settings;
    });

  }

  public override async ngAfterContentInit() {
    await super.ngAfterContentInit();

    if (!this.id) {
      this.id = this.data.id
    }

    switch (this.options.state) {
      case 'create': {
        this.submitText = `Create New ${this.module}`;
      }
        break;
      case 'edit': {
        this.submitText = `Save ${this.module}`;
      }
        break;
    }

    this.buildForm(this.options.fields);

    this.data$.pipe(
      untilDestroyed(this),
      delay(0) // DO NOT REMOVE! -> ensure dropdowns loaded + initial values set
    ).pipe(untilDestroyed(this)).subscribe(async (record: any) => {
      if (record[0]) {
        let entity: any = record.length && JSON.parse(JSON.stringify(record[0])) || null;

        if (entity) {
          const properties = this.options.fields;

          Object.keys(entity).forEach(prop => {

            if (dayjs(entity[prop]).isValid() && models[this.module][prop] && ['day', 'daytime'].includes(models[this.module][prop].type)) {
              entity[prop] = dayjs(entity[prop]).format();
            }

            if (!properties.includes(prop) && prop !== 'id' || prop === 'fullName' || ['updatedAt', 'createdAt'].includes(prop)) {
              delete entity[prop];
            }


          });
          this.form.addControl('id', new FormControl('', Validators.required));
          this.form.setValue(entity, {emitEvent: true});

          of('').pipe(
            untilDestroyed(this),
            delay(100) // workaround issue: https://github.com/angular/angular/issues/14542
          ).subscribe(() => this.isValid.next(this.form.valid) )


          await this.dateValidation();
        }
      } else {
        await this.dateValidation();
      }
    });
  }

  public async ngAfterViewInit() {

    // if the step was module to resolve the ID for - do it now
    if(this.data.hasOwnProperty('resolveId')) {
      this.id = await lastValueFrom(this.store.select(fromFlow.selectVariableByKey(this.data.resolveId)).pipe(take(1)));
    }

    if(this.data.hasOwnProperty('resolveData')) {
      for (const key of Object.keys(this.data.resolveData)) {
        this.additionalData[key] = await lastValueFrom(this.store.select(fromFlow.selectVariableByKey(this.data.resolveData[key])).pipe(take(1)));
      }
    }

    this._dynamicCollectionService.setFilter({id: this.id}); // clear the filters
    this._dynamicCollectionService.clearCache();


    if (this.data.id) {
      this.id = this.data.id;
      this.getData();
    }

  }

  public async dateValidation(): Promise<void>{
    if( this.pickers ){

      let ids:Array<string> = [];

      for(const picker of this.pickers) {
        ids.push(picker.id);
      }

      if( this.module == ModuleTypes.EVENT && ids.includes('startTime') && ids.includes('endTime') ){

        if( this.options.state == 'edit' ){
          if( this.form.get('startTime')?.value ){
            this.configuration.endTime.min = this.form.get('startTime')?.value;
          }
        }

        this.form.get('startTime')?.valueChanges.pipe(untilDestroyed(this)).subscribe( (value:any) => {
          const duration = this.appointmentSettings && this.appointmentSettings['duration'] && this.appointmentSettings['duration']['value'] || 30;
          const unit = this.appointmentSettings && this.appointmentSettings['duration'] && this.appointmentSettings['duration']['unit'] || 'minutes';
          const endTime = dayjs(value).add(duration, unit as ManipulateType).format();
          if( this.options.state == 'create' ){
            this.form.patchValue({'endTime' : endTime });
          }
          this.configuration.endTime.min = value;
          this.configuration.startTime.max = value;
        });

        this.form.get('endTime')?.valueChanges.pipe(untilDestroyed(this)).subscribe( (value:any) => {
          this.configuration.startTime.max = value;
        });

      }

      if( this.module == ModuleTypes.CALL && ids.includes('startTime') ){
        this.configuration.startTime.min = null;
      }

      if( this.module == ModuleTypes.CAMPAIGN ){
        this.form.get('startDate')?.valueChanges.pipe(untilDestroyed(this)).subscribe((value:any) => {
          this.configuration.endDate.min = dayjs(value).add(1, 'day').format();
        });
        this.form.get('endDate')?.valueChanges.pipe(untilDestroyed(this)).subscribe((value:any) => {
          this.configuration.startDate.max = dayjs(value).subtract(1, 'day').format();
        });
      }

    }
    return;
  }

  public getData() {
    this._dynamicCollectionService.getByKey(this.id);
    this._dynamicCollectionService.setFilter({id: this.id}); // this modifies filteredEntities$ subset
  }

  private buildForm(fields:  string[]) {
    let form: { [key: string]: FormControl } = {};

    for (const field of fields) {
      const control = models[this.module][field];

      if (!['virtual', 'timestamp'].includes(control.type)) {
        form[field] = new FormControl(control.defaultValue, control.validators);
      }

      // if (['calendar', 'timer', 'both'].includes(control.type)) {
      //   form[field] = new FormControl({value: control.defaultValue, disabled: control.disabled}, [
      //     ...control.validators
      //   ])
      // }

    }
    this.form = this.fb.group(form);
    this.form.statusChanges.pipe(untilDestroyed(this)).subscribe((valid: any) => {
      this.isValid.next(valid === 'VALID');
    });
    this.controlData = this.getControlData();

    /**
     * Watch dropdown fields to trigger dynamic form changes
     * example: `lostReason` is required when status is `lost`
     */
    const watchFields: any = {
      [ModuleTypes.LEAD]: [
        {
          when: LeadFields.STATUS_ID,
          equals: 'Lost',
          then: {
            fn: 'enable',
            args: [{emitEvent: false}]
          },
          else: {
            fn: 'disable',
            args: [{emitEvent: false}]
          },
          field: 'lostReasonId'
        }
      ],
      [ModuleTypes.DEAL]: [
        {
          when: DealFields.STAGE_ID,
          equals: 'Lost',
          then: {
            fn: 'enable',
            args: [{emitEvent: false}]
          },
          else: {
            fn: 'disable',
            args: [{emitEvent: false}]
          },
          field: 'lostReasonId'
        }
      ]
    };

    if(Object.keys(watchFields).includes(this.module)){
      for(const watch of watchFields[this.module]){
        const field = watch.when;
        if(this.form.controls.hasOwnProperty(field)){
          this.form.controls[field].valueChanges.pipe(untilDestroyed(this)).subscribe(async (res: number) => {
            const dropdown = this.dropdowns.find(cmp => cmp.id === field);
            const options = await dropdown?.items$.pipe(take(1)).toPromise();
            const value = options?.find(opt => opt.label === watch.equals)?.id;
            const result = res === value ? watch.then : watch.else;
            // @ts-ignore
            this.form.controls[watch.field][result.fn](...result.args)
          });
        }
      }
    }
  }

  public async save(): Promise<any> {
    let payload = this.form.value;

    if (this.form.valid) {
      this.form.disable();

      switch (this.options.state) {
        case 'edit': {
          return this.form.dirty && this._dynamicCollectionService.update(<DominionType>payload).toPromise()
            .then(() => this.cleanForm()) || Promise.resolve(this.cleanForm());
        }
        case 'create': {
          // append additional data as payload attachments
          payload = { ...payload, ...this.additionalData };

          return this.form.dirty && this._dynamicCollectionService.add(<DominionType>payload).toPromise().then((res) => {
            this._dynamicCollectionService.setFilter({id: res?.id});
            this.onSuccess.next( { [this.module]: res?.id });
          }) || Promise.resolve(this.cleanForm());
        }
      }
    }
    throw new FormInvalidError('Data Component');
  }

  private async cleanForm() {
    this.form.markAsPristine();
    this.form.updateValueAndValidity();
    this.form.enable();
    this.isValid.next(true);

  }

  private getControlData() {
    return this.options.fields.map(field => ({key: field, ...models[this.module][field]}));
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
