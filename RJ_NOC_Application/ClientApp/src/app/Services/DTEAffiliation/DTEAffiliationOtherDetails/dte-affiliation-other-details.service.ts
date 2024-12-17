import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DTEAffiliationOtherDetailsDataModel } from '../../../Models/DTEAffiliation/DTEAffiliationOtherDetails/DTEAffiliationOtherDetailsDataModel';
import { GlobalConstants } from '../../../Common/GlobalConstants';
@Injectable({
  providedIn: 'root'
})
export class DTEAffiliationOtherDetailsService {
  readonly APIUrl = GlobalConstants.apiURL + "DTEAffilitionMaster";
  constructor(private http: HttpClient) { }
  extractData(res: Response) {
    return res;
  }
  handleErrorObservable(error: Response | any) {
    return throwError(error);
  }  
  public async SaveData(request: DTEAffiliationOtherDetailsDataModel) {
    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + "/DTEAffilitionOtherDetailsSaveData", body, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetDTEAffiliationOtherDetailsPreviewData(DepartmentID: number) {
    return await this.http.get(this.APIUrl + "/GetDTEAffiliationOtherDetailsPreviewData/" + DepartmentID)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
 
}
