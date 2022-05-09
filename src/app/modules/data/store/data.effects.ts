import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs';

@Injectable()
export class DataEffects {

  constructor(
    private actions$: Actions,
    private router: Router,
    // private store: Store<fromFlow.FlowState>,
    // private flowService: FlowService
  ) {

  }

//   goToStepById$ = createEffect((): any =>
//     this.actions$.pipe(
//       ofType(flowActions.GoToStepByIdAction),
//       tap((action) => {
//         const id = action.id;
//         this.flowService.next();
//       })
//     ), { dispatch: false }
//   );

}