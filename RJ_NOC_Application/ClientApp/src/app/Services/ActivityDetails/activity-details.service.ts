import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { ActivityDetailsDataModel } from '../../Models/ActivityDetailsDataModel';
import { GlobalConstants } from '../../Common/GlobalConstants';

@Injectable({
  providedIn: 'root'
})
export class ActivityDetailsService {
  readonly APIUrl = GlobalConstants.apiURL + "ActivityDetails";

  constructor(private http: HttpClient) { }
  extractData(res: Response) {
    return res;
  }
  handleErrorObservable(error: Response | any) {
    return throwError(error);
  }
  public async SaveData(request: ActivityDetailsDataModel, files: File) {

    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + "/SaveData", body, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetActivityDetailAllList(UserID: number, CollageID: number, ApplyNOCID: number = 0) {

    return await this.http.get(this.APIUrl + "/GetActivityDetailAllList/" + UserID + "/" + CollageID + "/" + ApplyNOCID)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetActivityDetailsByID(ActivityDetailID: number, UserID: number, CollageID: number) {
    return await this.http.get(this.APIUrl + "/GetActivityDetailsByID/" + ActivityDetailID + "/" + UserID + "/" + CollageID)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async DeleteData(ActivityDetailID: number, UserID: number) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return await this.http.post(this.APIUrl + '/Delete/' + ActivityDetailID + "/" + UserID, httpOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
}
