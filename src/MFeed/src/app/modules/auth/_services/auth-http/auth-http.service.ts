import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { AuthModel } from '../../_models/auth.model';
import { ResetPasswordModel } from '../../_models/reset-password.model';

const API_AUTH_URL = `${environment.apiUrl}/auth`;
const API_USER_URL = `${environment.apiUrl}/user`;

@Injectable({
  providedIn: 'root',
})
export class AuthHTTPService {
  constructor(private http: HttpClient) { }

  // public methods
  login(email: string, password: string): Observable<any> {
    return this.http.post<AuthModel>(`${API_AUTH_URL}/login`, { email, password });
  }

  logout(token: string): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.post(`${API_USER_URL}/logout`, {}, { headers: httpHeaders });
  }

  // Your server should check email => If email exists send link to the user and return true | If email doesn't exist return false
  forgotPassword(email: string): Observable<boolean> {
    return this.http.post<boolean>(`${API_AUTH_URL}/forgotpassword`, {
      email
    });
  }

  resetPassword(model: ResetPasswordModel): Observable<boolean> {
    return this.http.post<boolean>(`${API_AUTH_URL}/resetpassword`, model);
  }

  getUserByToken(token: string): Observable<AuthModel> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<AuthModel>(`${API_USER_URL}/getuserbytoken`, {
      headers: httpHeaders,
    });
  }
}