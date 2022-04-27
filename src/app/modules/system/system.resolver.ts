import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import * as fromSystem from './store/system.reducer';
import * as systemActions from './store/system.actions';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SystemResolver implements Resolve<any> {
  constructor(
    private store: Store<fromSystem.SystemState>,
  ) {

  }

  resolve(
    route: ActivatedRouteSnapshot,

    state: RouterStateSnapshot
  ): Observable<any>|Promise<any>|any {
    return this.store.dispatch(systemActions.GetWorkspacesAction());
  }
}
