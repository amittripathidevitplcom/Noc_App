import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { CollegeDataModel, ContactDetailsDataModel } from '../../../Models/CollegeDataModel';
import { GlobalConstants } from '../../../Common/GlobalConstants';

@Injectable({
  providedIn: 'root'
})
export class CollegeService {
  readonly APIUrl = GlobalConstants.apiURL + "CollegeMaster";
  constructor(private http: HttpClient) { }

  extractData(res: Response) {
    return res;
  }

  handleErrorObservable(error: Response | any) {
    return throwError(error);
  }

  public async GetData(collegeId: number) {
    const headers = { 'content-type': 'application/json' }
    return await this.http.get(this.APIUrl + "/GetData/" + collegeId, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SaveData(request: CollegeDataModel) {
    
    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl +"/SaveData", body, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async DeleteData(collegeID: number, modifiedBy: number) {
    const headers = { 'content-type': 'application/json' }
    return await this.http.post(this.APIUrl + "/DeleteData/" + collegeID + "/" + modifiedBy, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

 public async MapSSOIDInCollege(collegeID: number, modifiedBy: number, SSOID: string) {
    const headers = { 'content-type': 'application/json' }
    return await this.http.post(this.APIUrl + "/MapSSOIDInCollege/" + collegeID + "/" + modifiedBy + "/" + SSOID, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async RevertedApplicationList(LoginSSOID: string) {
    const httpOptions =
    {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl + "/RevertedApplicationList/" + LoginSSOID)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async RejectedApplicationList(LoginSSOID: string) {
    const httpOptions =
    {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl + "/RejectedApplicationList/" + LoginSSOID)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

}
