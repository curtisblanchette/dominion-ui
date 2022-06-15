import { Component, Input, OnDestroy, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { FlowState } from '../../../store/flow.reducer';
import * as flowActions from '../../../store/flow.actions';
import { FiizDataComponent, IDataOptions } from '../../../../../common/components/ui/data/data.component';
import { OnBack, OnNext } from '../../classes';

@Component({
  selector: 'flow-data',
  template: `<fiiz-data #cmp [data]="data" [options]="options" (isValid)="updateValidity($event)"></fiiz-data>`,
  styleUrls: ['../_base.scss']
})
export class FlowDataComponent implements OnDestroy, OnBack, OnNext {

  @Input('data') data: any;
  @Input('options') options: IDataOptions = { controls: false, state: 'create' };

  @ViewChild(FiizDataComponent, { static: true }) cmp: FiizDataComponent;

  constructor(
    private store: Store<FlowState>
  ) {

  }

  updateValidity(isValid: boolean) {
    this.store.dispatch(flowActions.SetValidityAction({payload: isValid}))
  }

  save() {
    this.cmp.saveData();
  }

  ngOnDestroy() {
    // we only want to do this if it's a back action
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
