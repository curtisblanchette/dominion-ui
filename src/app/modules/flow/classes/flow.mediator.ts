import { Inject } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromFlow from '../store/flow.reducer';

export class FlowMediator {

  constructor(
    @Inject(Store) private store: Store<fromFlow.FlowState>
  ) {
      // collect all the valid steps that have been passed through.
      //
      // collect all the variables
  }

  public static run() {

  }
}
