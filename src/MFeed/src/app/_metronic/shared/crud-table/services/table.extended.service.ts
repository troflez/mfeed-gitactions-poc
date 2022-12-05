import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TableService } from './table.service';
import { AuthService } from '../../../../modules/auth/_services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class TableExtendedService extends TableService<any> {
  constructor(@Inject(HttpClient) http, authService: AuthService) {
    super(http, authService);
  }
}
