import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { environment } from '../../../../../../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, map } from 'rxjs/operators';

@Injectable({
	providedIn: 'root'
})
export class AppointmentService {

	public timeZone:any;
	public duration:any;
	public dayStart:any;
	public dayEnd:any;

	constructor(
		private http:HttpClient
	){}

	public getEvents( date:string ):Observable<any>{
		return this.http.get(`${environment.dominion_api_url}/events?date=${date}`).pipe();
	}

}