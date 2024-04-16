import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { GlobalConstants } from '../../Common/GlobalConstants';
@Injectable({
  providedIn: 'root'
})
export class NocInformationService {
  readonly APIUrl = GlobalConstants.apiURL + "ApplyNOC";
  constructor(private http: HttpClient) {
  }
  extractData(res: Response) {
    return res;
  }
  handleErrorObservable(error: Response | any) {
    return throwError(error);
  }
  public async GetNocInformation(SearchRecordID: any) {
    return await this.http.get(`${this.APIUrl}/GetNocInformation/${SearchRecordID}`)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
}
