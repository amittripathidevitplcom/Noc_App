import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { GlobalConstants } from '../../Common/GlobalConstants';
import { CommiteeInspection_RNCCheckList_DataModel } from '../../Models/ApplyNOCApplicationDataModel';
@Injectable({
  providedIn: 'root'
})
export class MGOneDocumentScrutinyService {
  readonly APIUrl = GlobalConstants.apiURL + "MGOneDocumentScrutiny";
  constructor(private http: HttpClient) { }
  extractData(res: Response) {
    return res;
  }
  handleErrorObservable(error: Response | any) {
    return throwError(error);
  }
  //Get 
  public async DocumentScrutiny_LandDetails(CollageID: number, RoleID: number, ApplyNOCID: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.post(this.APIUrl + "/DocumentScrutiny_LandDetails/" + CollageID + "/" + RoleID + "/" + ApplyNOCID, httpOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async DocumentScrutiny_CollegeDocument(DepartmentID: number, CollageID: number, RoleID: number, ApplyNOCID: number, Type: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.post(this.APIUrl + "/DocumentScrutiny_CollegeDocument/" + DepartmentID + "/" + CollageID + "/" + RoleID + "/" + ApplyNOCID + "/" + Type, httpOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async DocumentScrutiny_HospitalDetail(CollageID: number, RoleID: number, ApplyNOCID: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.post(this.APIUrl + "/DocumentScrutiny_HospitalDetail/" + CollageID + "/" + RoleID + "/" + ApplyNOCID, httpOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async DocumentScrutiny_CollegeManagementSociety(CollageID: number, RoleID: number, ApplyNOCID: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.post(this.APIUrl + "/DocumentScrutiny_CollegeManagementSociety/" + CollageID + "/" + RoleID + "/" + ApplyNOCID, httpOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async DocumentScrutiny_LegalEntity(CollegeID: number, RoleID: number, ApplyNOCID: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.post(this.APIUrl + "/DocumentScrutiny_LegalEntity/" + CollegeID + "/" + RoleID + "/" + ApplyNOCID, httpOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async DocumentScrutiny_CollegeDetail(CollegeID: number, RoleID: number, ApplyNOCID: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.post(this.APIUrl + "/DocumentScrutiny_CollegeDetail/" + CollegeID + "/" + RoleID + "/" + ApplyNOCID, httpOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async DocumentScrutiny_BuildingDetails(CollageID: number, RoleID: number, ApplyNOCID: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.post(this.APIUrl + "/DocumentScrutiny_BuildingDetails/" + CollageID + "/" + RoleID + "/" + ApplyNOCID, httpOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async CheckDocumentScrutinyTabsData(ApplyNOCID: number, RoleID: number, CollegeID: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl + "/CheckDocumentScrutinyTabsData/" + ApplyNOCID + "/" + RoleID + "/" + CollegeID)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  //Nodal Officer Applicaiton List 
  public async GetLOIApplicationList(RoleId: number, UserID: number, Status: string, ActionName: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl + "/GetLOIApplicationList/" + RoleId + "/" + UserID + "/" + Status + "/" + ActionName)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GeneratePDF_MedicalGroupLOI(LOIID: number, UserID: number, LOIRemark: string, IsLOIIssued: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    var request = { LOIID: LOIID, UserID: UserID, Remark: LOIRemark, IsLOIIssued: IsLOIIssued }
    return await this.http.post(this.APIUrl + "/GeneratePDF_MedicalGroupLOIC/", request, httpOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async MedicalGroupLOIIssuedReport(LoginUserID: number, RoleID: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl + "/MedicalGroupLOIIssuedReport/" + LoginUserID + "/" + RoleID)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async PdfEsign(LOIID: number, CreatedBy: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.post(this.APIUrl + "/PdfEsign/" + LOIID + "/" + CreatedBy, httpOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetRNCCheckListByTypeDepartment(Type: string, DepartmentID: number, ApplyNOCID: number, CreatedBy: number, RoleID: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl + "/GetRNCCheckListByTypeDepartment/" + Type + "/" + DepartmentID + "/" + ApplyNOCID + "/" + CreatedBy + "/" + RoleID)
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
  public async GetRNCCheckListByRole(Type: string, ApplyNOCID: number, RoleID: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl + "/GetRNCCheckListByRole/" + Type + "/" + ApplyNOCID + "/" + RoleID)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async SubmitRevertApplication(LOIID: number, DepartmentID: number, CollegeID: number) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return await this.http.post(this.APIUrl + '/SubmitRevertApplication/' + LOIID + "/" + DepartmentID + "/" + CollegeID, httpOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetRevertApllicationRemark(DepartmentID: number, ApplicationID: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl + "/GetRevertApllicationRemark/" + DepartmentID + "/" + ApplicationID)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async DocumentScrutiny_FDRDetails(CollegeID: number, RoleID: number, ApplyNOCID: number) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return await this.http.get(this.APIUrl + '/DocumentScrutiny_FDRDetails/' + CollegeID + "/" + RoleID + "/" + ApplyNOCID, httpOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async DocumentScrutiny_PaymentDetails(CollegeID: number, RoleID: number, ApplyNOCID: number) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return await this.http.get(this.APIUrl + '/DocumentScrutiny_PaymentDetails/' + CollegeID + "/" + RoleID + "/" + ApplyNOCID, httpOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
}
