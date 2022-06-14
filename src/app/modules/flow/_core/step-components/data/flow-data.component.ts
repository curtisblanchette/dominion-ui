import { Component, Input, OnDestroy, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { FlowState } from '../../../store/flow.reducer';
import * as flowActions from '../../../store/flow.actions';
import { FiizDataComponent, IDataOptions } from '../../../../../common/components/ui/data/data.component';
import { FlowFactory } from '../../../flow.factory';

@Component({
  selector: 'flow-data',
  template: `<fiiz-data #cmp [data]="data" [options]="options" (isValid)="updateValidity($event)"></fiiz-data>`,
  styleUrls: ['../_base.scss']
})
export class FlowDataComponent implements OnDestroy {

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
    this.data.id = null;
    this.data.title = FlowFactory.createEditLead()
    console.log("FlowDataComponent Destroyed")
  }
}
