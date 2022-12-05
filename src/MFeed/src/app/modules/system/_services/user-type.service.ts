import { Injectable, Inject, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TableService } from '../../../_metronic/shared/crud-table';
import { UserTypeModel } from '../_models/user-type.model';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../auth/_services/auth.service';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})

export class UserTypeService extends TableService<UserTypeModel> implements OnDestroy {
  API_URL = `${environment.apiUrl}/usertype`;
  constructor(@Inject(HttpClient) http, authService: AuthService) {
    super(http, authService);
  }

  getList(): Observable<any>{
    const url = `${this.API_URL}/getlist`;
    
    return this.http.get<Blob>(url, this.header()).pipe(
      catchError(err => {
        console.error('Get user type list', err);
        return err;
      }));
  }

  getUserTypeSportList(userTypeID: number): Observable<any>{
    const url = `${this.API_URL}/getusertypesportlist?userTypeID=${userTypeID}`;
    
    return this.http.get(url, this.header()).pipe(
      catchError(err => {
        console.error('Get user type list', err);
        return err;
      }));
  }

  updateUserTypeSport(userTypeID: number, idList: number[]): Observable<any>{
    const url = `${this.API_URL}/updateusertypesport`;
    const p = { userTypeID: userTypeID, idList: idList };
    
    return this.http.post(url, p, this.header()).pipe(
      catchError(err => {
        console.error('Get user type list', err);
        return err;
      }));
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}