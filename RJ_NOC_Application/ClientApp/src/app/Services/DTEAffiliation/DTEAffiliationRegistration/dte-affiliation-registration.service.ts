import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DTEAffiliationRegistrationDataModel } from '../../../Models/DTEAffiliation/DTEAffiliationRegistration/DTEAffiliationRegistrationDataModel';
import { GlobalConstants } from '../../../Common/GlobalConstants';
@Injectable({
  providedIn: 'root'
})
export class DTEAffiliationRegistrationService {
  readonly APIUrl = GlobalConstants.apiURL + "DTEAffilitionMaster";
  constructor(private http: HttpClient) { }
  extractData(res: Response) {
    return res;
  }
  handleErrorObservable(error: Response | any) {
    return throwError(error);
  }  
  public async SaveData(request: DTEAffiliationRegistrationDataModel) {
    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + "/DTEAffilitionSaveData", body, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async Edit_OnClick(DTE_ARId: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl + "/Edit_OnClick/" + DTE_ARId)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

 
}
