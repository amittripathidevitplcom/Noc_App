import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { GlobalConstants } from '../../Common/GlobalConstants';
import { OldNocDetailsDataModel } from '../../Models/TabDetailDataModel';

@Injectable({
  providedIn: 'root'
})
export class OldnocdetailService {
  readonly APIUrl = GlobalConstants.apiURL + "OldNOCDetail";
  constructor(private http: HttpClient) { }

  extractData(res: Response) {
    return res;
  }
  handleErrorObservable(error: Response | any) {
    // return Observable.throw(error);
    return throwError(error);
  }

  public async SaveData(OldNOCDetailDataModel: OldNocDetailsDataModel) {
    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(OldNOCDetailDataModel);
    console.log(body);
    return await this.http.post(this.APIUrl + '/SaveData', body, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetOldNOCDetailList_DepartmentCollegeWise(DepartmentID: number, CollegeID: number, OldNocID: number) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return await this.http.get(this.APIUrl + '/GetOldNOCDetailList_DepartmentCollegeWise/' + DepartmentID + "/" + CollegeID + "/" + OldNocID, httpOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async DeleteOldNocDetail(OldNocID: number) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return await this.http.post(this.APIUrl + '/DeleteOldNocDetail/' + OldNocID, httpOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
}
