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

  predictNextSteps() {
    // find the link from this step
    //
    // let link = this.builder.process.links.find(link => link.from.id === this.builder.process.currentStep?.step?.id);
    // let step = this.builder.process.steps.find(step => step.id === link?.from?.id);
    //
    // if(!link) {
    //   // no link, find a router who's router.condition[0].to matches the current step
    //   router = this.builder.process.routers.find(router => router.conditions.filter(condition => condition.to.id === this.builder.process.currentStep?.step?.id ) );
    //
    //   if(router) {
    //     // found a router, which `link` links to it?
    //     const condition = router.conditions.find(condition => condition.to.id === this.builder.process.currentStep?.step?.id);
    //
    //     if(condition?.to instanceof FlowRouter) {
    //       // recurse
    //
    //     } else {
    //       step = condition?.to;
    //     }
    //   }
    // }
  }


}
