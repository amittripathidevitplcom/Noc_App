import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { StaffAttendanceDataModel } from '../../Models/StaffAttendanceDataModel';
import { GlobalConstants } from '../../Common/GlobalConstants';
@Injectable({
  providedIn: 'root'
})
export class StaffAttendanceService {
  readonly APIUrl = GlobalConstants.apiURL + "StaffAttendance";
  constructor(private http: HttpClient) { }
  extractData(res: Response) {
    return res;
  }
  handleErrorObservable(error: Response | any) {
    return throwError(error);
  }
  //Get
  public async GetStaffList_CollegeWise(CollegeID: number, StaffType: string, CourseID: number, Date: string) {
    const headers = { 'content-type': 'application/json' }
    return await this.http.get(this.APIUrl + "/GetStaffList_CollegeWise/" + CollegeID + "/" + StaffType + "/" + CourseID + "/" + Date, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async SaveStaffAttendanceData(StaffAttendanceDataModel: StaffAttendanceDataModel) {
    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(StaffAttendanceDataModel);
    return await this.http.post(this.APIUrl + '/SaveStaffAttendanceData', body, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetStaffAttendanceReportData(CollegeID: number, StaffType: string, CourseID: number, FromDate: string, ToDate: string, StatusID: number,) {
    const headers = { 'content-type': 'application/json' }
    return await this.http.get(this.APIUrl + "/GetStaffAttendanceReportData/" + CollegeID + "/" + StaffType + "/" + CourseID + "/" + FromDate + "/" + ToDate + "/" + StatusID, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
}
