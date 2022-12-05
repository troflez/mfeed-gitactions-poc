import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { HttpHelper } from 'src/app/helpers/http-helper';

@Injectable({
  providedIn: 'root',
})

export class MGoalAPIService {
  API_URL = `${environment.apiUrl}/`;
  _controller = "mgoalfeed";
  _isLoading$;
  constructor(private httpHelper: HttpHelper) {
    this._isLoading$ = httpHelper.isLoading$;
  }

  getMatches(oddsTypeID): Observable<any>{
    return this.httpHelper.get(this._controller, "getmatchesbyot/" + oddsTypeID + "/all/en-us", "");
  }

  getGLiveStreamingLink(ch: number, ip: string, uid: string): Observable<any>{    
    let qsParam = "ch=" + ch + "&ip=" + ip + "&uid=" + uid;
    return this.httpHelper.get(this._controller, "getglivestreaminglink", qsParam);
  }
}