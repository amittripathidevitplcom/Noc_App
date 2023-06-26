import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { OtherInformationDataModel } from '../../Models/OtherInformationDataModel';
import { GlobalConstants } from '../../Common/GlobalConstants';

@Injectable({
  providedIn: 'root'
})
export class OtherInformationService {

  readonly APIUrl = GlobalConstants.apiURL + "OtherInformation";

  constructor(private http: HttpClient) { }
  extractData(res: Response) {
    return res;
  }
  handleErrorObservable(error: Response | any) {
    return throwError(error);
  }
  public async SaveData(request: OtherInformationDataModel, files: File) {
    
    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + "/SaveData", body, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetOtherInformationAllList(UserID: number) {
    
    return await this.http.get(this.APIUrl + "/GetOtherInformationAllList/" + UserID)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetOtherInformationByID(CollegeWiseOtherInfoID: number, UserID: number) {
    return await this.http.get(this.APIUrl + "/GetOtherInformationByID/" + CollegeWiseOtherInfoID + "/" + UserID)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async DeleteData(CollegeWiseOtherInfoID: number, UserID: number) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return await this.http.post(this.APIUrl + '/Delete/' + CollegeWiseOtherInfoID + "/" + UserID, httpOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
}
