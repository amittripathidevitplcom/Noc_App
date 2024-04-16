import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ScurtenyComitteeDataModel } from '../../Models/ScurtenyComitteeDataModel';
import { GlobalConstants } from '../../Common/GlobalConstants';
@Injectable({
  providedIn: 'root'
})
export class ScurtenyComitteeService {
  readonly APIUrl = GlobalConstants.apiURL + "ScurtenyComittee";
  constructor(private http: HttpClient) { }
  extractData(res: Response) {
    return res;
  }
  handleErrorObservable(error: Response | any) {
    return throwError(error);
  }
  public async SaveScurtenyComittee(request: ScurtenyComitteeDataModel) {
    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(request);
    console.log(body);
    return await this.http.post(this.APIUrl + '/SaveScurtenyComittee/', body, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
}


