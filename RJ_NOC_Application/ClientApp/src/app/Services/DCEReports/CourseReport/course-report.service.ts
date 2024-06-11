import { Injectable } from '@angular/core';
import { GlobalConstants } from '../../../Common/GlobalConstants';
import { HttpClient } from '@angular/common/http';
import { catchError, throwError } from 'rxjs'; 
import { CourseReportSearchFilter } from '../../../Models/SearchFilterDataModel';

@Injectable({
  providedIn: 'root'
})
export class CourseReportService {
  readonly APIUrl = GlobalConstants.apiURL + "CourseMaster";
  constructor(private http: HttpClient) { }
  extractData(res: Response) {
    return res;
  }
  handleErrorObservable(error: Response | any) {
    return throwError(error);
  }
  //public async GetData(collegeId: number) {
  //  const headers = { 'content-type': 'application/json' }
  //  return await this.http.get(this.APIUrl + "/GetData/" + collegeId, { 'headers': headers })
  //    .pipe(
  //      catchError(this.handleErrorObservable)
  //    ).toPromise();
  //}
  //public async SaveData(request: CollegeDataModel) {
  //  const headers = { 'content-type': 'application/json' }
  //  const body = JSON.stringify(request);
  //  return await this.http.post(this.APIUrl + "/SaveData", body, { 'headers': headers })
  //    .pipe(
  //      catchError(this.handleErrorObservable)
  //    ).toPromise();
  //}
  public async CoursesReport(request: CourseReportSearchFilter) {
    debugger;
    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + '/CoursesReport/', body, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
}
