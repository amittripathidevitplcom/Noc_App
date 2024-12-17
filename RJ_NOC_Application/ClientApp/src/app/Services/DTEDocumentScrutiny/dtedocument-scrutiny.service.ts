import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { GlobalConstants } from '../../Common/GlobalConstants';
@Injectable({
  providedIn: 'root'
})
export class DTEDocumentScrutinyService {
  readonly APIUrl = GlobalConstants.apiURL + "DepartmentOfTechnicalDocumentScrutiny";
  readonly DTEAPIUrl = GlobalConstants.apiURL + "DTECommitteeMaster";
  constructor(private http: HttpClient) { }
  extractData(res: Response) {
    return res;
  }
  handleErrorObservable(error: Response | any) {
    return throwError(error);
  }
  //Get 
  public async DocumentScrutiny_LandDetails(CollageID: number, RoleID: number, ApplyNOCID: number, VerificationStep: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.post(this.APIUrl + "/DocumentScrutiny_LandDetails/" + CollageID + "/" + RoleID + "/" + ApplyNOCID + "/" + VerificationStep, httpOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async DocumentScrutiny_CollegeDocument(DepartmentID: number, CollageID: number, RoleID: number, ApplyNOCID: number, Type: string, VerificationStep: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.post(this.APIUrl + "/DocumentScrutiny_CollegeDocument/" + DepartmentID + "/" + CollageID + "/" + RoleID + "/" + ApplyNOCID + "/" + Type + "/" + VerificationStep, httpOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async DocumentScrutiny_OtherInformation(CollageID: number, RoleID: number, ApplyNOCID: number, VerificationStep: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.post(this.APIUrl + "/DocumentScrutiny_OtherInformation/" + CollageID + "/" + RoleID + "/" + ApplyNOCID + "/" + VerificationStep, httpOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async DocumentScrutiny_HostelDetail(CollageID: number, RoleID: number, ApplyNOCID: number, VerificationStep: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.post(this.APIUrl + "/DocumentScrutiny_HostelDetail/" + CollageID + "/" + RoleID + "/" + ApplyNOCID + "/" + VerificationStep, httpOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async DocumentScrutiny_AcademicInformation(CollageID: number, RoleID: number, ApplyNOCID: number, VerificationStep: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.post(this.APIUrl + "/DocumentScrutiny_AcademicInformation/" + CollageID + "/" + RoleID + "/" + ApplyNOCID + "/" + VerificationStep, httpOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async DocumentScrutiny_CollegeManagementSociety(CollageID: number, RoleID: number, ApplyNOCID: number, VerificationStep: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.post(this.APIUrl + "/DocumentScrutiny_CollegeManagementSociety/" + CollageID + "/" + RoleID + "/" + ApplyNOCID + "/" + VerificationStep, httpOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async DocumentScrutiny_LegalEntity(CollegeID: number, RoleID: number, ApplyNOCID: number, VerificationStep: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.post(this.APIUrl + "/DocumentScrutiny_LegalEntity/" + CollegeID + "/" + RoleID + "/" + ApplyNOCID + "/" + VerificationStep, httpOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async DocumentScrutiny_CollegeDetail(CollegeID: number, RoleID: number, ApplyNOCID: number, VerificationStep: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.post(this.APIUrl + "/DocumentScrutiny_CollegeDetail/" + CollegeID + "/" + RoleID + "/" + ApplyNOCID + "/" + VerificationStep, httpOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  //Get 
  public async DocumentScrutiny_FacilityDetail(CollageID: number, RoleID: number, ApplyNOCID: number, VerificationStep: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.post(this.APIUrl + "/DocumentScrutiny_FacilityDetail/" + CollageID + "/" + RoleID + "/" + ApplyNOCID + "/" + VerificationStep, httpOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  //Get 
  public async DocumentScrutiny_RoomDetail(CollageID: number, RoleID: number, ApplyNOCID: number, VerificationStep: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.post(this.APIUrl + "/DocumentScrutiny_RoomDetail/" + CollageID + "/" + RoleID + "/" + ApplyNOCID + "/" + VerificationStep, httpOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  //Get 
  public async DocumentScrutiny_BuildingDetails(CollageID: number, RoleID: number, ApplyNOCID: number, VerificationStep: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.post(this.APIUrl + "/DocumentScrutiny_BuildingDetails/" + CollageID + "/" + RoleID + "/" + ApplyNOCID + "/" + VerificationStep, httpOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  //Get 
  public async DocumentScrutiny_StaffDetails(CollageID: number, RoleID: number, ApplyNOCID: number, VerificationStep: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.post(this.APIUrl + "/DocumentScrutiny_StaffDetails/" + CollageID + "/" + RoleID + "/" + ApplyNOCID + "/" + VerificationStep, httpOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  //Get 
  public async DocumentScrutiny_OldNOCDetails(CollageID: number, RoleID: number, ApplyNOCID: number, VerificationStep: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.post(this.APIUrl + "/DocumentScrutiny_OldNOCDetails/" + CollageID + "/" + RoleID + "/" + ApplyNOCID + "/" + VerificationStep, httpOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async DocumentScrutiny_CourseDetails(CollageID: number, RoleID: number, ApplyNOCID: number, VerificationStep: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.post(this.APIUrl + "/DocumentScrutiny_CourseDetails/" + CollageID + "/" + RoleID + "/" + ApplyNOCID + "/" + VerificationStep, httpOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async CheckDocumentScrutinyTabsData(ApplyNOCID: number, RoleID: number, CollegeID: number, VerificationStep: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl + "/CheckDocumentScrutinyTabsData/" + ApplyNOCID + "/" + RoleID + "/" + CollegeID + "/" + VerificationStep)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetApplyNOCApplicationList(RoleId: number, UserID: number, Status: string, ActionName: string,SessionYear:number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl + "/GetApplyNOCApplicationList/" + RoleId + "/" + UserID + "/" + Status + "/" + ActionName + "/" + SessionYear)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async WorkflowInsertDTE(RoleID: number, UserID: number, ActionID: number, ApplyNOCID: number, DepartmentID: number, CheckList_FinalRemark: string, NextRoleID: number, NextUserID: number, NextActionID: number) {
    const headers = { 'content-type': 'application/json' }
    var request = {
      ApplyNOCID: ApplyNOCID, RoleID: RoleID, UserID: UserID, ActionID: ActionID, DepartmentID: DepartmentID, Remark: CheckList_FinalRemark, NextRoleID: NextRoleID, NextUserID: NextUserID, NextActionID: NextActionID
    };
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + '/WorkflowInsertDTE/', body, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GeneratePDF_DTENOC(NOCID: number, UserID: number, NOCRemark: string, IsNOCIssued: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    var request = { ApplyNOCID: NOCID, UserID: UserID, Remark: NOCRemark, IsNOCIssued: IsNOCIssued }
    return await this.http.post(this.APIUrl + "/GeneratePDF_DTENOC/", request, httpOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async PdfEsign(ApplyNOCID: number, CreatedBy: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.post(this.APIUrl + "/PdfEsign/" + ApplyNOCID + "/" + CreatedBy, httpOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async ReceiptPdfEsign(ApplyNOCID: number, CreatedBy: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.post(this.APIUrl + "/ReceiptPdfEsign/" + ApplyNOCID + "/" + CreatedBy, httpOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetApplicationCommitteeList(DTECommitteeMasterID: number) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return await this.http.get(this.DTEAPIUrl + '/GetDTECommitteeMasterList/' + DTECommitteeMasterID, httpOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GenerateReceipt(CollegeID: number, DepartmentID: number, ApplyNOCID: number, UserID: number, DocumentName: string, IsEsign: boolean) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    var request = { CollegeID: CollegeID, DepartmentID: DepartmentID, ApplyNOCID: ApplyNOCID, UserID: UserID, DocumentName: DocumentName, IsEsign: IsEsign }
    return await this.http.post(this.APIUrl + "/GenerateReceipt/", request, httpOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GenerateConsolidatedReport(CollegeID: number, DepartmentID: number, ApplyNOCID: number, UserID: number, DocumentName: string, IsEsign: boolean) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    var request = { CollegeID: CollegeID, DepartmentID: DepartmentID, ApplyNOCID: ApplyNOCID, UserID: UserID, DocumentName: DocumentName, IsEsign: IsEsign }
    return await this.http.post(this.APIUrl + "/GenerateConsolidatedReport/", request, httpOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetConsolidatedReportByApplyNOCID(ApplyNOCID: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl + "/GetConsolidatedReportByApplyNOCID/" + ApplyNOCID)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async UploadConsolidatedReport(CollegeID: number, DepartmentID: number, ApplyNOCID: number, UserID: number, DocumentName: string, IsEsign: boolean) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    var request = { CollegeID: CollegeID, DepartmentID: DepartmentID, ApplyNOCID: ApplyNOCID, UserID: UserID, DocumentName: DocumentName, IsEsign: IsEsign }
    return await this.http.post(this.APIUrl + "/UploadConsolidatedReport/", request, httpOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async UploadInspectionReport(CollegeID: number, DepartmentID: number, ApplyNOCID: number, UserID: number, DocumentName: string, IsEsign: boolean) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    var request = { CollegeID: CollegeID, DepartmentID: DepartmentID, ApplyNOCID: ApplyNOCID, UserID: UserID, DocumentName: DocumentName, IsEsign: IsEsign }
    return await this.http.post(this.APIUrl + "/UploadInspectionReport/", request, httpOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GenerateDTEActionSummaryPDF(ApplyNOCID: number) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return await this.http.get(this.APIUrl + '/GenerateDTEActionSummaryPDF/' + ApplyNOCID, httpOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
}
