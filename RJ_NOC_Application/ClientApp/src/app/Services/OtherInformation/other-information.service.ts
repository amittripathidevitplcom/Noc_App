import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { OtherInformationDataModel } from '../../Models/OtherInformationDataModel';
import { GlobalConstants } from '../../Common/GlobalConstants';
import { PostCollegeLabInformation } from '../../Models/CollegeLabInformationDataModel';

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
  public async GetOtherInformationAllList(UserID: number, CollegeID: number) {
    
    return await this.http.get(this.APIUrl + "/GetOtherInformationAllList/" + UserID + "/" + CollegeID)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetOtherInformationByID(CollegeWiseOtherInfoID: number, UserID: number, CollegeID: number) {
    return await this.http.get(this.APIUrl + "/GetOtherInformationByID/" + CollegeWiseOtherInfoID + "/" + UserID + "/" + CollegeID)
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

  public async GetCollegeLabInformationList(CollegeID: number, Key: String) {

    return await this.http.get(this.APIUrl + "/GetCollegeLabInformationList/" + CollegeID + "/" + Key)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SaveLabData(request: PostCollegeLabInformation) {

    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + "/SaveLabData", body, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

}
