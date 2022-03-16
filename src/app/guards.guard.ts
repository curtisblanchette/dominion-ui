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
    
    return this.store.select(fromRoot.getUser).pipe(
      switchMap((userData) => {    
        const isUserLoggedIn:boolean = userData ? true : false;
        const path = route.routeConfig?.path;
        let $return:boolean = false;
        if( userData ){
          if( path != 'login' ){
            if( isUserLoggedIn ){
              $return = true;
            } else {
              this.router.navigate(['login']);
              $return = false;
            }
          } else {
            if( isUserLoggedIn ){
              this.router.navigate(['dashboard']);
            } else {
              $return = true;
            }
          }
        } else {
          if( path != 'login' ){
            $return = false;
            this.router.navigate(['login']);
          } else {
            $return = true;
          }
        }
        return of($return);
      })
    );
  }
  
}
