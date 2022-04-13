import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, switchMap, of } from 'rxjs';
import { Store } from '@ngrx/store';

import * as fromRoot from '../../reducers.index';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(
    public store: Store<fromRoot.State>,
    public router: Router
  ){}

  canActivate( route: ActivatedRouteSnapshot, state: RouterStateSnapshot ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    let roles = route.data['roles'] as Array<string>;

    return this.store.select( fromRoot.getUser ).pipe(
      switchMap((userData) => {
        if (userData !== null) {
          return of( roles.includes(userData.role[0] ) );
        } else {
          console.warn( 'Login Required, or user has insufficient privileges.');
          return of(false);
        }
      })
    );

  }

}
