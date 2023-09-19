import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse, HttpParams } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

 
@Injectable({
  providedIn: 'root',
})
export class SkipLocationChangeGuard implements CanActivate {

  constructor(private readonly router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    // If skipLocationChange is true, allow to proceed
    const extras = this.router.getCurrentNavigation()?.extras;
    if (extras?.skipLocationChange) {
      return true;
    }
    // Otherwise, rerun the navigation with skipLocationChange on
    const url = this.router.parseUrl(state.url);
    this.router.navigateByUrl(url, { ...extras, skipLocationChange: true });
    return false;
  }
}

//export class RedirectGuard {
//  //canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    
//  //    //this.redirectUrl = state.url;
//  //    //this.router.navigate(["/login"], { skipLocationChange: true });
//  //    //return false;
     
//  //}
//}

//export class RedirectGuard implements CanActivate {
//  constructor(private router: Router) { }

//  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
// //   debugger
// //   console.log('externalUrl');
// //   console.log(route.data['externalUrl']);
// //window.location.href = route.data['externalUrl'];
//     //return true;
//    route: ActivatedRouteSnapshot,
//      state: RouterStateSnapshot
//  ): Observable<boolean> | Promise<boolean> | boolean {
//      return false; // never allow activation
//    }
//  }
//}
//export class RedirectGuard implements CanActivate {
//  constructor(private router: Router) { }
//  canActivate(routeSnapshot: any) {
//    this.router.navigateByUrl(routeSnapshot.data.redirectTo, { skipLocationChange: true });
//    //return true;
//  }
  //canActivate(
  //  route: ActivatedRouteSnapshot,
  //  state: RouterStateSnapshot
  //): Observable<boolean> | Promise<boolean> | boolean {
  //  return false; // never allow activation
  //}
  //constructor(private router: Router) { }

  //canActivate(_: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    //const extras = this.router.getCurrentNavigation()?.extras;
    //if (extras?.skipLocationChange) {
    //  return true;
    //}
    //debugger;
    //const url = this.router.parseUrl(state.url);
    //this.router.navigateByUrl(url, { ...extras, skipLocationChange: true, });
    //return true;
 // }
  //canActivate(_: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
  //  //const extras = this.router.getCurrentNavigation()?.extras;
  //  //if (extras?.skipLocationChange) {
  //  //  return true;
  //  //}
  //  //debugger;
  //  //const url = this.router.parseUrl(state.url);
  //  //this.router.navigateByUrl(url, { ...extras, skipLocationChange: true, });
  //  //return true;
  //}
//}
