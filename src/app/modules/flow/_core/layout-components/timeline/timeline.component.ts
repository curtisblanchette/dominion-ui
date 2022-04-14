import { Component } from '@angular/core';
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

  constructor(
    private store: Store<fromFlow.FlowState>
  ) {
    this.steps$ = this.store.select(fromFlow.selectSteps);
  }

  directlyToStep(id: string) {
    this.store.dispatch(flowActions.GoToStepByIdAction({ id }))
  }

}
