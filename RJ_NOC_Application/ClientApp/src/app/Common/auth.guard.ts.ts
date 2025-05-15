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

    debugger;
    // If skipLocationChange is true, allow to proceed
    const extras = this.router.getCurrentNavigation()?.extras;
    if (extras?.skipLocationChange) {
      return true;
    }
    // Otherwise, rerun the navigation with skipLocationChange on
    const url = this.router.parseUrl(state.url);
    this.router.navigateByUrl(url, { ...extras, skipLocationChange: true });

    if (this.router.url === '/') {
      localStorage.clear();
      this.router.navigate(['**']);
      return false;
    }
    return false;
  }
} 
