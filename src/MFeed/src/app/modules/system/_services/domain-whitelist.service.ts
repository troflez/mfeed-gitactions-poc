import { Injectable, Inject, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TableService } from '../../../_metronic/shared/crud-table';
import { DomainWhitelistModel } from '../_models/domain-whitelist.model';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../auth/_services/auth.service';

@Injectable({
  providedIn: 'root',
})

export class DomainWhitelistService extends TableService<DomainWhitelistModel> implements OnDestroy {
  API_URL = `${environment.apiUrl}/domainwhitelist`;
  constructor(@Inject(HttpClient) http, authService: AuthService) {
    super(http, authService);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}