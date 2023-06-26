import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { AcademicInformationDetailsDataModel } from '../../Models/AcademicInformationDetailsDataModel';
import { GlobalConstants } from '../../Common/GlobalConstants';

@Injectable({
  providedIn: 'root'
})
export class AcademicInformationDetailsService {

  readonly APIUrl = GlobalConstants.apiURL + "AcademicInformationDetails";

  constructor(private http: HttpClient) { }
  extractData(res: Response) {
    return res;
  }
  handleErrorObservable(error: Response | any) {
    return throwError(error);
  }
  public async SaveData(request: AcademicInformationDetailsDataModel) {
    
    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + "/SaveData", body, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetAcademicInformationDetailAllList(UserID: number) {
    
    return await this.http.get(this.APIUrl + "/GetAcademicInformationDetailAllList/" + UserID)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetAcademicInformationDetailByID(AcademicInformationID: number, UserID: number) {
    return await this.http.get(this.APIUrl + "/GetAcademicInformationDetailByID/" + AcademicInformationID + "/" + UserID)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async DeleteData(AcademicInformationID: number, UserID: number) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return await this.http.post(this.APIUrl + '/Delete/' + AcademicInformationID + "/" + UserID, httpOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
}
