import { catchError, finalize } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { of, Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from '../modules/auth';

@Injectable({
    providedIn: 'root',
  })

export class HttpHelper {  
    API_URL = `${environment.apiUrl}`;

    private _errorMessage = new BehaviorSubject<string>('');
    private _isLoading$ = new BehaviorSubject<boolean>(false);

    constructor(private http: HttpClient, private authService: AuthService) { }

    private header(): object {
        let header = new HttpHeaders({ 'Content-Type': 'application/json' });
        header = header.append('Authorization', 'Bearer ' + this.authService.getTokenFromLocalStorage());

        return { headers: header };
    }

    getSingle(controller:string, id: number){
        const url = this.API_URL + '/' + controller + '/' + id;

        this._isLoading$.next(true);
        this._errorMessage.next('');
        return this.http.get(url, this.header()).pipe(
            catchError(err => {
                this._errorMessage.next(err);
                console.error('GET SINGLE', err);
                return of({ id: undefined });
            }),
            finalize(() => this._isLoading$.next(false))
        );
    }

    getList(controller:string, action: string, pBody: any){
        const url = this.API_URL + '/' + controller + '/' + action;

        this._isLoading$.next(true);
        this._errorMessage.next('');
        return this.http.post(url, pBody, this.header()).pipe(
            catchError(err => {
                this._errorMessage.next(err);
                console.error('GET LIST', err);
                return of({ id: undefined });
            }),
            finalize(() => this._isLoading$.next(false))
        );
    }

    get(controller:string, action: string, qsParam: string){
        if(qsParam && qsParam.length > 0){
            qsParam = "?" + qsParam;
            action += qsParam
        }

        const url = this.API_URL + '/' + controller + '/' + action;

        this._isLoading$.next(true);
        this._errorMessage.next('');
        
        return this.http.get(url, this.header()).pipe(
            catchError(err => {
                this._errorMessage.next(err);
                console.error('GET', err);
                return of({ id: undefined });
            }),
            finalize(() => this._isLoading$.next(false))
        );
    }

    post(controller:string, action: string, pBody: any){
        const url = this.API_URL + '/' + controller + '/' + action;

        this._isLoading$.next(true);
        this._errorMessage.next('');
        return this.http.post(url, pBody, this.header()).pipe(
          catchError(err => {
            this._errorMessage.next(err);
            console.error('POST', err);
            return of({ items: [], total: 0 });
          }),
          finalize(() => this._isLoading$.next(false))
        );
    }

    put(controller:string, pBody: any){
        const url = this.API_URL + '/' + controller;

        this._isLoading$.next(true);
        this._errorMessage.next('');
        return this.http.put(url, pBody, this.header()).pipe(
            catchError(err => {
              this._errorMessage.next(err);
              console.error('PUT', pBody, status, err);
              return of([]);
            }),
            finalize(() => this._isLoading$.next(false))
        );
    }    

    delete(controller:string, id: any): Observable<any> {
        const url = this.API_URL + '/' + controller;

        this._isLoading$.next(true);
        this._errorMessage.next('');
        return this.http.delete(url, this.header()).pipe(
            catchError(err => {
                this._errorMessage.next(err);
                console.error('DELETE ITEM', id, err);
                return of({});
            }),
            finalize(() => this._isLoading$.next(false))
        );
    }

    get errorMessage$() {
        return this._errorMessage.asObservable();
    }
    get isLoading$() {
        return this._isLoading$.asObservable();
    }
}