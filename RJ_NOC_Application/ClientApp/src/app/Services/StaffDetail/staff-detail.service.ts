import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { GlobalConstants } from '../../Common/GlobalConstants';
import { StaffDetailDataModel, StaffDetailDataModel_Excel } from '../../Models/TabDetailDataModel';
@Injectable({
  providedIn: 'root'
})
export class StaffDetailService {
  readonly APIUrl = GlobalConstants.apiURL + "StaffDetail";
  constructor(private http: HttpClient) { }
  extractData(res: Response) {
    return res;
  }
  handleErrorObservable(error: Response | any) {
    return throwError(error);
  }
  public async SaveData(StaffDataModel: StaffDetailDataModel) {
    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(StaffDataModel);
    return await this.http.post(this.APIUrl + '/SaveData', body, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async SaveData_ExcelData(StaffDataModel: StaffDetailDataModel_Excel) {
    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(StaffDataModel);
    return await this.http.post(this.APIUrl + '/SaveData_ExcelData', body, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetStaffDetailList_DepartmentCollegeWise(DepartmentID: number, CollegeID: number, StaffDetailID: number, ApplyNOCID: number = 0) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return await this.http.get(this.APIUrl + '/GetStaffDetailList_DepartmentCollegeWise/' + DepartmentID + "/" + CollegeID + "/" + StaffDetailID + "/" + ApplyNOCID, httpOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async DeleteStaffDetail(StaffDetailID: number) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return await this.http.post(this.APIUrl + '/DeleteStaffDetail/' + StaffDetailID, httpOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetStaffDetailsListForPDF(DepartmentID: number, CollegeID: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl + "/GetStaffDetailListForPDF/" + DepartmentID + "/" + CollegeID)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
}
