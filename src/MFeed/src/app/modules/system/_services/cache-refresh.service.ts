import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpHelper } from 'src/app/helpers/http-helper';

@Injectable({
  providedIn: 'root',
})

export class CacheRefreshService {
  _controller = "cacherefresh";
  _isLoading$;
  constructor(private httpHelper: HttpHelper) {
    this._isLoading$ = httpHelper.isLoading$;
  }

  userTypePermissionRefresh(userTypeID: number): Observable<any>{
      return this.httpHelper.post(this._controller, "usertypepermissionrefresh", userTypeID);
  }
}