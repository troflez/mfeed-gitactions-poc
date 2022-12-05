import { Injectable, OnDestroy } from '@angular/core';
import { Observable, BehaviorSubject, of, Subscription } from 'rxjs';
import { map, catchError, switchMap, finalize } from 'rxjs/operators';
import { AuthModel } from '../_models/auth.model';
import { AuthHTTPService } from './auth-http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { PermissionModel } from '../_models/permission-model';
import { ResetPasswordModel } from '../_models/reset-password.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
  private authLocalStorageToken = `${environment.appVersion}-${environment.USERDATA_KEY}`;

  // public fields
  currentUser$: Observable<AuthModel>;
  isLoading$: Observable<boolean>;
  currentUserSubject: BehaviorSubject<AuthModel>;
  isLoadingSubject: BehaviorSubject<boolean>;


  get currentUserValue(): AuthModel {
    return this.currentUserSubject.value;
  }

  set currentUserValue(user: AuthModel) {
    this.currentUserSubject.next(user);
  }

  constructor(
    private authHttpService: AuthHTTPService,
    private router: Router
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.currentUserSubject = new BehaviorSubject<AuthModel>(undefined);
    this.currentUser$ = this.currentUserSubject.asObservable();
    this.isLoading$ = this.isLoadingSubject.asObservable();
    const subscr = this.getUserByToken().subscribe();
    this.unsubscribe.push(subscr);
  }

  // public methods
  login(email: string, password: string): Observable<AuthModel> {
    this.isLoadingSubject.next(true);
    return this.authHttpService.login(email, password).pipe(
      map((auth: AuthModel) => {
        return this.setAuthFromLocalStorage(auth);
      }),
      switchMap(() => this.getUserByToken()),
      catchError((err) => {
        console.log(err);
        console.error('err', err);
        return of(undefined);
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  logout(): Observable<boolean> {
    const auth = this.getAuthFromLocalStorage();    

    if (!auth || !auth.authToken) {     
      localStorage.removeItem(this.authLocalStorageToken);

      this.router.navigate(['/auth/login'], {
        queryParams: {},
      });

      return of(false);
    }

    return this.authHttpService.logout(auth.authToken).pipe(
      map((success: boolean) => {
        if (success) {
          localStorage.removeItem(this.authLocalStorageToken);
  
          this.router.navigate(['/auth/login'], {
            queryParams: {},
          });
        }

        return success;
      }),
      catchError((err) => {
        
        console.log("logout failed!");
        console.log(err);
        console.error('err', err);
        return of(undefined);
      })
    );
  }

  getUserByToken(): Observable<AuthModel> {
    const auth = this.getAuthFromLocalStorage();
    if (!auth || !auth.authToken) {
      return of(undefined);
    }

    this.isLoadingSubject.next(true);
    return this.authHttpService.getUserByToken(auth.authToken).pipe(
      map((user: AuthModel) => {
        if (user) {
          this.currentUserSubject = new BehaviorSubject<AuthModel>(user);
        } else {
          this.logout();
        }
        return user;
      }),
      catchError((err) => { 
        console.log(err.status);
        if(err.status == 401){
          localStorage.removeItem(this.authLocalStorageToken);
          this.router.navigate(['/auth/login'], {
            queryParams: {},
          });
        }
        return of(undefined);
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  forgotPassword(email: string): Observable<boolean> {
    this.isLoadingSubject.next(true);
    return this.authHttpService
      .forgotPassword(email)
      .pipe(finalize(() => this.isLoadingSubject.next(false)));
  }

  resetPassword(model: ResetPasswordModel): Observable<boolean> {
    this.isLoadingSubject.next(true);
    return this.authHttpService
      .resetPassword(model)
      .pipe(finalize(() => this.isLoadingSubject.next(false)));
  }

  getTokenFromLocalStorage(): string{    
    const auth = this.getAuthFromLocalStorage();
    if (!auth || !auth.authToken) {
      return "";
    }

    return auth.authToken;
  }

  getPermissionFromLocalStorage(): PermissionModel[]{    
    const auth = this.getAuthFromLocalStorage();
    if (!auth || !auth.permissionList) {
      return undefined;
    }

    return auth.permissionList;
  }

  hasPermission(moduleID: number): boolean{
    let permissionList = this.getPermissionFromLocalStorage();

    for(let p of permissionList){
      if(p.moduleID == moduleID){
        return true;
      }
    }

    return false;
  }

  hasWritePermission(moduleID: number): boolean{
    let permissionList = this.getPermissionFromLocalStorage();

    for(let p of permissionList){
      if(p.moduleID == moduleID && p.write){
        return true;
      }
    }

    return false;
  }

  // private methods
  private setAuthFromLocalStorage(auth: AuthModel): boolean {
    // store auth authToken/refreshToken/epiresIn in local storage to keep user logged in between page refreshes
    if (auth && auth.authToken) {
      localStorage.setItem(this.authLocalStorageToken, JSON.stringify(auth));
      return true;
    }
    return false;
  }

  private getAuthFromLocalStorage(): AuthModel {
    try {
      return JSON.parse(
        localStorage.getItem(this.authLocalStorageToken)
      );
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
