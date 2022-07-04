import { AfterViewInit, Component, Input, OnDestroy, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { FlowState } from '../../store/flow.reducer';
import * as flowActions from '../../store/flow.actions';
import { FiizDataComponent, FiizDataComponentOptions } from '../../../../common/components/ui/data/data.component';
import { OnBack, OnNext, OnSave } from '../../classes';
import { ModuleTypes } from '../../../../data/entity-metadata';

@Component({
  selector: 'flow-data',
  template: `
    <div>{{options.dictation}}</div>
    <fiiz-data #cmp [data]="data" [module]="module" [options]="options" (isValid)="updateValidity($event)"></fiiz-data>
  `,
  styleUrls: ['../_base.scss']
})
export class FlowDataComponent implements AfterViewInit, OnDestroy, OnSave, OnBack, OnNext {

  @Input('module') module: ModuleTypes;
  @Input('data') data: any;
  @Input('options') options: FiizDataComponentOptions;

  @ViewChild(FiizDataComponent, { static: true }) cmp: FiizDataComponent;

  constructor(
    private store: Store<FlowState>
  ) {

  }

  public async ngAfterViewInit() {
    await this.cmp.resolveDropdowns();
  }

  updateValidity(isValid: boolean) {
    this.store.dispatch(flowActions.SetValidityAction({payload: isValid}))
  }

  onSave(): Promise<any> {
    return this.cmp.save();
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
