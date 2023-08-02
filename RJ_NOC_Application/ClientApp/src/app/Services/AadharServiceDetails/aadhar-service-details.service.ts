import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { GlobalConstants } from '../../Common/GlobalConstants';
import { AadharServiceDataModel } from '../../Models/AadharServiceDataModel';

@Injectable({
  providedIn: 'root'
})
export class AadharServiceDetails {

  readonly APIUrl = GlobalConstants.apiURL + "AadharService";

  constructor(private http: HttpClient) { }
  extractData(res: Response) {
    return res;
  }
  handleErrorObservable(error: Response | any) {
    return throwError(error);
  }

  public async SendAadharOTP(request: AadharServiceDataModel)
  {
    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + "/SendAadharOTP", body, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async ValidateAadharOTP(request: AadharServiceDataModel) {
    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + "/ValidateAadharOTP", body, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
}
