import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import * as fromSystem from './store/system.reducer';
import * as systemActions from './store/system.actions';
import { EMPTY, firstValueFrom, Observable } from 'rxjs';

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
    // check for anything is store first
    return firstValueFrom(this.store.select(fromSystem.selectWorkspaces)).then(workspaces => {
      if(!workspaces.length) {
        return this.store.dispatch(systemActions.GetWorkspacesAction());
      }
      return EMPTY;
    });

  }
}
