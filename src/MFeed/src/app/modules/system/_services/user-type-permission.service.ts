import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpHelper } from 'src/app/helpers/http-helper';
import { UserTypePermissionModel } from '../_models/user-type-permission.model';

@Injectable({
  providedIn: 'root',
})

export class UserTypePermissionService {
  _controller = "usertypepermission";
  _isLoading$;
  constructor(private httpHelper: HttpHelper) {
    this._isLoading$ = httpHelper.isLoading$;
  }

  getUserTypePermission(userTypeID: number): Observable<any>{
      let sqParam = "userTypeID=" + userTypeID;
      return this.httpHelper.get(this._controller, "", sqParam);
  }

  updateUserTypePermission(list: UserTypePermissionModel[]): Observable<any>{
      return this.httpHelper.put(this._controller, list);
  }
}