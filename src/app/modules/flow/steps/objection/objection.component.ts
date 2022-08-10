import {  Component, Input, OnDestroy, QueryList, ViewChildren } from '@angular/core';
import { Router } from "@angular/router";
import { FlowService } from "../../flow.service";
import { DefaultDataServiceFactory, EntityCollectionServiceFactory } from '@ngrx/data';
import { EntityCollectionComponentBase } from '../../../../data/entity-collection.component.base';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../store/app.reducer';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ModuleTypes } from '../../../../data/entity-metadata';
import { HttpClient } from '@angular/common/http';
import * as fromFlow from '../../store/flow.reducer';
import { Fields as CallFields } from '../../../../common/models/call.model';
import { FiizDataComponent } from '../../../../common/components/ui/data/data.component';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'flow-objection',
  templateUrl: './objection.component.html',
  styleUrls: ['../_base.scss', './objection.component.scss']
})
export class FlowObjectionComponent extends EntityCollectionComponentBase implements OnDestroy {

  @Input('data') public override data: any;
  @Input('module') public override module: any;
  @Input('options') public override options: any;

  @ViewChildren(FiizDataComponent) dataComponents: QueryList<FiizDataComponent>;

  private flowStepId: string;
  public form: FormGroup;
  public ModuleTypes: any;
  public fields: any = CallFields;


  constructor(
    private store: Store<AppState>,
    private fb: FormBuilder,
    private router: Router,
    entityCollectionServiceFactory: EntityCollectionServiceFactory,
    dataServiceFactory: DefaultDataServiceFactory,
    public flowService: FlowService,
    public http: HttpClient
  ) {
    super(router, entityCollectionServiceFactory, dataServiceFactory);

    const state = (<any>router.getCurrentNavigation()?.extras.state);
    this.ModuleTypes = ModuleTypes;

    if (state && Object.keys(state).length) {
      this.module = state.module;
      this.options = state.options;
      this.data = state.data;
    }

    this.store.select(fromFlow.selectCurrentStepId).pipe(untilDestroyed(this)).subscribe(currentStepId => {
      if(currentStepId) {
        this.flowStepId = currentStepId;
      }
    });

    this.form = this.fb.group({
      'objection' : new FormControl('', Validators.required)
    });

  }

  public async onSave():Promise<any> {
    this.dataComponents.map( (cmp:FiizDataComponent, index:number) => {
      cmp.save(false);
    });
  }

  public goToSetAppointment() {
    const setAppointmentStep = this.flowService.builder.process.steps.find(step => step.nodeText === 'Set Appointment');
    if(setAppointmentStep?.id) {
      this.flowService.goTo(setAppointmentStep.id);
    }
  }
  public handleChange(objection: any) {
    this.flowService.updateStep(this.flowStepId, {variables: {call_objectionId: objection.id}, valid: true});
  }

  public override ngOnDestroy() {
    super.ngOnDestroy();
  }
}
