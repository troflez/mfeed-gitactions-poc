import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { HttpHelper } from 'src/app/helpers/http-helper';

@Injectable({
  providedIn: 'root',
})

export class M88APIService {
  API_URL = `${environment.apiUrl}/`;
  _controller = "m88feed";
  _isLoading$;
  constructor(private httpHelper: HttpHelper) {
    this._isLoading$ = httpHelper.isLoading$;
  }

  getMatches(sport: string, oddsType: string): Observable<any>{
    let p = `/${sport}/${oddsType}/all/en-us`;
    
    return this.httpHelper.get(this._controller, "getmatches" + p, "");
  }

  getGLiveStreamingLink(ch: number, ip: string, uid: string): Observable<any>{    
    let qsParam = "ch=" + ch + "&ip=" + ip + "&uid=" + uid;
    return this.httpHelper.get(this._controller, "getglivestreaminglink", qsParam);
  }
}