import { AfterContentInit, Component, Input, OnDestroy, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromFlow from '../../store/flow.reducer';
import * as flowActions from '../../store/flow.actions';
import { FiizDataComponent, FiizDataComponentOptions } from '../../../../common/components/ui/data/data.component';
import { OnBack, OnNext, OnSave } from '../../classes';
import { ModuleTypes } from '../../../../data/entity-metadata';
import { distinctUntilChanged } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { FlowService } from '../../flow.service';

@UntilDestroy()
@Component({
  selector: 'flow-data',
  template: `
    <h3 style="">{{data.title}}</h3>
    <div *ngIf="options.dictation">{{options.dictation}}</div>
    <fiiz-data #cmp [data]="data" [module]="module" [options]="options" (isValid)="updateValidity($event)" (onSuccess)="onSuccess($event)"></fiiz-data>
  `,
  styleUrls: ['../_base.scss', './flow-data.component.scss']
})
export class FlowDataComponent implements AfterContentInit, OnDestroy, OnSave, OnBack, OnNext {
  private flowStepId: string | undefined;

  @Input('module') module: ModuleTypes;
  @Input('data') data: any;
  @Input('options') options: FiizDataComponentOptions;

  @ViewChild(FiizDataComponent, { static: true }) cmp: FiizDataComponent;

  constructor(
    private store: Store<fromFlow.FlowState>,
    private flowService: FlowService
  ) {
      this.store.select(fromFlow.selectCurrentStepId).subscribe(currentStepId => {
        this.flowStepId =  currentStepId;
      });
  }

  ngAfterContentInit() {
    this.store.select(fromFlow.selectVariableByKey(this.module)).pipe(
      untilDestroyed(this),
      distinctUntilChanged()
    ).subscribe(id => {
      this.data.id = id;
    });
  }

  updateValidity(isValid: boolean) {
    // this.store.dispatch(flowActions.SetValidityAction({payload: isValid}));
    this.flowService.setValidity(this.flowStepId, isValid );
  }

  onSave(): Promise<any> {

    this.store.dispatch(flowActions.AddMediatorAction({ action: `${this.options.state}-${this.module}` }));
    return this.cmp.save();
  }

  onSuccess(record: {[key:string]: string }) {
    // variables to be saved after a step should come back here.
    this.flowService.addVariables(record)
  }

  onBack() {
    this.data.id = null;
    this.cmp.resetForm();
    console.log('FlowDataComponent OnBack called!');
  }

  onNext() {
    console.log('FlowDataComponent OnNext called!');
  }

  ngOnDestroy() {
    console.log("FlowDataComponent Destroyed")
  }

}
