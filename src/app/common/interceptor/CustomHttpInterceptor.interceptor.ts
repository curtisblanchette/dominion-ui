import { Injectable } from "@angular/core";
import { Observable, catchError, tap } from "rxjs";
import { Store } from "@ngrx/store";

import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse, HttpResponse } from '@angular/common/http';

import { User } from "src/app/modules/login/models/user";
import * as fromRoot from '../../reducers.index';

@Injectable()
export class CustomHttpInterceptor implements HttpInterceptor {

    public loggedUser!: User | null;

    constructor(
        private store: Store<fromRoot.State>
    ){
        this.store.select(fromRoot.getUser).subscribe((user) => {
            if( user ){
                this.loggedUser = user as User
            } else {
                this.loggedUser = null;
            }
        });
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // Add the Header Authorization
        const headers:any = this.getHeaders();
        req = req.clone( { setHeaders: headers } );
        return next.handle(req).pipe(
            tap( response => {
                if( response instanceof HttpResponse ){
                    // We might need to something here... not necessary
                }
            }),
            catchError( error => {
                if( error instanceof HttpErrorResponse ){
                    switch (error.status) {
                        case 0 :
                            console.log('An unknown error occurred');
                        break;

                        case 401 :
                            console.log('Unauthorized error');
                        break;

                        default:
                        break;
                    }

                }
                throw error;
            })
        )

    }

    private getHeaders(){
        if( this.loggedUser ){
            return {
                'x-id-token' : this.loggedUser.access_token,
                'x-access-token' : this.loggedUser.refresh_token
            }
        }
    }


}
