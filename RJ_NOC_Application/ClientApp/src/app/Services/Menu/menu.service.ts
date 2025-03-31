import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { GlobalConstants } from '../../Common/GlobalConstants';
import { MenuDataModel } from '../../Models/MenuDataModel';
@Injectable({
  providedIn: 'root'
})
export class MenuService {
  readonly APIUrl = GlobalConstants.apiURL + "Menu";
  readonly SSOAPIUrl = GlobalConstants.apiURL + "SSOAPI";
  constructor(private http: HttpClient) { }
  extractData(res: Response) {
    return res;
  }
  handleErrorObservable(error: Response | any) {
    return throwError(error);
  }
  //Get 
  public GetList() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.get(this.APIUrl)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise()
  }
  public GetAllMenuUserRoleRightsRoleWise(RoleID: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.get(this.APIUrl + '/GetAllMenuUserRoleRightsRoleWise/' + RoleID)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise()
  }
  public GetByID(AccountID: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.get(this.APIUrl + "/" + AccountID)
      .pipe(
        catchError(this.handleErrorObservable)
      )
  }
  public GetUserWiseMenu(UserID: number,SSOID:string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.get(this.APIUrl + "/GetUserWiseMenu/" + UserID + "/" + SSOID)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise()
  }
  public GetUserRoleList(SSOID: string, IsWeb: boolean = true) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.get(this.SSOAPIUrl + "/GetUserRoleList/" + SSOID + "/" + IsWeb)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise()
  }
  public SSOLogout(LogoutURL: string) {
    window.open(LogoutURL, "_self");
  }
  public BackToSSO(backtossour: string) {
    window.open(backtossour, "_self");
  }
  public SaveData(request: MenuDataModel): Observable<any> {
    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(request);
    return this.http.post(this.APIUrl, body, { 'headers': headers })
  }
  public DeleteData(AccountID: number): Observable<number> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<number>(this.APIUrl + '/Delete/' + AccountID, httpOptions);
  }
}
