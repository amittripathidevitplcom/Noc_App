import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { GlobalConstants } from '../../Common/GlobalConstants';
import { MenuDataModel } from '../../Models/MenuDataModel';
@Injectable({
  providedIn: 'root'
})
export class MenuService {

  readonly APIUrl = GlobalConstants.apiURL + "Menu";
  constructor(private http: HttpClient) { }

  extractData(res: Response) {
    return res;
  }
  handleErrorObservable(error: Response | any) {
    // return Observable.throw(error);
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
      )
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

  public GetUserWiseMenu(UserID: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.get(this.APIUrl + "/GetUserWiseMenu/" + UserID)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise()
  }


  public SaveData(request: MenuDataModel): Observable<any> {
    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(request);
    //console.log(body)
    return this.http.post(this.APIUrl, body, { 'headers': headers })
  }
  public DeleteData(AccountID: number): Observable<number> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<number>(this.APIUrl + '/Delete/' + AccountID, httpOptions);
  }


}
