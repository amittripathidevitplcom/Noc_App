import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { GlobalConstants } from '../../Common/GlobalConstants';
import { SSOLandingDataDataModel } from '../../Models/SSOLoginDataModel';
@Injectable({
  providedIn: 'root'
})
export class SSOLoginService {
  readonly APIUrl = GlobalConstants.apiURL + "SSOAPI";
  constructor(private http: HttpClient) { }
  extractData(res: Response) {
    return res;
  }
  handleErrorObservable(error: Response | any) {
    return throwError(error);
  }
  public async GetSSOUserLogionDetails(sSOLandingDataDataModel: SSOLandingDataDataModel) {
    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(sSOLandingDataDataModel);
    return await this.http.post(this.APIUrl + '/GetSSOUserLogionDetails/', body, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async CheckMappingSSOID(SSOID: string) {
    const headers = { 'content-type': 'application/json' }
    return await this.http.get(this.APIUrl + '/CheckMappingSSOID/' + SSOID, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
}
