import {Injectable} from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private toastr: ToastrService) {
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.error instanceof ErrorEvent) {
            console.log('This is a client side error');
            this.toastr.error(error.message, 'Uh Oh!');
          } else {
            console.log('This is a server side error');
            this.toastr.error(error.error.message, error.error.name);
          }
          return of(new HttpResponse<any>({ body:error }));
        })
      ) as Observable<HttpEvent<any>>;
  }
}
