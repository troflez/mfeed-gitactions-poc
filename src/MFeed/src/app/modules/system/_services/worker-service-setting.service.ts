import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { HttpHelper } from 'src/app/helpers/http-helper';
import { WorkerServiceSettingModel } from '../_models/worker-service-setting.model';

@Injectable({
  providedIn: 'root',
})

export class WorkerServiceSettingService {
  API_URL = `${environment.apiUrl}/`;
  CONTROLLER = "workerservicesetting";
  _isLoading$;
  constructor(private httpHelper: HttpHelper) {
    this._isLoading$ = httpHelper.isLoading$;
  }

  getWorkerServiceSetting(): Observable<any>{
      return this.httpHelper.get(this.CONTROLLER, "", "");
  }

  updateWorkerServiceSetting(model: WorkerServiceSettingModel): Observable<any>{
      return this.httpHelper.put(this.CONTROLLER, model);
  }
}