import { Injectable, Inject, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TableService } from '../../../_metronic/shared/crud-table';
import { TeamModel } from '../_models/team.model';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../auth/_services/auth.service';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TeamTransModel } from '../_models/team-trans.model';

@Injectable({
  providedIn: 'root',
})

export class TeamService extends TableService<TeamModel> implements OnDestroy {
  API_URL = `${environment.apiUrl}/team`;
  constructor(@Inject(HttpClient) http, authService: AuthService) {
    super(http, authService);
  }

  getList(leagueID: number): Observable<any>{
    const url = this.API_URL + '/getlist?leagueID=' + leagueID;
    
    return this.http.get<TeamModel[]>(url, this.header()).pipe(
      catchError(err => {
        console.error('Get team list', err);
        return err;
      }));
  }

  batchUpdate(teamList: TeamModel[]): Observable<any>{
    const url = this.API_URL + '/batchupdate';
    
    return this.http.post(url, teamList, this.header()).pipe(
      catchError(err => {
        console.error('Batch update team', err);
        return err;
      }));
  }

  uploadIcon(file: File): Observable<any>{
    const url = this.API_URL + '/uploadicon';

    const formData = new FormData();
    formData.append('file', file, file.name);
    
    return this.http.post<string>(url, formData, this.fileUploadHeader()).pipe(
      catchError(err => {
        console.error('Upload Team Icon', err);
        return err;
      }));
  }

  batchUploadIcon(file:File): Observable<any>{
    const url = this.API_URL + '/batchuploadicon';
    
    const formData = new FormData();
    formData.append('file', file, file.name);

    return this.http.post<string>(url, formData, this.fileUploadHeader());
  }
  
  getTeamTransList(leagueID: number): Observable<any>{
    const url = this.API_URL + '/getteamtranslations?leagueID=' + leagueID;
    
    return this.http.get<TeamTransModel[]>(url, this.header()).pipe(
      catchError(err => {
        console.error('Get team translation list', err);
        return err;
      }));
  }

  batchUpdateTeamTrans(list: TeamTransModel[]): Observable<any>{
    const url = this.API_URL + '/batchupdateteamtrans';
    
    return this.http.post(url, list, this.header()).pipe(
      catchError(err => {
        console.error('Batch update team trans', err);
        return err;
      }));
  }
  
  getLogoList(): Observable<any>{
    const url = this.API_URL + '/getlogolist';
    
    return this.http.get<string[]>(url, this.header()).pipe(
      catchError(err => {
        console.error('Get logo list', err);
        return err;
      }));
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}