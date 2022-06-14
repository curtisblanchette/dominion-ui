import { Component, Input, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { FlowState } from '../../../store/flow.reducer';
import * as flowActions from '../../../store/flow.actions';
import { FiizDataComponent } from '../../../../../common/components/ui/data/data.component';

@Component({
  selector: 'flow-data',
  template: `<fiiz-data #cmp [data]="data" [options]="{controls: false}" (isValid)="updateValidity($event)"></fiiz-data>`,
  styleUrls: ['../_base.scss']
})
export class FlowDataComponent {

  @Input('data') data: any;

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

}
