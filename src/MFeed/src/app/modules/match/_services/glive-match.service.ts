import { Injectable, Inject, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TableService } from '../../../_metronic/shared/crud-table';
import { GLiveMatchModel } from '../_models/glive-match.model';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../auth/_services/auth.service';

@Injectable({
  providedIn: 'root',
})

export class GLiveMatchService extends TableService<GLiveMatchModel> implements OnDestroy {
  API_URL = `${environment.apiUrl}/glivematch`;
  constructor(@Inject(HttpClient) http, authService: AuthService) {
    super(http, authService);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}