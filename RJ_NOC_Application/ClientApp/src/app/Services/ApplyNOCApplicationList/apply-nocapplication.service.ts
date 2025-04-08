import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError, } from 'rxjs/operators';
import { ApplicationPenaltyDataModel, CommiteeInspection_RNCCheckList_DataModel, NOCIssuedForMGOneDataModel, NOCIssuedRequestDataModel, ParameterFeeMaster, NOCIssuedForAHDegreeDataModel } from '../../Models/ApplyNOCApplicationDataModel';
import { DocumentScrutinyDataModel, BTERDocumentScrutinyDataModel } from '../../Models/DocumentScrutinyDataModel';
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
    return throwError(error);
  }
  //Get 
  public async GetApplyNOCApplicationListByRole(RoleId: number, UserID: number, DepartmentID: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl + "/GetApplyNOCApplicationListByRole/" + RoleId + "/" + UserID + "/" + DepartmentID)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async DocumentScrutiny(RoleID: number, UserID: number, ActionID: number, ApplyNOCID: number, DepartmentID: number, CheckList_FinalRemark: string, NextRoleID: number, NextUserID: number, NextActionID: number, UploadDocument: string='') {
    const headers = { 'content-type': 'application/json' }
    var request = {
      ApplyNOCID: ApplyNOCID, RoleID: RoleID, UserID: UserID, ActionID: ActionID, DepartmentID: DepartmentID, Remark: CheckList_FinalRemark, NextRoleID: NextRoleID, NextUserID: NextUserID, NextActionID: NextActionID, UploadDocument: UploadDocument
    };
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + '/DocumentScrutiny/', body, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SaveApplicationPenalty(request:ApplicationPenaltyDataModel) {
    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + '/SaveApplicationPenalty/', body, { 'headers': headers })
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
  public async SaveDocumentScrutinyLOI(request: DocumentScrutinyDataModel) {
    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(request);
    console.log(request);
    return await this.http.post(this.APIUrl + '/SaveDocumentScrutinyLOI/', body, { 'headers': headers })
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
  public async SaveCommiteeInspectionRNCCheckList(request: CommiteeInspection_RNCCheckList_DataModel[]) {
    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + '/SaveCommiteeInspectionRNCCheckList/', body, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetApplyNOCCompletedReport(UserID: number, ActionName: string, RoleID: number, DepartmentID: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl + "/GetApplyNOCCompletedReport/" + UserID + "/" + ActionName + "/" + RoleID + "/" + DepartmentID)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetApplyNOCRevertReport(UserID: number, ActionName: string, RoleID: number, DepartmentID: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl + "/GetApplyNOCRevertReport/" + UserID + "/" + ActionName + "/" + RoleID + "/" + DepartmentID)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GeForwardCommiteeAHList(UserID: number, ActionName: string, RoleID: number, DepartmentID: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl + "/GetForwardCommiteeAHList/" + UserID + "/" + ActionName + "/" + RoleID + "/" + DepartmentID)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetApplyNOCRejectedReport(UserID: number, ActionName: string, RoleID: number, DepartmentID: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl + "/GetApplyNOCRejectedReport/" + UserID + "/" + ActionName + "/" + RoleID + "/" + DepartmentID)
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
    return await this.http.get(this.APIUrl + "/GetApplyNOCApplicationType/" + CollegeID)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GeneratePDFForJointSecretary(ApplyNOCID: number, DepartmentID: number, RoleID: number, UserID: number, NOCIssuedRemark: string) {
    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify({ ApplyNOCID: ApplyNOCID, DepartmentID: DepartmentID, RoleID: RoleID, UserID: UserID, NOCIssuedRemark: NOCIssuedRemark });
    return await this.http.post(this.APIUrl + '/GeneratePDFForJointSecretary/', body, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GenerateNOCForDCE(request: NOCIssuedRequestDataModel) {
    const headers = { 'content-type': 'application/json' }
    return await this.http.post(this.APIUrl + '/GenerateNOCForDCE/', request, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GenerateNOCForAHDegree(request: NOCIssuedForAHDegreeDataModel) {
    const headers = { 'content-type': 'application/json' }
    return await this.http.post(this.APIUrl + '/GenerateNOCForAHDegree/', request, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GenerateEssentialityMgone(request: NOCIssuedForMGOneDataModel) {
    const headers = { 'content-type': 'application/json' }
    return await this.http.post(this.APIUrl + '/GenerateEssentialityMgone/', request, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GenerateDraftNOCForDCE(request: NOCIssuedRequestDataModel) {
    const headers = { 'content-type': 'application/json' }
    return await this.http.post(this.APIUrl + '/GenerateDraftNOCForDCE/', request, { 'headers': headers })
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
  public async GetIssuedNOCReportList(UserID: number, ActionName: string, RoleID: number, DepartmentID: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl + "/GetIssuedNOCReportList/" + UserID + "/" + ActionName + "/" + RoleID + "/" + DepartmentID)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetNocLateFees(DepartmentID: number) {
    return await this.http.get(this.APIUrl + "/GetNocLateFees/" + DepartmentID)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async SubmitRevertApplication(ApplyNOCID: number, DepartmentID: number) {
    const headers = { 'content-type': 'application/json' }
    var request = {
      ApplyNOCID: ApplyNOCID, DepartmentID: DepartmentID
    };
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + '/SubmitRevertApplication/', body, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetParameterFeeMaster(request: ParameterFeeMaster) {
    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + '/ParameterFeeMaster/', body, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetNOCIssuedReportListForAdmin(UserID: number, ActionName: string, RoleID: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl + "/GetNOCIssuedReportListForAdmin/" + UserID + "/" + ActionName + "/" + RoleID)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetAppliedParameterNOCForByApplyNOCID(ApplyNOCID: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl + "/GetAppliedParameterNOCForByApplyNOCID/" + ApplyNOCID)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetAppliedParameterEssentialityForByApplyNOCID(ApplyNOCID: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl + "/GetAppliedParameterEssentialityForByApplyNOCID/" + ApplyNOCID)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async CountTotalRevertDCE(ApplyNOCID: number, RoleID: number, UserID: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl + "/CountTotalRevertDCE/" + ApplyNOCID + "/" + RoleID + "/" + UserID)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetApplicationPenalty(ApplyNOCID: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl + "/GetApplicationPenalty/" + ApplyNOCID )
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetApplicationPenaltyList(SSOID: string, SessionYear: number=0) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl + "/GetApplicationPenaltyList/" + SSOID + "/" + SessionYear)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GenerateDraftNOCFor_DCE(request: NOCIssuedRequestDataModel) {
    const headers = { 'content-type': 'application/json' }
    return await this.http.post(this.APIUrl + '/GenerateDraftNOCFor_DCE/', request, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GenerateDraftEssentiality(request: NOCIssuedForMGOneDataModel) {
    const headers = { 'content-type': 'application/json' }
    return await this.http.post(this.APIUrl + '/GenerateDraftEssentiality/', request, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async ForwardToEsignDCE(ApplyNOCID: number, UserId: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl + "/ForwardToEsignDCE/" + ApplyNOCID + "/" + UserId)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async SaveBTERDocumentScrutiny(request: BTERDocumentScrutinyDataModel) {
    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(request);
    console.log(request);
    return await this.http.post(this.APIUrl + '/SaveBTERDocumentScrutiny/', body, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetAppliedParameterEssentialityForAffiliationorder() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl + "/GetAppliedParameterEssentialityForAffiliationorder/")
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  
}

