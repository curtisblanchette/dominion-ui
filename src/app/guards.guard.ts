import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, switchMap, of } from 'rxjs';
import { Store } from '@ngrx/store';

import * as fromRoot from './reducers.index';

@Injectable({
  providedIn: 'root'
})
export class GuardsGuard implements CanActivate {

  constructor(
    public store:Store<fromRoot.State>,
    public router:Router
  ){}

  canActivate( route: ActivatedRouteSnapshot, state: RouterStateSnapshot ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {


    return this.store.select( fromRoot.getUser ).pipe(
      switchMap((userData) => {
        console.log( 'userData',userData );
        if (userData !== null) {
          console.log( 'in block - logged in');
          return of(true);
        } else {
          console.log( 'in else block - not logged in');
          return of(false);
        }
      })
    );

  }

}
