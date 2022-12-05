import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpHelper } from 'src/app/helpers/http-helper';
import { OddsTypeModel } from '../_models/odds-type.model';

@Injectable({
  providedIn: 'root',
})

export class OddsTypeService {
  _controller = "oddstype";
  _isLoading$;
  constructor(private httpHelper: HttpHelper) {
    this._isLoading$ = httpHelper.isLoading$;
  }

  getList(): Observable<any>{
    return this.httpHelper.get(this._controller, "getlist", "");
  }
  
  batchUpdate(list: OddsTypeModel[]): Observable<any>{
    return this.httpHelper.post(this._controller, "batchupdate", list);
  }
}