import {  Component, Input, OnDestroy, OnInit, QueryList, ViewChildren, Renderer2 } from '@angular/core';
import { Router } from "@angular/router";
import { FlowService } from "../../flow.service";
import { DefaultDataServiceFactory, EntityCollectionServiceFactory } from '@ngrx/data';
import { EntityCollectionComponentBase } from '../../../../data/entity-collection.component.base';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../store/app.reducer';
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
export class FlowObjectionComponent extends EntityCollectionComponentBase implements OnInit, OnDestroy {

  @Input('data') public override data: any;
  @Input('module') public override module: any;
  @Input('options') public override options: any;

  @ViewChildren(FiizDataComponent) dataComponents: QueryList<FiizDataComponent>;

  private flowStepId: string;
  public ModuleTypes: any;
  public fields: any = CallFields;
  public selectedId:number;
  public resolution:{ [key:number] : string } = {
    1 : 'Objection 1',
    2 : 'Objection 2',
    3 : 'Objection 3',
    4 : 'Objection 4',
    5 : 'Objection 5',
    6 : 'Objection 6',
    7 : 'Objection 7',
    8 : 'Objection 8',
    9 : 'Objection 9',
  }

  constructor(
    private store: Store<AppState>,
    private router: Router,
    entityCollectionServiceFactory: EntityCollectionServiceFactory,
    dataServiceFactory: DefaultDataServiceFactory,
    public flowService: FlowService,
    public http: HttpClient,
    public renderer:Renderer2
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

  }

  async ngOnInit() {
    this.selectedId = await this.flowService.getVariable('objectionId');
  }

  public async onSave():Promise<any> {
    this.dataComponents.map( (cmp:FiizDataComponent, index:number) => {
      cmp.save(false);
    });
  }

  public goToSetAppointment() {
    const setAppointmentStep = this.flowService.builder.process.steps.find(step => step.component === 'FlowAppointmentComponent');
    if(setAppointmentStep?.id) {
      this.flowService.goTo(setAppointmentStep.id);
    }
  }

  public async endCall(){
    const id = await this.flowService.getVariable('objectionId');
    const stepId = this.flowService.builder.process.steps.find( step => step.component === 'FlowObjectionComponent' )?.id as string;
    this.flowService.addVariables({objectAndEndCall : true},stepId);
    this.flowService.updateCall({
      objectionId : id
    });
    return this.flowService.restart();
  }

  public handleChange(objection: any) {
    this.flowService.updateStep(this.flowStepId, {variables: {call_objectionId: objection.id}, valid: true});
  }

  public override ngOnDestroy() {
    super.ngOnDestroy();
  }

}
