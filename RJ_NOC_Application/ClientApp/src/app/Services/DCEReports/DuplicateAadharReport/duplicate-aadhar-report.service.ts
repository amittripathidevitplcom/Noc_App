import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError, } from 'rxjs/operators';
import { DuplicateAadharReportDataModel } from '../../../Models/DuplicateAadharReportDataModel';
import { GlobalConstants } from '../../../Common/GlobalConstants';


@Injectable({
  providedIn: 'root'
})
export class DuplicateAadharReportService {
  readonly APIUrl = GlobalConstants.apiURL + "DuplicateAadharReport";
  constructor(private http: HttpClient) { }
  extractData(res: Response) {
    return res;
  }
  handleErrorObservable(error: Response | any) {
    return throwError(error);
  }
  public async GetDuplicateAadhaarReportDatail(request: DuplicateAadharReportDataModel) {
    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + '/GetDuplicateAadhaarReportDatail/', body, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
}

