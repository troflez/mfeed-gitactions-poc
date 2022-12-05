import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpHelper } from 'src/app/helpers/http-helper';

@Injectable({
  providedIn: 'root',
})

export class CacheCheckerService {
  _controller = "cache";
  _isLoading$;
  constructor(private httpHelper: HttpHelper) {
    this._isLoading$ = httpHelper.isLoading$;
  }

  getCache(key: string): Observable<any>{    
      return this.httpHelper.get(this._controller, "getcache", "key=" + key);
  }
}