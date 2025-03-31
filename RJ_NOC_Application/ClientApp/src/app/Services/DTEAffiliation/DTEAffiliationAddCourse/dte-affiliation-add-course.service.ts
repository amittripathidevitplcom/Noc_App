import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DTEAffiliationAddCourseDataModel } from '../../../Models/DTEAffiliation/DTEAffiliationAddCourse/DTEAffiliationAddCourseDataModel';
import { GlobalConstants } from '../../../Common/GlobalConstants';
@Injectable({
  providedIn: 'root'
})
export class DTEAffiliationAddCourseService {
  readonly APIUrl = GlobalConstants.apiURL + "DTEAffilitionMaster";
  constructor(private http: HttpClient) { }
  extractData(res: Response) {
    return res;
  }
  handleErrorObservable(error: Response | any) {
    return throwError(error);
  }  
  public async SaveData(request: DTEAffiliationAddCourseDataModel) {
    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + "/DTEAffilitionCourseSaveData", body, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetDTEAffiliationCoursePreviewData(DepartmentID: number) {
    return await this.http.get(this.APIUrl + "/GetDTEAffiliationCoursePreviewData/" + DepartmentID)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetAllDTEAffiliationCourseList(BTERRegID:number) {
    return await this.http.get(this.APIUrl + '/GetAllDTEAffiliationCourseList/' + BTERRegID)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetAllBTERAffiliationCourseFeeList(BTERRegID: number) {
    return await this.http.get(this.APIUrl + '/GetAllBTERAffiliationCourseFeeList/' + BTERRegID)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetByID(BTERCourseID: number, LoginSSOID: string, UserID: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl + "/" + BTERCourseID + "/" + LoginSSOID + "/" + UserID)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async DeleteData(AffiliationCourseID: number, UserID: number) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

    return await this.http.post(this.APIUrl + '/Delete/' + AffiliationCourseID + "/" + UserID, httpOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async generateYears(YearofstartingID: string) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

    return await this.http.get(this.APIUrl + '/generateYears/' + YearofstartingID, httpOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetDeficiencyHistoryApplicationID(BTERRegID: number,ApplicationStatus:string) {
    return await this.http.get(this.APIUrl + '/GetDeficiencyHistoryApplicationID/' + BTERRegID + "/" + ApplicationStatus)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
}
