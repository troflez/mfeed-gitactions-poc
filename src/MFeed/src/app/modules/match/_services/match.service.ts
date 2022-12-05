import { Injectable, Inject, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TableService } from '../../../_metronic/shared/crud-table';
import { MatchModel } from '../_models/match.model';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../auth/_services/auth.service';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MatchLogModel } from '../_models/match-log.model';
import { MatchGroupingModel } from '../_models/match-grouping.model';

@Injectable({
  providedIn: 'root',
})

export class MatchService extends TableService<MatchModel> implements OnDestroy {
  API_URL = `${environment.apiUrl}/match`;
  constructor(@Inject(HttpClient) http, authService: AuthService) {
    super(http, authService);
  }

  publish(item: MatchModel): Observable<any>{
    const url = this.API_URL + '/publish';

    return this.http.post<string>(url, item, this.header()).pipe(
      catchError(err => {
        console.error('Match Publish', err);
        return err;
      }));
  }

  batchPublish(idArr: number[], published: string): Observable<any>{
    const url = this.API_URL + '/batchpublish';
    const p = {
      idList: idArr,
      published: published
    };

    return this.http.post<string>(url, p, this.header()).pipe(
      catchError(err => {
        console.error('Match Publish', err);
        return err;
      }));
  }

  updateMatchChannel(item: MatchModel): Observable<any>{
    const url = this.API_URL + '/updatematchchannel';

    return this.http.post<string>(url, item, this.header()).pipe(
      catchError(err => {
        console.error('Match Update Channel', err);
        return err;
      }));
  }

  mapMatchChannel(item: MatchModel): Observable<any>{
    const url = this.API_URL + '/mapmatchchannel';

    return this.http.post<string>(url, item, this.header()).pipe(
      catchError(err => {
        console.error('Map Match Channel', err);
        return err;
      }));
  }

  uploadTeamIcon(file: File): Observable<any>{
    const url = this.API_URL + '/uploadteamicon';

    const formData = new FormData();
    formData.append('file', file, file.name);
    
    let header = new HttpHeaders({ 'Content-Disposition': 'multipart/form-data' });
    header = header.append('Authorization', 'Bearer ' + this.authService.getTokenFromLocalStorage());
    
    return this.http.post<string>(url, formData, { headers: header }).pipe(
      catchError(err => {
        console.error('Upload Team Icon', err);
        return err;
      }));
  }

  getMatchLogs(id: number): Observable<any>{
    const url = this.API_URL + '/getmatchlogs/' + id;

    return this.http.get<MatchLogModel[]>(url, this.header()).pipe(
      catchError(err => {
        console.error('Get Match Logs', err);
        return err;
      }));
  }

  batchAssignMatchGroup(list: MatchGroupingModel[]){
    const url = this.API_URL + '/batchassignmatchgroup';
    
    return this.http.post<string>(url, list, this.header()).pipe(
      catchError(err => {
        console.error('Batch assign match group', err);
        return err;
      }));
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}