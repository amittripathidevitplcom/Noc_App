import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { GlobalConstants } from '../../../Common/GlobalConstants';
import { StudentEnrollmentDistanceModeDataModel } from '../../../Models/DTEStatistics/StudentEnrollmentDistanceModeDataModel';
@Injectable({
  providedIn: 'root'
})
export class StudentEnrollmentDistanceModeService {
  readonly APIUrl = GlobalConstants.apiURL + "DTEStatistics_StudentEnrollmentDistanceMode";
  constructor(private http: HttpClient) { }
  extractData(res: Response) {
    return res;
  }
  handleErrorObservable(error: Response | any) {
    return throwError(error);
  }
  //Get 
  public async GetByID(CollegeID: number, UserID: number, EntryType: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl + "/" + CollegeID + "/" + UserID + "/" + EntryType)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async SaveData(request: StudentEnrollmentDistanceModeDataModel) {
    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl, body, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
}
