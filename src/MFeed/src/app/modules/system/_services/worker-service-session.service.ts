import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { HttpHelper } from 'src/app/helpers/http-helper';

@Injectable({
  providedIn: 'root',
})

export class WorkerServiceSessionService {
  API_URL = `${environment.apiUrl}/`;
  _controller = "workerservicesession";
  _isLoading$;
  constructor(private httpHelper: HttpHelper) {
    this._isLoading$ = httpHelper.isLoading$;
  }

  getWorkerServiceSession(): Observable<any>{
      return this.httpHelper.get(this._controller, "", "");
  }
}