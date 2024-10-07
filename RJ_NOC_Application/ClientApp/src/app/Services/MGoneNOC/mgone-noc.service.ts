import { Injectable } from '@angular/core';
import { GlobalConstants } from '../../Common/GlobalConstants';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MGoneNOCService {
  readonly APIUrl = GlobalConstants.apiURL + "MGOneNOC";
  readonly APIUrl_CommonMaster = GlobalConstants.apiURL + "CommonFuncation";
  constructor(private http: HttpClient) { }
  extractData(res: Response) {
    return res;
  }
  handleErrorObservable(error: Response | any) {
    return throwError(error);
  }
  //Get 
  public async GetNOCApplicationList(Userid: number, RoleID: number, Status: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl + "/GetNOCApplicationList/" + Userid + "/" + RoleID + "/" + Status, httpOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SaveNOCWorkFlow(RoleID: number, UserID: number, ActionID: number, ApplyNOCID: number, DepartmentID: number, CheckList_FinalRemark: string, NextRoleID: number, NextUserID: number, NextActionID: number, UploadDocument: string = '', MOMFiledoc: string = '') {
    const headers = { 'content-type': 'application/json' }
    var request = {
      ApplyNOCID: ApplyNOCID, RoleID: RoleID, UserID: UserID, ActionID: ActionID, DepartmentID: DepartmentID, Remark: CheckList_FinalRemark, NextRoleID: NextRoleID, NextUserID: NextUserID, NextActionID: NextActionID, UploadDocument: UploadDocument, MOMDocument: MOMFiledoc
    };
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + '/SaveNOCWorkFlow/', body, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async SaveNOCWorkFlowDock(ApplyNOCID: number, UserID: number, DepartmentID: number, MeetingScheduleDate: string = '') {
    const headers = { 'content-type': 'application/json' }
    var request = {
      ApplyNOCID: ApplyNOCID, UserID: UserID, DepartmentID: DepartmentID, MeetingScheduleDate: MeetingScheduleDate
    };
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + '/SaveNOCWorkFlowDock/', body, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetNOCWorkFlowDock(ApplyNOCID: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl + "/GetNOCWorkFlowDock/" + ApplyNOCID, httpOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetWorkFlowActionListByRole(RoleID: number, Type: string, DepartmentID: number, NOCType:string, ApplyNOCID: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl_CommonMaster + "/GetWorkFlowActionListByRole/" + RoleID + "/" + Type + "/" + DepartmentID + "/" + NOCType + "/" + ApplyNOCID)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetRoleListForApporval(RoleID: number, DepartmentID: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl_CommonMaster + "/GetRoleListForApporval/" + RoleID + "/" + DepartmentID)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetUserDetailsByRoleID(RoleID: number, DepartmentID: number, ApplyNOCID: number = 0) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl_CommonMaster + "/GetUserDetailsByRoleID/" + RoleID + "/" + DepartmentID + "/" + ApplyNOCID)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async SaveInspectionReport(DepartmentID: number, CollegeID: number, ApplyNOCID: number, UserID: number, InspectionReport: string = '') {
    const headers = { 'content-type': 'application/json' }
    var request = {
      DepartmentID: DepartmentID, CollegeID: CollegeID, ApplyNOCID: ApplyNOCID, UserID: UserID, UploadDocument: InspectionReport
    };
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + '/SaveInspectionReport/', body, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GenerateOrderForInspectionReport(DepartmentID: number, CollegeID: number, ApplyNOCID: number, UserID: number, GenerateOrderReport: string = '') {
    const headers = { 'content-type': 'application/json' }
    var request = {
      DepartmentID: DepartmentID, CollegeID: CollegeID, ApplyNOCID: ApplyNOCID, UserID: UserID, UploadDocument: GenerateOrderReport
    };
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + '/GenerateOrderForInspectionReport/', body, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async FinalNOCRejectRelese(ApplyNOCID: number, DepartmentID: number, RoleID: number, UserID: number, NOCIssuedRemark: string, Status: string,ActionID: number,NextRoleID: number, NextUserID: number) {
    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify({ ApplyNOCID: ApplyNOCID, DepartmentID: DepartmentID, RoleID: RoleID, UserID: UserID, NOCIssuedRemark: NOCIssuedRemark, Status: Status, ActionID: ActionID, NextRoleID: NextRoleID, NextUserID: NextUserID });
    return await this.http.post(this.APIUrl + '/FinalNOCRejectRelese', body, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async UpdateNOCPDFData(ActionType: string, DepartmentID: number, ApplyNocID: number, CollegeID: number, UserID: number, RoleID: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl + "/UpdateNOCPDFData/" + ApplyNocID + "/" + DepartmentID + "/" + CollegeID + "/" + ActionType + "/" + UserID + "/" + RoleID)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
}
