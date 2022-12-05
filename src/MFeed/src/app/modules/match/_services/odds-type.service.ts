import { Injectable, Inject, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TableService } from '../../../_metronic/shared/crud-table';
import { OddsTypeModel } from '../_models/odds-type.model';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../auth/_services/auth.service';

@Injectable({
  providedIn: 'root',
})

export class OddsTypeService extends TableService<OddsTypeModel> implements OnDestroy {
  API_URL = `${environment.apiUrl}/oddstype`;
  constructor(@Inject(HttpClient) http, authService: AuthService) {
    super(http, authService);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}