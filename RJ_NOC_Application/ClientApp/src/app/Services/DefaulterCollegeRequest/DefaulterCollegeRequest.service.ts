import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError, } from 'rxjs/operators';
import { DefaulterCollegeRequestDataModel, DefaulterCollegeSearchFilterDataModel } from '../../Models/DefaulterCollegeRequestDataModel';
import { GlobalConstants } from '../../Common/GlobalConstants';
import { ApplicationPenaltyDataModel } from '../../Models/ApplyNOCApplicationDataModel';

@Injectable({
  providedIn: 'root'
})
export class DefaulterCollegeRequestService {
  readonly APIUrl = GlobalConstants.apiURL + "DefaulterCollegeRequest";
  constructor(private http: HttpClient) { }
  extractData(res: Response) {
    return res;
  }
  handleErrorObservable(error: Response | any) {
    return throwError(error);
  }

  public async SaveData(request: DefaulterCollegeRequestDataModel) {
    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + "/SaveData", body, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetDefaulterCollegeRequestData(request: DefaulterCollegeSearchFilterDataModel) {
    const headers = { 'content-type': 'application/json' }
    return await this.http.post(this.APIUrl + '/GetDefaulterCollegeRequestData/', request, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async Delete(RequestID: number,UserID: number) {
    return await this.http.post(this.APIUrl + "/Delete/" + RequestID + '/' + UserID, null)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SaveDefaulterCollegePenalty(request: ApplicationPenaltyDataModel) {
    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + '/SaveDefaulterCollegePenalty/', body, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetDefaulterCollegePenalty(RequestID: number = 0, PenaltyID: number = 0) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl + "/GetDefaulterCollegePenalty/" + RequestID + "/" + PenaltyID)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async DeleteDefaulterCollegePenalty(PenaltyID: number) {
    const headers = { 'content-type': 'application/json' }
    return await this.http.post(this.APIUrl + '/DeleteDefaulterCollegePenalty/' + PenaltyID, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetDefaulterRequestCount(DepartmentID: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl + "/GetDefaulterRequestCount/" + DepartmentID)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

}
