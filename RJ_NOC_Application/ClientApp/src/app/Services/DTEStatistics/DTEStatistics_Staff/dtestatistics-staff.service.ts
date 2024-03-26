import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { GlobalConstants } from '../../../Common/GlobalConstants';
import { DTEStatisticsStaffDataModel_NonTeaching } from '../../../Models/DTEStatistics/DTEStatisticsStaffDataModel';

@Injectable({
  providedIn: 'root'
})
export class DTEStatisticsStaffService {

  readonly APIUrl = GlobalConstants.apiURL + "DTEStatistics_Staff";
  constructor(private http: HttpClient) { }

  extractData(res: Response) {
    return res;
  }
  handleErrorObservable(error: Response | any) {
    // return Observable.throw(error);
    return throwError(error);
  }
  //Get 
  public async TeachingStaff(CollegeID: number, EntryType: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl + "/TeachingStaff/" + CollegeID + "/" + EntryType)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


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
  public async SaveData(request: DTEStatisticsStaffDataModel_NonTeaching) {

    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl, body, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

}
