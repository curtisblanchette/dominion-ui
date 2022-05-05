import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, map } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromLogin from '../../modules/login/store/login.reducer';
import { User } from '../../modules/login/models/user';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  private user$: Observable<User|null>

  constructor(
    public store: Store<fromLogin.LoginState>,
    public router: Router
  ) {
    this.user$ = this.store.select(fromLogin.selectUser);
  }


  canActivate( route: ActivatedRouteSnapshot, state: RouterStateSnapshot ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let roles = route.data['roles'] as Array<string>;

    return this.store.select(fromLogin.selectUser).pipe(
      map((user) => {
        if (user !== null) {
          return roles.some(r=> user.role.includes(r));
        } else {
          console.warn( 'Login Required, or user has insufficient privileges.');
          return false
        }
    }));
  }

}
