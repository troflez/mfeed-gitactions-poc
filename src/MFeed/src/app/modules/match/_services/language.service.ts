import { Injectable, Inject, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TableService } from '../../../_metronic/shared/crud-table';
import { LanguageModel } from '../_models/language.model';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../auth/_services/auth.service';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})

export class LanguageService extends TableService<LanguageModel> implements OnDestroy {
  API_URL = `${environment.apiUrl}/language`;
  constructor(@Inject(HttpClient) http, authService: AuthService) {
    super(http, authService);
  }

  getList(): Observable<any>{
    const url = this.API_URL + '/getlist';
    
    return this.http.get<Blob>(url, this.header()).pipe(
      catchError(err => {
        console.error('Get language list', err);
        return err;
      }));
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}