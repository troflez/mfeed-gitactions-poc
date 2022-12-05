import { Injectable, Inject, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TableService } from '../../../_metronic/shared/crud-table';
import { UserModel } from '../_models/user.model';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../auth/_services/auth.service';
import { ChangePasswordModel } from '../_models/change-password.model';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})

export class UserService extends TableService<UserModel> implements OnDestroy {
  API_URL = `${environment.apiUrl}/user`;
  constructor(@Inject(HttpClient) http, authService: AuthService) {
    super(http, authService);
  }

  changePassword(item: ChangePasswordModel): Observable<any>{
    const url = this.API_URL + '/changepassword';

    return this.http.post<string>(url, item, this.header()).pipe(
      catchError(err => {
        //this._errorMessagege.next(err);
        console.error('CHANGE PW', err);
        return err;
      }));
      //finalize(() => this._isLoading$.next(false))
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}