import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { HttpHelper } from 'src/app/helpers/http-helper';
import { OddsExtractSettingModel } from '../_models/odds-extract-setting.model';

@Injectable({
  providedIn: 'root',
})

export class OddsExtractSettingService {
  API_URL = `${environment.apiUrl}/`;
  CONTROLLER = "oddsextractsetting";
  _isLoading$;
  constructor(private httpHelper: HttpHelper) {
    this._isLoading$ = httpHelper.isLoading$;
  }

  getOddsExtractSettingList(): Observable<any>{
      return this.httpHelper.get(this.CONTROLLER, "getlist", "");
  }

  batchUpdate(list: OddsExtractSettingModel[]): Observable<any>{
      return this.httpHelper.post(this.CONTROLLER, "batchupdate", list);
  }
}