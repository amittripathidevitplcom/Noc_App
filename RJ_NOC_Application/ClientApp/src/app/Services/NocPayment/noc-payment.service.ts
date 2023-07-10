import { Injectable } from '@angular/core';
import { GlobalConstants } from '../../Common/GlobalConstants';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse, HttpParams } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { throwError } from 'rxjs/internal/observable/throwError';
import { RequestDetails } from '../../Models/PaymentDataModel';


@Injectable({
  providedIn: 'root'
})
export class NocpaymentService
{
  readonly APIUrl = GlobalConstants.apiURL + "Payment";
  constructor(private http: HttpClient) { }

  extractData(res: Response) {
    return res;
  }
  handleErrorObservable(error: Response | any)
  {
    // return Observable.throw(error);
    return throwError(error);
  }
  public async PaymentRequest(request: RequestDetails)
  {
    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl +"/PaymentRequest", body, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
}
