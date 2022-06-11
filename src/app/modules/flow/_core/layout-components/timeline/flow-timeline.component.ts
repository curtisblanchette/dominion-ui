import { Component, EventEmitter, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromFlow from '../../../store/flow.reducer';
import { FlowRouter, FlowStep } from '../../classes';
import { map, mergeMap, Observable, of } from 'rxjs';
import { FlowService } from '../../../flow.service';
import { distinctUntilChanged } from 'rxjs/operators';


@Component({
  selector: 'flow-timeline',
  templateUrl: './flow-timeline.component.html',
  styleUrls: ['./flow-timeline.component.scss']
})
export class FlowTimelineComponent {

  public steps$: Observable<FlowStep[] | null>;
  public currentStepId$: Observable<string | undefined>;

  @Output('onSelect') onSelect: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private store: Store<fromFlow.FlowState>,
    private flowService: FlowService
  ) {

    // find steps, stop at current
    this.currentStepId$ = this.store.select(fromFlow.selectCurrentStepId);


    this.steps$ = this.store.select(fromFlow.selectCurrentStep).pipe(
      distinctUntilChanged((next:any, prev:any) => {
        const unchanged = prev?.step?.id === next?.step?.id;
        return unchanged;
      }),
      mergeMap(() => this.store.select(fromFlow.selectStepsToCurrent)),
      map(steps => {
        // go get the next step recursively until a router
        const findNext = (): any[] => {
          const next = this.flowService.findNextStep();

          if(next) {
            if(next instanceof FlowRouter) {
              return steps;
            } else {
              steps.push(next);
              return findNext();
            }
          }
          return steps;
        }
        return findNext();

      })
    );

  }

  onClick(id: string) {
    this.onSelect.next(id);
  }



  predict() {

  }


}
