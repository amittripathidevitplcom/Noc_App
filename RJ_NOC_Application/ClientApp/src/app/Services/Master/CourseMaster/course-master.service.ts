import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { CourseMasterAddDataModel } from '../../../Models/CourseMasterAddDataModel';

import { GlobalConstants } from '../../../Common/GlobalConstants';
@Injectable({
  providedIn: 'root'
})
export class CourseMasterService {
  readonly APIUrl = GlobalConstants.apiURL + "AddCourseMaster";
  constructor(private http: HttpClient) { }
  extractData(res: Response) {
    return res;
  }
  handleErrorObservable(error: Response | any) {
    // return Observable.throw(error);
    return throwError(error);
  }
  //Get 
  public async GetAllCourseList(UserID: number, DepartmentID:number) {
    debugger;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl + '/GetAllCourseList/' + UserID + "/" + DepartmentID)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async SaveData(request: CourseMasterAddDataModel) {
    debugger;
    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl, body, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetCourseIDWise(CourseID: number, UserID: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl + '/GetCourseIDWise/' + CourseID + "/" + UserID)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async DeleteData(CourseID: number, UserID: number) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return await this.http.post(this.APIUrl + '/Delete/' + CourseID + "/" + UserID, httpOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

}


