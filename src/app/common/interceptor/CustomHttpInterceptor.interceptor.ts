import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, take, switchMap } from 'rxjs';
import { Store } from '@ngrx/store';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';

import { User } from '../../modules/login/models/user';
import * as fromRoot from '../../reducers.index';
import * as loginActions from '../../modules/login/store/login.actions';
import { filter } from 'rxjs/operators';

@Injectable()
export class CustomHttpInterceptor implements HttpInterceptor {

  public loggedUser!: User;
  public readonly retry: number = 3;

  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private refreshTokenInProgress = false;

  constructor(
    private store: Store<fromRoot.State>
  ) {
    this.store.select(fromRoot.getUser).subscribe((user: any) => {
      if (user) {
        this.loggedUser = user as User;
        this.refreshTokenSubject.next(true);
      }
    });
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.refreshTokenInProgress = this.isRefreshTokenInProgress(this.loggedUser.access_token);
    if (this.refreshTokenInProgress) {
      // wait until refreshTokenSubject has a non-null value
      console.log("Token Refresh In Progress!")
      return this.refreshTokenSubject.pipe(
        filter(result => result !== null),
        take(1),
        switchMap(() => next.handle(this.addAuthenticationToken(req)))
      );
    } else {
      // Set the refreshTokenSubject to null so that subsequent API calls will wait until the new token has been retrieved
      this.refreshTokenSubject.next(null);
      return next.handle(this.addAuthenticationToken(req));
    }
  }

  addAuthenticationToken(request: HttpRequest<any>) {
    // clone the request, because the original is immutable
    return request.clone({
      setHeaders: {
        'x-access-token': this.loggedUser.access_token,
        'x-id-token': this.loggedUser.id_token,
        'x-acting-for': '80052327-9e54-4d27-bf90-b4175556a50a'
      }
    });
  }

  isRefreshTokenInProgress(accessToken: string) {
    const isExpired = (token: any) => Date.now() >= (JSON.parse(atob(accessToken.split('.')[1]))).exp * 1000;

    if (isExpired(accessToken)) {
      console.log("Token expired. Dispatching new token action!")
      // Set the refreshTokenSubject to null so that subsequent API calls will wait until the new token has been retrieved
      this.refreshTokenSubject.next(null);
      this.store.dispatch(loginActions.RefreshTokenAction({payload: this.loggedUser}));
      return true;
    } else {
      return false;
    }
  }
}
