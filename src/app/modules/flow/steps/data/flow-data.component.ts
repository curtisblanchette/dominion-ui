import { AfterContentInit, Component, Input, OnDestroy, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromFlow from '../../store/flow.reducer';
import { FiizDataComponent, FiizDataComponentOptions } from '../../../../common/components/ui/data/data.component';
import { OnBack, OnNext, OnSave } from '../../classes';
import { ModuleTypes } from '../../../../data/entity-metadata';
import { distinctUntilChanged } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { FlowService } from '../../flow.service';
import { DominionType } from '../../../../common/models';

@UntilDestroy()
@Component({
  selector: 'flow-data',
  template: `
    <h3 style="">{{data.title}}</h3>
    <div *ngIf="options.dictation">{{options.dictation}}</div>
    <fiiz-data #cmp [data]="data" [module]="module" [options]="options" (onSuccess)="onSuccess($event)" (values)="onChange($event)"></fiiz-data>
  `,
  styleUrls: ['../_base.scss', './flow-data.component.scss']
})
export class FlowDataComponent implements AfterContentInit, OnDestroy, OnSave, OnBack, OnNext {
  public static reference: string = 'FlowDataComponent';
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

  public onChange(value: any) {
    if(value) {
      this.flowService.updateStep(this.flowStepId, { valid: this.cmp.form.valid, state: { data: value }});
    }
  }

  ngAfterContentInit() {
    if(this.data[this.module]) {
      // Set the <fiiz-data> component's form value;
      this.cmp.form.setValue(this.data[this.module], {emitEvent: true});
    }

    this.store.select(fromFlow.selectVariableByKey(this.module)).pipe(
      untilDestroyed(this),
      distinctUntilChanged()
    ).subscribe(id => {
      this.flowService.updateStep(this.flowStepId, { state: { data: { id }} }, 'merge');
    });
  }

  onSave(): Promise<any> {
    return this.cmp.save(false);
  }

  onSuccess(record: DominionType) {
    // variables to be saved after a step should come back here.
    this.flowService.updateStep(this.flowStepId, {
      // variables: {
      //   [this.module]: record.id
      // },
      valid: true,
      state: {
        data: {
          [this.module]: record
        }
      }
    }, 'merge');
  }

  onBack() {
    // this.data.id = null;
    // this.cmp.resetForm();
    console.log('FlowDataComponent OnBack called!');
  }

  onNext() {
    console.log('FlowDataComponent OnNext called!');
  }

  ngOnDestroy() {

    console.log("FlowDataComponent Destroyed")
  }

}
