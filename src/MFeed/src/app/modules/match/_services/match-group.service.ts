import { Injectable, Inject, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TableService } from '../../../_metronic/shared/crud-table';
import { MatchGroupModel } from '../_models/match-group.model';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../auth/_services/auth.service';

@Injectable({
  providedIn: 'root',
})

export class MatchGroupService extends TableService<MatchGroupModel> implements OnDestroy {
  API_URL = `${environment.apiUrl}/matchgroup`;
  constructor(@Inject(HttpClient) http, authService: AuthService) {
    super(http, authService);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}