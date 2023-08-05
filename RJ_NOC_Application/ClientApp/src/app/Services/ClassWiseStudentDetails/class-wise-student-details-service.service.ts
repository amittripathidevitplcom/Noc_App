import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { GlobalConstants } from '../../Common/GlobalConstants';
import { AadharServiceDataModel } from '../../Models/AadharServiceDataModel';
import { PostClassWiseStudentDetailsDataModel } from '../../Models/ClassWiseStudentDetailsDataModel';

@Injectable({
  providedIn: 'root'
})
export class ClassWiseStudentDetailsServiceService {

  readonly APIUrl = GlobalConstants.apiURL + "ClassWiseStudentDetails";

  constructor(private http: HttpClient) { }
  extractData(res: Response) {
    return res;
  }
  handleErrorObservable(error: Response | any) {
    return throwError(error);
  }

  public async GetCollegeWiseStudenetDetails(CollegeID: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl + "/GetCollegeWiseStudenetDetails/" + CollegeID)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SaveData(request: PostClassWiseStudentDetailsDataModel)
  {
    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl, body, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

}

