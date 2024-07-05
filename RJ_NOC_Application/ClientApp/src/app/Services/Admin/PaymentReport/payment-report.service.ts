import { Injectable } from '@angular/core';
import { GlobalConstants } from '../../../Common/GlobalConstants';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentReportService {
  readonly APIUrl = GlobalConstants.apiURL + "PaymentReport";
  constructor(private http: HttpClient) { }
  extractData(res: Response) {
    return res;
  }
  handleErrorObservable(error: Response | any) {
    return throwError(error);
  }

  public async GetPaymentReport(FromDate: any, ToDate: any, DepartmentID: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl + "/GetPaymentReport/" + FromDate + "/" + ToDate + "/" + DepartmentID)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

}
