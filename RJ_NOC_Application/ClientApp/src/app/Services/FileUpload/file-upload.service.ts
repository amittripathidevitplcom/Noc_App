import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { GlobalConstants } from '../../Common/GlobalConstants';


@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  readonly APIUrl_UploadFile = GlobalConstants.apiURL + "UploadFile";

  constructor(private http: HttpClient) { }
  handleErrorObservable(error: Response | any) {
    // return Observable.throw(error);
    return throwError(error);
  }
  // Returns an observable
  public upload(file: any): Observable<any> {
    // Create form data
    const formData = new FormData();
    // Store form name as "file" with file data
    formData.append("file", file, file.name);
    // Make http post request over api
    // with formData as req
    return this.http.post(this.APIUrl_UploadFile, formData)
  }

  public async UploadDocument(file: any) {
    //const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    const formData = new FormData();
    // Store form name as "file" with file data
    formData.append("file", file, file.name);
    return await this.http.post(this.APIUrl_UploadFile + "/UploadDocument", formData)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();

  }

  //public async uploadProductImage(file): Observable<any> {
  //  // Create form data
  //  const formData = new FormData();
  //  // Store form name as "file" with file data
  //  formData.append("file", file, file.name);
  //  // Make http post request over api
  //  // with formData as req
  //  return await this.http.post(this.APIUrl_UploadFile + "/ProductImageFile", formData)
  //}

  public uploadExcelFile(file: any): Observable<any> {
    // Create form data
    const formData = new FormData();
    // Store form name as "file" with file data
    formData.append("file", file, file.name);
    // Make http post request over api
    // with formData as req
    return this.http.post(this.APIUrl_UploadFile + "/ExcelFileToArray", formData)
  }

  public async DeleteDocument(path: string) {
    const body = JSON.stringify(path);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.post(this.APIUrl_UploadFile + "/DeleteDocument", body, httpOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

}
