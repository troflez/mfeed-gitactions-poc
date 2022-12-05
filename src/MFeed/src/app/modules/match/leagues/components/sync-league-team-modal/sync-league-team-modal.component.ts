import { Component, OnDestroy, OnInit } from '@angular/core';

import { FormBuilder, FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, of, Subscription } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, first, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { LeagueService } from '../../../_services/league.service';

@Component({
  selector: 'app-sync-league-team-modal',
  templateUrl: './sync-league-team-modal.component.html'
})
export class SyncLeagueTeamModalComponent implements OnInit, OnDestroy {
  apiURL = `${environment.apiUrl}`;
  isLoading = false;
  subscriptions: Subscription[] = [];
  formGroup: FormGroup;
  leagues: string[];
  filterGroup: FormGroup;
  msg$ = new BehaviorSubject<string>(undefined);

  constructor(private leagueService: LeagueService,
    private fb: FormBuilder, 
    public modal: NgbActiveModal,
    public sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.filterForm();
  }

  search(){
    this.loadLeagues();
  }

  loadLeagues() {
    const sb = this.leagueService.getUpcomingLeagues(this.filterGroup.controls.league.value).pipe(
      first()
    ).subscribe((res: string[]) => {
      this.leagues = res;
    });
    this.subscriptions.push(sb);
  } 
  filterForm() {
    this.filterGroup = this.fb.group({
      league: ['']
    });

    this.subscriptions.push(
      this.filterGroup.controls.league.valueChanges.pipe(
        debounceTime(500),
        distinctUntilChanged()
      ).subscribe(() =>
        this.search()
      )
    );
  }

  sync(league: string){
    const sbUpdate = this.leagueService.SyncLeagueTeams(league).pipe(
      tap(() => {
        this.msg$.next('Sync successfull');
      }),
      catchError((errorMessage) => {
        this.msg$.next(errorMessage);
        return of(undefined);
      }),
    ).subscribe();
    this.subscriptions.push(sbUpdate);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}
