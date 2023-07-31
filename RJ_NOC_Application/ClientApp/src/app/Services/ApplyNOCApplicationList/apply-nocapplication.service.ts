import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { ApplyNOCApplicationDataModel, CommiteeInspection_RNCCheckList_DataModel } from '../../Models/ApplyNOCApplicationDataModel';
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
  public async GetApplyNOCApplicationListByRole(RoleId: number, UserID: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl + "/GetApplyNOCApplicationListByRole/" + RoleId + "/" + UserID)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async DocumentScrutiny(RoleID: number, UserID: number, ActionID: number, ApplyNOCID: number, DepartmentID: number, CheckList_FinalRemark: string, NextRoleID: number, NextUserID: number, NextActionID: number) {
    const headers = { 'content-type': 'application/json' }
    var request = { ApplyNOCID: ApplyNOCID, RoleID: RoleID, UserID: UserID, ActionID: ActionID, DepartmentID: DepartmentID, Remark: CheckList_FinalRemark, NextRoleID: NextRoleID, NextUserID: NextUserID, NextActionID:NextActionID
};
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + '/DocumentScrutiny/', body, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async SaveDocumentScrutiny(request: DocumentScrutinyDataModel) {
    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(request);
    console.log(request);
    return await this.http.post(this.APIUrl + '/SaveDocumentScrutiny/', body, { 'headers': headers })
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

  public async SaveCommiteeInspectionRNCCheckList(request:CommiteeInspection_RNCCheckList_DataModel[]) {
    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + '/SaveCommiteeInspectionRNCCheckList/', body, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetApplyNOCCompletedReport(UserID: number, ActionName: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl + "/GetApplyNOCCompletedReport/" + UserID + "/" + ActionName)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetApplyNOCRejectedReport(UserID: number, ActionName: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl + "/GetApplyNOCRejectedReport/" + UserID + "/" + ActionName)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetPendingMedicalApplications(RoleID: number, UserID: number, ActionName: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl + "/GetPendingMedicalApplications/" + RoleID + "/" + UserID + "/" + ActionName)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetApplyNOCApplicationType(CollegeID: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl + "/GetApplyNOCApplicationType/" + CollegeID )
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GeneratePDFForJointSecretary(ApplyNOCID: number, DepartmentID: number, RoleID: number, UserID: number, NOCIssuedRemark: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl + "/GeneratePDFForJointSecretary/" + ApplyNOCID + "/" + DepartmentID + "/" + RoleID + "/" + UserID + "/" + NOCIssuedRemark )
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async CheckAppliedNOCCollegeWise(CollegeID: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl + "/CheckAppliedNOCCollegeWise/" + CollegeID)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
}

