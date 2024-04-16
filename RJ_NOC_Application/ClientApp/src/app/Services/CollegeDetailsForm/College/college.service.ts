import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError, } from 'rxjs/operators';
import { CollegeDataModel } from '../../../Models/CollegeDataModel';
import { GlobalConstants } from '../../../Common/GlobalConstants';
import { DCECollegesReportSearchFilter, TotalCollegeReportSearchFilter } from '../../../Models/SearchFilterDataModel';

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
    return await this.http.post(this.APIUrl + "/SaveData", body, { 'headers': headers })
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
  public async SaveLOIWorkFlow(RoleID: number, UserID: number, ActionID: number, ApplyNOCID: number, DepartmentID: number, CheckList_FinalRemark: string, NextRoleID: number, NextUserID: number, NextActionID: number) {
    const headers = { 'content-type': 'application/json' }
    var request = {
      ApplyNOCID: ApplyNOCID, RoleID: RoleID, UserID: UserID, ActionID: ActionID, DepartmentID: DepartmentID, Remark: CheckList_FinalRemark, NextRoleID: NextRoleID, NextUserID: NextUserID, NextActionID: NextActionID
    };
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + '/SaveLOIWorkFlow/', body, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetCollegesByDepartmentID(DepartmentID: number) {
    const headers = { 'content-type': 'application/json' }
    return await this.http.get(this.APIUrl + "/GetCollegesByDepartmentID/" + DepartmentID, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async TotalCollegeDetailsByDepartment(request: TotalCollegeReportSearchFilter) {
    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + '/TotalCollegeDetailsByDepartment/', body, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async CollegesReport(request: DCECollegesReportSearchFilter) {
    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + '/CollegesReport/', body, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
}
