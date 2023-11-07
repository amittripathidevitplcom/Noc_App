import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { ExcelMemberDataModel, ImportExcelDataDataModel } from '../../Models/ImportExcelDataDataModel';
import { GlobalConstants } from '../../Common/GlobalConstants';

@Injectable({
  providedIn: 'root'
})

export class ImportExcelDataService {
  readonly APIUrl = GlobalConstants.apiURL + "ImportExcelData";
  constructor(private http: HttpClient) { }
  extractData(res: Response) {
    return res;
  }
  handleErrorObservable(error: Response | any) {
    return throwError(error);
  }

  //public SaveData(request: ImportExcelDataDataModel): Observable<any> {
  //  const headers = { 'content-type': 'application/json' }
  //  const body = JSON.stringify(request);
  //  return this.http.post(this.APIUrl, body, { 'headers': headers })
  //}

  public async SaveData(request: ImportExcelDataDataModel) {
    //debugger;
    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/SaveData`, body, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async UpdateSingleRow(FinancialYearName: string, request: ExcelMemberDataModel) {

    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/UpdateSingleRow/${FinancialYearName}`, body, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetImprtExcelData(SSOID: string, DepartmentID: number, CollageID: number, StaticsFileID: number, ActionType: string) {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl + "/GetImportExcelData/" + SSOID + "/" + DepartmentID + "/" + CollageID + "/" + StaticsFileID + "/" + ActionType)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetAppliedNocInformation(SSOID: string) {
    return await this.http.get(`${this.APIUrl}/GetLastAppliedNocInformation/${SSOID}`)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
}
