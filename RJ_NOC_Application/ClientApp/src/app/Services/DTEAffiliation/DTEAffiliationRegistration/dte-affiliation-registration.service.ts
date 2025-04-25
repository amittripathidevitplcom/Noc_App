import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DTEAffiliationRegistrationDataModel, BTERFeeMasterDataModel } from '../../../Models/DTEAffiliation/DTEAffiliationRegistration/DTEAffiliationRegistrationDataModel';
import { BTERApplicationOpensessionDataModel } from '../../../Models/BTERApplicationOpensessionMasterDataModel';
import { TotalCollegeReportSearchFilter, Generateorderforbter } from '../../../Models/SearchFilterDataModel';
import { GlobalConstants } from '../../../Common/GlobalConstants';
import { BTERPaymentHistoryeMitraDataModel } from '../../../Models/SearchFilterDataModel';
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
  public async ApplicationSubmit(DTE_ARId: number, ActionName: string, AMOUNT:number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl + "/ApplicationSubmit/" + DTE_ARId + "/" + ActionName + "/" + AMOUNT)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }  
  public async Generateorder_SaveData(request: Generateorderforbter) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = JSON.stringify(request);

    try {
      return await this.http.post(this.APIUrl + "/Generateorder_SaveData", body, { headers })
        .pipe(
          catchError(this.handleErrorObservable)
        ).toPromise();
    } catch (error) {
      console.error("Error in Generateorder_SaveData:", error);
      throw error;
    }
  }
  public async GetAllBTERFeeList(UserID: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl + "/" + UserID)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetAllLOIFeeList(UserID: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl + "/" + UserID)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async BTERFeeSaveData(request: BTERFeeMasterDataModel) {
    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + "/BTERFeeSaveData", body, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetBTERFeeByID(FeeID: number, UserID: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl + "/" + FeeID + "/" + UserID)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async BTERDeleteData(FeeID: number, UserID: number) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return await this.http.post(this.APIUrl + '/BTERDeleteData/' + FeeID + "/" + UserID, httpOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async SaveDataBTERApplicationOpenSession(request: BTERApplicationOpensessionDataModel) {
    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + "/SaveDataBTERApplicationOpenSession", body, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetAllOpenSessionApplicationList() {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return await this.http.get(this.APIUrl + '/GetAllOpenSessionApplicationList/', httpOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetByID(ID: number, UserID: number) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return await this.http.get(this.APIUrl + '/GetByIDOpenSessionApplicationList/' + ID , httpOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async DeleteData(ID: number, UserID: number) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return await this.http.post(this.APIUrl + '/DeleteDataOpenSessionApplicationList/' + ID + "/" + UserID, httpOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }  
  public async GetPaymenthistoryList(request: BTERPaymentHistoryeMitraDataModel, DepartmentID: number) {
    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + '/GetPaymenthistoryList/' + DepartmentID , body, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetAllCollegeList() {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return await this.http.get(this.APIUrl + '/GetAllCollegeList/', httpOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  
}
