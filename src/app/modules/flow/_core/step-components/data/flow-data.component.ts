import { Component, Input, OnDestroy, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { FlowState } from '../../../store/flow.reducer';
import * as flowActions from '../../../store/flow.actions';
import { FiizDataComponent, IDataOptions } from '../../../../../common/components/ui/data/data.component';
import { OnBack, OnNext } from '../../classes';

@Component({
  selector: 'flow-data',
  template: `
    <div>{{options.dictation}}</div>
    <fiiz-data #cmp [data]="data" [options]="options" (isValid)="updateValidity($event)"></fiiz-data>
  `,
  styleUrls: ['../_base.scss']
})
export class FlowDataComponent implements OnDestroy, OnBack, OnNext {

  @Input('data') data: any;
  @Input('options') options: IDataOptions = { controls: false, state: 'create', dictation: '', fields: [] };

  @ViewChild(FiizDataComponent, { static: true }) cmp: FiizDataComponent;

  constructor(
    private store: Store<FlowState>
  ) {

  }

  updateValidity(isValid: boolean) {
    this.store.dispatch(flowActions.SetValidityAction({payload: isValid}))
  }

  public save(): Promise<any> {
    return this.cmp.saveData();
  }

  ngOnDestroy() {
    console.log("FlowDataComponent Destroyed")
  }

  onBack() {
    this.data.id = null;
    this.cmp.resetForm();
    console.log('FlowDataComponent OnBack called!');
  }

  onNext() {
    console.log('FlowDataComponent OnNext called!');
  }

}
