import { Injectable, Inject, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TableService } from '../../../_metronic/shared/crud-table';
import { LeagueModel } from '../_models/league.model';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../auth/_services/auth.service';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LeagueTransModel } from '../_models/league-trans.model';

@Injectable({
  providedIn: 'root',
})

export class LeagueService extends TableService<LeagueModel> implements OnDestroy {
  API_URL = `${environment.apiUrl}/league`;
  constructor(@Inject(HttpClient) http, authService: AuthService) {
    super(http, authService);
  }

  uploadIcon(file: File): Observable<any>{
    const url = this.API_URL + '/uploadicon';
    
    return this.uploadFile(url, file);
  }

  getIcon(filename: string): Observable<any>{
    const url = this.API_URL + '/geticon?filename=' + filename;
    
    return this.http.get<Blob>(url, this.header()).pipe(
      catchError(err => {
        console.error('Get league icon', err);
        return err;
      }));
  }

  batchUploadIcon(file:File): Observable<any>{
    const url = this.API_URL + '/batchuploadicon';

    return this.uploadFile(url, file);
  }

  getLeagueTransList(leagueID: number): Observable<any>{
    const url = this.API_URL + '/getleaguetranslations?leagueID=' + leagueID;
    
    return this.http.get<LeagueTransModel[]>(url, this.header()).pipe(
      catchError(err => {
        console.error('Get league translation list', err);
        return err;
      }));
  }

  batchUpdateLeagueTrans(list: LeagueTransModel[]): Observable<any>{
    const url = this.API_URL + '/batchupdateleaguetrans';
    
    return this.http.post(url, list, this.header()).pipe(
      catchError(err => {
        console.error('Batch update league trans', err);
        return err;
      }));
  }

  getUpcomingLeagues(league: string){
    const url = this.API_URL + '/getupcomingleagues?league=' + league;
    
    return this.http.get<string[]>(url, this.header()).pipe(
      catchError(err => {
        console.error('Get upcoming leagues', err);
        return err;
      }));
  }

  SyncLeagueTeams(league: string): Observable<any>{
    const url = this.API_URL + '/syncleagueteams?league='+ league;
    
    return this.http.post(url, {}, this.header()).pipe(
      catchError(err => {
        console.error('Sync league teams', err);
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

  private uploadFile(url: string, file: File){
    const formData = new FormData();
    formData.append('file', file, file.name);

    return this.http.post<string>(url, formData, this.fileUploadHeader());
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}