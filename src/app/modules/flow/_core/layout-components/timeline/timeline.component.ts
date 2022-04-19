import { Component, EventEmitter, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromFlow from '../../../store/flow.reducer';
import * as flowActions from '../../../store/flow.actions';
import { FlowStep } from '../../classes/flow.step';
import { Observable } from 'rxjs';


@Component({
  selector: 'flow-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent {

  public steps$: Observable<FlowStep[] | null>;
  public currentStep$: Observable<FlowStep | null>;

  @Output('onSelect') onSelect: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private store: Store<fromFlow.FlowState>
  ) {
    this.steps$ = this.store.select(fromFlow.selectSteps);
    this.currentStep$ = this.store.select(fromFlow.selectCurrentStep);
  }

  onClick(id: string) {
    this.onSelect.next(id);
  }

}
