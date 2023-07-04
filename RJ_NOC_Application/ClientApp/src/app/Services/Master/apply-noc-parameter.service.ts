import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalConstants } from '../../Common/GlobalConstants';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { ApplyNocParameterDataModel } from '../../Models/ApplyNocParameterDataModel';

@Injectable({
  providedIn: 'root'
})
export class ApplyNocParameterService {

  readonly APIUrl = GlobalConstants.apiURL + "ApplyNocParameterMaster";

  constructor(private http: HttpClient) { }

  extractData(res: Response) {
    return res;
  }

  handleErrorObservable(error: Response | any) {
    // return Observable.throw(error);
    return throwError(error);
  }

  public async GetApplyNocParameterMaster(CollegeID: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl + "/GetApplyNocParameterMaster/" + CollegeID)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SaveApplyNocApplication(request: ApplyNocParameterDataModel) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let body = JSON.stringify(request)
    return await this.http.post(this.APIUrl + "/SaveApplyNocApplication/", body, httpOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetApplyNocForByParameter(CollegeID: number, ApplyNocFor: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let response: any;
    if (ApplyNocFor == 'TNOC Extension') {
      response = await this.http.get(this.APIUrl + "/GetApplyNocFor_TNOCExtension/" + CollegeID + "/" + ApplyNocFor)
        .pipe(
          catchError(this.handleErrorObservable)
        ).toPromise();
    }
    if (ApplyNocFor == 'Addition of New Seats(60)') {
      response = await this.http.get(this.APIUrl + "/GetApplyNocFor_AdditionOfNewSeats60/" + CollegeID + "/" + ApplyNocFor)
        .pipe(
          catchError(this.handleErrorObservable)
        ).toPromise();
    }
    return response;
  }

}
