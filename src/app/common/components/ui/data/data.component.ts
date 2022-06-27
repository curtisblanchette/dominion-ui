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
import { ModuleTypes, uriOverrides } from '../../../../data/entity-metadata';
import { firstValueFrom, map, of, take } from 'rxjs';
import { CustomDataService } from '../../../../data/custom.dataservice';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { delay } from 'rxjs/operators';
import * as flowActions from '../../../../modules/flow/store/flow.actions';
import * as fromFlow from '../../../../modules/flow/store/flow.reducer';
import { FormInvalidError } from '../../../../modules/flow';

import { Fields as LeadFields } from '../../../models/lead.model';
import { Fields as DealFields } from '../../../models/deal.model';

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

  public relForm: FormGroup;
  public relControlData: any;

  public submitText: string;
  public id: string | null;

  @Input('module') public override module: ModuleTypes;
  @Input('data') public override data: any;
  @Input('options') public override options: FiizDataComponentOptions = { controls: true, state: 'create', dictation: '', fields: [] };

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
    router: Router
  ) {
    super(router, entityCollectionServiceFactory, dataServiceFactory);
    route.paramMap.subscribe(params => {
      this.id = params.get('id');
    });

    const state = (<any>router.getCurrentNavigation()?.extras.state);
    if(state && Object.keys(state).length) {
      this.options = state.options;
      this.module = state.module;
      this.data = state.data;
    }

  }

  public override async ngAfterContentInit() {
    await super.ngAfterContentInit();

    if (!this.id) {
      this.id = this.data.id
    }

    this.store.select(fromFlow.selectVariableByKey(this.data.module)).pipe(untilDestroyed(this)).subscribe(variable => {
      // TODO maybe we use this to set the id?
      // console.log(variable);
    });
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
    ).subscribe(record => {
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

          // workaround issue: https://github.com/angular/angular/issues/14542
          of('').pipe(delay(0), map(() => this.isValid.next(this.form.valid))).subscribe();
        }
      }
    });
  }

  public async ngAfterViewInit() {
    if (this.data.resolveId && typeof this.data.resolveId === 'function') {
      /**
       * if the step was passed a resolveId <Promise> resolve it now
      */
      this.id = await this.data.resolveId();
    }

    await this.resolveDropdowns();
    this._dynamicCollectionService.setFilter({id: this.id}); // clear the filters
    this._dynamicCollectionService.clearCache();

    if (this.id) {
      this.getData();
    }
  }


  /**
   * Get Data for Dropdowns.
   * @return void
   */
  public async resolveDropdowns(): Promise<void> {
    for(const dropdown of this.dropdowns) {
      const data = await firstValueFrom(this.http.get(`${environment.dominion_api_url}/${uriOverrides[dropdown.module]}`)) as DropdownItem[];
      dropdown.items$ = of(CustomDataService.toDropdownItems(data));
    }
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

      if (['day', 'daytime'].includes(control.type)) {
        form[field] = new FormControl({value: undefined, disabled: control.disabled}, [
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
          this.form.controls[field].valueChanges.subscribe(async (res: number) => {
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
    console.log('payload',payload);
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
            this.store.dispatch(flowActions.AddVariablesAction({payload: { [this.module]: res?.id }}));
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
    this.store.dispatch(flowActions.SetValidityAction({payload: true}));
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
