import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { ApplyNOCApplicationDataModel } from '../../Models/ApplyNOCApplicationDataModel';
import { DocumentScrutinyDataModel, DocumentScrutinyList_DataModel } from '../../Models/DocumentScrutinyDataModel';

import { GlobalConstants } from '../../Common/GlobalConstants';
@Injectable({
  providedIn: 'root'
})
export class ApplyNOCApplicationService {
  readonly APIUrl = GlobalConstants.apiURL + "ApplyNOC";
  constructor(private http: HttpClient) { }
  extractData(res: Response) {
    return res;
  }
  handleErrorObservable(error: Response | any) {
    // return Observable.throw(error);
    return throwError(error);
  }
  //Get 
  public async GetApplyNOCApplicationListByRole(RoleId: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl + "/GetApplyNOCApplicationListByRole/" + RoleId)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async DocumentScrutiny(RoleID: number, UserID: number, ActionType: string, ApplyNOCID: number, DepartmentID: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.post(this.APIUrl + '/DocumentScrutiny/' + ApplyNOCID + '/' + RoleID + '/' + UserID + '/' + ActionType + '/' + DepartmentID, httpOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async SaveDocumentScrutiny(request: DocumentScrutinyDataModel) {
    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(request);
    console.log(request);
    return await this.http.post(this.APIUrl +'/SaveDocumentScrutiny/', body, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async GetDocumentScrutinyData_TabNameCollegeWise(TabName: string, CollegeID: number, RoleID: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl + "/GetDocumentScrutinyData_TabNameCollegeWise/" + TabName + '/' + CollegeID + '/' + RoleID)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetRevertApplyNOCApplicationDepartmentRoleWise(DepartmentID: number, RoleID: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl + "/GetRevertApplyNOCApplicationDepartmentRoleWise/" + '/' + DepartmentID + '/' + RoleID)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
}

