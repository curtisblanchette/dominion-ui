import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs';
import * as flowActions from './flow.actions';
import * as fromFlow from './flow.reducer';
import { FlowService } from '../flow.service';
import { FlowHostDirective } from '../_core/classes/flow.host';

@Injectable()
export class FlowEffects {

  constructor(
    private actions$: Actions,
    private router: Router,
    private store: Store<fromFlow.FlowState>,
    private flowService: FlowService
  ) {

  }

  goToStepById$ = createEffect((): any =>
    this.actions$.pipe(
      ofType(flowActions.GoToStepByIdAction),
      tap((action: { id: string, host: FlowHostDirective }) => {
        const id = action.id;
        this.flowService.next(action.host);
      })
    ), { dispatch: false }
  );

}
