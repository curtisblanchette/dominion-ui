import { Injectable } from "@angular/core";
import { Observable, catchError, tap } from "rxjs";
import { Store } from "@ngrx/store";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse, HttpResponse } from '@angular/common/http';

import { User } from "../../modules/login/models/user";
import * as fromRoot from '../../reducers.index';
import * as loginActions from '../../modules/login/store/login.actions';
import { CognitoService } from '../cognito/cognito.service';
import { LoginService } from "../../modules/login/services/login.service";

@Injectable()
export class CustomHttpInterceptor implements HttpInterceptor {

    public loggedUser!: User;
    public readonly retry:number = 3;

    constructor(
        private store: Store<fromRoot.State>,
        private cognito: CognitoService,
        private login: LoginService
    ){
        this.store.select(fromRoot.getUser).subscribe((user:any) => {
            if( user ){
                this.loggedUser = user as User;
            }
        });
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // Add the Header Authorization
        if( this.loggedUser ){
            const headers:any = this.getAuthHeaders();
            req = req.clone( { setHeaders: headers } );
        }
        return next.handle(req).pipe(
            tap( response => {
                if( response instanceof HttpResponse ){
                    // We might need to something here.. not necessary                    
                }
            }),
            catchError( error => {
                if( error instanceof HttpErrorResponse ){
                    switch (error.status) {
                        
                        case 0 :
                            console.log('Some Unknown error occured');                            
                        break;

                        case 401 :
                            // Refresh the Cognito Token                            
                            if( this.loggedUser ){
                                const refreshed:any = this.refreshToken(0);
                                if( refreshed ){
                                    return next.handle(req);
                                } else {
                                    this.login.logout();
                                }
                            } else {
                                console.warn('Unauthorized access');
                            }
                        break;

                        default:
                        break;
                    }

                }
                throw error;
            })
        )

    }

    private getAuthHeaders(){
        if( this.loggedUser ){
            return {
                'x-id-token': this.loggedUser.id_token,
                'x-access-token': this.loggedUser.access_token,
                'x-acting-for': '4583e3f2-dca3-4a1d-9457-13b0a6d12f48'
            }
        }
    }

    private refreshToken( counter:number = 0):Promise<boolean> {
        return this.cognito.refreshSession().then((session) => {
            const newAccessToken = session.accessToken.getJwtToken();
            const newIdToken = session.idToken.getJwtToken();
            const newRefreshToken = session.refreshToken.getToken();            
            this.loggedUser = {... this.loggedUser, access_token : newAccessToken, id_token : newIdToken, refresh_token : newRefreshToken };
            this.store.dispatch(loginActions.udpateRecordAction({payload:this.loggedUser}));
            return true;
        }).catch(error => {
            console.error('Error refreshing token', error);
            console.log(`Retrying count ${counter}`);
            if (counter < this.retry) {
                counter++;
                return this.refreshToken(counter);
            }
            return false;
        });
    }

}
