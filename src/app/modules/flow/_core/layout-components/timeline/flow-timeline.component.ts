import { Component, EventEmitter, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromFlow from '../../../store/flow.reducer';
import { FlowStep } from '../../classes';
import { Observable } from 'rxjs';


@Component({
  selector: 'flow-timeline',
  templateUrl: './flow-timeline.component.html',
  styleUrls: ['./flow-timeline.component.scss']
})
export class FlowTimelineComponent {

  public steps$: Observable<(FlowStep | undefined)[]>;
  public currentStepId$: Observable<string | undefined>;

  @Output('onSelect') onSelect: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private store: Store<fromFlow.FlowState>
  ) {

    // find steps, stop at current
    this.currentStepId$ = this.store.select(fromFlow.selectCurrentStepId);

    this.steps$ = this.store.select(fromFlow.selectFlowTimeline);


  }

  onClick(id: string) {
    this.onSelect.next(id);
  }


}
