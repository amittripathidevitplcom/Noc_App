import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError, } from 'rxjs/operators';
import { DefaulterCollegeRequestDataModel } from '../../Models/DefaulterCollegeRequestDataModel';
import { GlobalConstants } from '../../Common/GlobalConstants';

@Injectable({
  providedIn: 'root'
})
export class DefaulterCollegeRequestService {
  readonly APIUrl = GlobalConstants.apiURL + "DefaulterCollegeRequest";
  constructor(private http: HttpClient) { }
  extractData(res: Response) {
    return res;
  }
  handleErrorObservable(error: Response | any) {
    return throwError(error);
  }

  public async SaveData(request: DefaulterCollegeRequestDataModel) {
    const headers = { 'content-type': 'application/json'}
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + "/SaveData", body, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


}
