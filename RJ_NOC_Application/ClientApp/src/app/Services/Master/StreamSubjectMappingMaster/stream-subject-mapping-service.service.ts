import { GlobalConstants } from '../../../Common/GlobalConstants';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { StreamSubjectMappingDetailDataModel } from '../../../Models/StreamSubjectMappingDetailDataModel';

@Injectable({
  providedIn: 'root'
})
export class StreamSubjectMappingServiceService
{
  readonly APIUrl = GlobalConstants.apiURL + "StreamSubjectMappingMaster";
  constructor(private http: HttpClient) { }

  handleErrorObservable(error: Response | any) {
    // return Observable.throw(error);
    return throwError(error);
  }

  public async SaveData(request: StreamSubjectMappingDetailDataModel)
  {
    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl +"/SaveData", body, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetSubjectMappingList(request: StreamSubjectMappingDetailDataModel) {
    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + "/GetSubjectMappingList", body, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async GetByID(StreamMappingID: number, LoginSSOID: string, UserID: number)
  {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl+"/GetStreamMappingDetailsByID" + "/" + StreamMappingID + "/" + LoginSSOID + "/" + UserID)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async DeleteData(StreamMappingID: number, UserID: number)
  {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

    return await this.http.post(this.APIUrl + '/Delete/' + StreamMappingID + "/" + UserID, httpOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();

  }


}
