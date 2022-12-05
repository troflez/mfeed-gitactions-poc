import { Injectable } from '@angular/core';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}
  
  canActivate(
    next: ActivatedRouteSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.checkUserLogin(next);
  }

  checkUserLogin(route: ActivatedRouteSnapshot): boolean {
    const currentUser = this.authService.currentUserValue;

    if (currentUser) {
      if(!route.data.module){
        return true;
      }

      if(route.data.module && this.hasPermission(route.data.module)){
        return true;
      }
      else{
        this.router.navigate(['/match/matches']);
        return false;
      }
    }
    else {
      this.authService.logout();
      return false;
    }
  }

  hasPermission(moduleID: number): boolean{
    let permissionList = this.authService.getPermissionFromLocalStorage();

    for(let p of permissionList){
      if(p.moduleID == moduleID){
        return true;
      }
    }

    return false;
  }
}
