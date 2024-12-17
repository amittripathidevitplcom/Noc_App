import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalConstants } from '../../Common/GlobalConstants';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApplyNocFDRDetailsDataModel, ApplyNocOfflinePaymentModal, ApplyNocParameterDataModel } from '../../Models/ApplyNocParameterDataModel';
@Injectable({
  providedIn: 'root'
})
export class ApplyNocParameterService {
  readonly APIUrl = GlobalConstants.apiURL + "ApplyNocParameterMaster";
  constructor(private http: HttpClient) { }
  extractData(res: Response) {
    return res;
  }
  handleErrorObservable(error: Response | any) {
    return throwError(error);
  }
  public async GetApplyNocParameterMaster(CollegeID: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl + "/GetApplyNocParameterMaster/" + CollegeID)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async SaveApplyNocApplication(request: ApplyNocParameterDataModel) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let body = JSON.stringify(request);
    console.log(body);
    return await this.http.post(this.APIUrl + "/SaveApplyNocApplication/", body, httpOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetApplyNocForByParameter(CollegeID: number, ApplyNocForCode: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let response: any;
    if (ApplyNocForCode == 'NewCourse') {
      response = await this.http.get(this.APIUrl + "/GetApplyNocFor_TNOCExtension/" + CollegeID + "/" + ApplyNocForCode)
        .pipe(
          catchError(this.handleErrorObservable)
        ).toPromise();
    }
    if (ApplyNocForCode == 'ANewSeats') {
      response = await this.http.get(this.APIUrl + "/GetApplyNocFor_AdditionOfNewSeats60/" + CollegeID + "/" + ApplyNocForCode)
        .pipe(
          catchError(this.handleErrorObservable)
        ).toPromise();
    }
    return response;
  }
  public async GetApplyNoc_FDRMasterByCollegeID(CollegeID: number) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return await this.http.get(this.APIUrl + '/GetApplyNoc_FDRMasterByCollegeID/' + CollegeID, httpOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async SaveApplyNoc_FDRMasterDetail(request: ApplyNocFDRDetailsDataModel) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let body = JSON.stringify(request)
    return await this.http.post(this.APIUrl + "/SaveApplyNoc_FDRMasterDetail/", body, httpOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetApplyNocFDRDetails(ApplyNocFDRID: number, ApplyNocID: number) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return await this.http.get(this.APIUrl + '/GetApplyNocFDRDetails/' + ApplyNocFDRID + "/" + ApplyNocID, httpOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetApplyNocApplicationList(SSOID: string, SessionYear: number=0) {
    return await this.http.get(this.APIUrl + "/GetApplyNocApplicationList" + "/" + SSOID + "/" + SessionYear)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetApplyNocApplicationByApplicationID(ApplyNocApplicationID: number) {
    return await this.http.get(this.APIUrl + "/GetApplyNocApplicationByApplicationID/" + ApplyNocApplicationID)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async DeleteApplyNocApplicationByApplicationID(ApplyNocApplicationID: number, ModifyBy: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.post(this.APIUrl + "/DeleteApplyNocApplicationByApplicationID/" + ApplyNocApplicationID + "/" + ModifyBy, httpOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetApplyNocPaymentHistoryApplicationID(ApplyNocApplicationID: number, PaymentFor: string) {
    return await this.http.get(this.APIUrl + "/GetApplyNocPaymentHistoryApplicationID/" + ApplyNocApplicationID + "/" + PaymentFor)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async FinalSubmitApplyNocApplicationByApplicationID(ApplyNocApplicationID: number, ModifyBy: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.post(this.APIUrl + "/FinalSubmitApplyNocApplicationByApplicationID/" + ApplyNocApplicationID + "/" + ModifyBy, httpOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetApplicationPaymentHistoryApplicationID(ApplyNocApplicationID: number) {
    return await this.http.get(this.APIUrl + "/GetApplicationPaymentHistoryApplicationID/" + ApplyNocApplicationID)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetNocLateFees(DepartmentID: number) {
    return await this.http.get(this.APIUrl + "/GetNocLateFees/" + DepartmentID)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetDefaulterCollegePenalty(CollegeID: number, Other1: string, Other2: string) {
    return await this.http.get(this.APIUrl + "/DefaulterCollegePenalty/" + CollegeID + "/" + Other1 + "/" + Other2)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetApplyNocApplicationLists(SelectedCollageID: number, SelectedDepartmentID: number,SessionYear:number) {
    return await this.http.get(this.APIUrl + "/GetApplyNocApplicationLists" + "/" + SelectedCollageID + "/" + SelectedDepartmentID + "/" + SessionYear)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async ViewApplyNocFDRDetailsByCollegeID(CollegeID: number, SessionYear: number) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return await this.http.get(this.APIUrl + '/ViewApplyNoc_FDRDetailsByCollegeID/' + CollegeID + "/" + SessionYear, httpOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetCourseSubjectByApplyNOCID(ApplyNOCID: number, ParameterID: number) {
    return await this.http.get(this.APIUrl + "/GetCourseSubjectByApplyNOCID/" + ApplyNOCID + "/" + ParameterID)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async SaveOfflinePaymnetDetail(request: ApplyNocOfflinePaymentModal) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let body = JSON.stringify(request)
    return await this.http.post(this.APIUrl + "/SaveOfflinePaymnetDetail/", body, httpOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetOfflinePaymentDetails(ApplyNocApplicationID: number, PaymentOfflineID: number, ActionName: string) {
    return await this.http.get(this.APIUrl + "/GetOfflinePaymentDetails/" + ApplyNocApplicationID + "/" + PaymentOfflineID + "/" + ActionName)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async SaveApplyNocMinisterFile(ApplyNocID: number, MinisterFile: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let body = { ApplyNocID: ApplyNocID, MinisterFile: MinisterFile };
    return await this.http.post(this.APIUrl + "/SaveApplyNocMinisterFile/", body, httpOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
}
