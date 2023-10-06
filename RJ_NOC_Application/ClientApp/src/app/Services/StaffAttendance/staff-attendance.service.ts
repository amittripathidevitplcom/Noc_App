
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
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
    // return Observable.throw(error);
    return throwError(error);
  }
  //Get

  public async GetStaffList_CollegeWise(CollegeID: number, CourseID: number) {
    const headers = { 'content-type': 'application/json' }
    return await this.http.get(this.APIUrl + "/GetStaffList_CollegeWise/" + CollegeID + "/" + CourseID, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SaveStaffAttendanceData(StaffAttendanceDataModel: StaffAttendanceDataModel) {
    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(StaffAttendanceDataModel);
    console.log(body);
    return await this.http.post(this.APIUrl + '/SaveStaffAttendanceData', body, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

}
