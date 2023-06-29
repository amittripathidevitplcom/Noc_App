import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { ApplyNOCApplicationDataModel } from '../../Models/ApplyNOCApplicationDataModel';

import { GlobalConstants } from '../../Common/GlobalConstants';
@Injectable({
  providedIn: 'root'
})
export class ApplyNOCApplicationService {
  readonly APIUrl = GlobalConstants.apiURL + "ApplyNOCApplicationService";
  constructor(private http: HttpClient) { }
  extractData(res: Response) {
    return res;
  }
  handleErrorObservable(error: Response | any) {
    // return Observable.throw(error);
    return throwError(error);
  }
  //Get 
  public async GetApplyNocDetailsList(RoleId: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl + "/" + RoleId)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async DocumentScruitny(RoleId: number, UserID: number, Action: string, PKeyId: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl + "/" + RoleId + "/" + UserID + "/" + Action + "/" + PKeyId)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


}

