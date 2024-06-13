import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { GlobalConstants } from '../../Common/GlobalConstants';
import { CourtOrderDataModel, CourtOrderSearchFilterDataModel } from '../../Models/TabDetailDataModel';

@Injectable({
  providedIn: 'root'
})
export class CourtOrderService {
  readonly APIUrl = GlobalConstants.apiURL + "CourtOrder";
  constructor(private http: HttpClient) { }
  extractData(res: Response) {
    return res;
  }
  handleErrorObservable(error: Response | any) {
    return throwError(error);
  }
  public async SaveData(request: CourtOrderDataModel) {
    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + "/SaveData", body, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetCourtOrderData(request: CourtOrderSearchFilterDataModel) {
    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + "/GetCourtOrderData", body, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async Delete(CourtOrderID: number, UserID: number) {
    return await this.http.post(this.APIUrl + "/Delete/" + CourtOrderID + '/' + UserID, null)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
}
