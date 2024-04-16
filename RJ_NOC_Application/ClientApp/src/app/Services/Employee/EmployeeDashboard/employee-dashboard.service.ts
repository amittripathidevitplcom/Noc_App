import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { GlobalConstants } from '../../../Common/GlobalConstants';
@Injectable({
  providedIn: 'root'
})
export class EmployeeDashboardService {
  readonly APIUrl = GlobalConstants.apiURL + "EmployeeDashboard";
  constructor(private http: HttpClient) { }
  extractData(res: Response) {
    return res;
  }
  handleErrorObservable(error: Response | any) {
    return throwError(error);
  }
  //Get 
  public async EmployeeDocumentStatusCounts(ProjectID: number, EmployeeID: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl + "/EmployeeDocumentStatusCounts/" + ProjectID + "/" + EmployeeID)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async Save_ProjectWiseEmployeeDocuments(ProjectID: number, EmployeeID: number, DID: number, DocumentName: string) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return await this.http.post(this.APIUrl + '/Save_ProjectWiseEmployeeDocuments/' + ProjectID + "/" + EmployeeID + "/" + DID + "/" + DocumentName, httpOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
}
