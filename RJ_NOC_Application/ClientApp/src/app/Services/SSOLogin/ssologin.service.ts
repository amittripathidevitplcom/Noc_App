import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { GlobalConstants } from '../../Common/GlobalConstants';
import { SSOLandingDataDataModel } from '../../Models/SSOLoginDataModel';
@Injectable({
  providedIn: 'root'
})
export class SSOLoginService {

  readonly APIUrl = GlobalConstants.apiURL + "SSOAPI";
  constructor(private http: HttpClient) { }

  extractData(res: Response) {
    return res;
  }
  handleErrorObservable(error: Response | any) {
    // return Observable.throw(error);
    return throwError(error);
  }

  public async GetSSOUserLogionDetails(sSOLandingDataDataModel: SSOLandingDataDataModel) {
    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(sSOLandingDataDataModel);
    return await this.http.post(this.APIUrl + '/GetSSOUserLogionDetails/', body, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
    ).toPromise();

  }

  public async CheckMappingSSOID(SSOID: string) {
    const headers = { 'content-type': 'application/json' }
    return await this.http.get(this.APIUrl + '/CheckMappingSSOID/' + SSOID, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  //public async GetSSOUserLogionDetails(sSOLandingDataDataModel: SSOLandingDataDataModel) {

  //  const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
  //  return await this.http.post(this.APIUrl + '/GetSSOUserLogionDetails/' + sSOLandingDataDataModel.Username + "/" + sSOLandingDataDataModel.LoginType, httpOptions)
  //    .pipe(
  //      catchError(this.handleErrorObservable)
  //    ).toPromise();

  //}

}
