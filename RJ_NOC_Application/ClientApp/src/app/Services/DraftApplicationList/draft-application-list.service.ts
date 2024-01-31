import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { GlobalConstants } from '../../Common/GlobalConstants';



@Injectable({
  providedIn: 'root'
})
export class DraftApplicationListService { 
  readonly APIUrl_CommonMaster = GlobalConstants.apiURL + "CollegeMaster";

  constructor(private http: HttpClient) { } 
  extractData(res: Response) {
    return res;
  }
  handleErrorObservable(error: Response | any) {
    return throwError(error);
  }
  public async DraftApplicationList(LoginSSOID: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl_CommonMaster + "/DraftApplicationList/" + LoginSSOID)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async StatisticsCollegeList(LoginSSOID: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl_CommonMaster + "/StatisticsCollegeList/" + LoginSSOID)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async CollegeDetails(LoginSSOID: string,Type:string='College') {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl_CommonMaster + "/CollegeDetails/" + LoginSSOID + "/" + Type)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async ViewTotalCollegeDataByID(CollegeID: number, UserID: number) {
    return await this.http.get(this.APIUrl_CommonMaster + "/ViewTotalCollegeDataByID/" + CollegeID + "/" + UserID)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async LOIApplicationList(LoginSSOID: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl_CommonMaster + "/LOIApplicationList/" + LoginSSOID)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async LOIFinalSubmit_OTPVerification(CollegeID: number) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

    return await this.http.post(this.APIUrl_CommonMaster + '/LOIFinalSubmit_OTPVerification/' + CollegeID, httpOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();

  }
}
