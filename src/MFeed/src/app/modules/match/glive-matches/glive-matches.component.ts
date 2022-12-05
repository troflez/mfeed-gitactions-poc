// tslint:disable:no-string-literal
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { GLiveMatchService } from '../_services/glive-match.service';
import {
  GroupingState,
  PaginatorState,
  SortState,
  ICreateAction,
  IEditAction,
  IFetchSelectedAction,
  IUpdateStatusForSelectedAction,
  ISortView,
  IFilterView,
  IGroupingView
} from '../../../_metronic/shared/crud-table';
import { KeyValuePair } from 'src/app/helpers/site-constants';

@Component({
  selector: 'app-matches',
  templateUrl: './glive-matches.component.html'
})
export class GLiveMatchesComponent
  implements
  OnInit,
  OnDestroy,
  ICreateAction,
  IEditAction,
  IFetchSelectedAction,
  IUpdateStatusForSelectedAction,
  ISortView,
  IGroupingView,
  IFilterView,
  IFilterView {  

  paginator: PaginatorState;
  sorting: SortState;
  grouping: GroupingState;
  isLoading: boolean;
  filterGroup: FormGroup;
  matchestatusList: KeyValuePair[];

  private subscriptions: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

  constructor(
    private fb: FormBuilder,
    public matchService: GLiveMatchService
  ) { }

  // angular lifecircle hooks
  ngOnInit(): void {
    this.filterForm();
    this.grouping = this.matchService.grouping;
    this.paginator = this.matchService.paginator;
    this.sorting = this.matchService.sorting;

    //default sorting
    this.sorting.column = "timeStart";
    this.sorting.direction = "asc";

    this.matchService.fetch();

    const sb = this.matchService.isLoading$.subscribe(res => this.isLoading = res);
    this.subscriptions.push(sb);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  // filtration
  filterForm() {
    let gLiveMatchID = '';
    let tournament = '';
    let homeTeam = '';
    let awayTeam = '';
    
    let today = new Date();
    let to = new Date();
    
    today.setMinutes(0);
    today.setHours(today.getHours() - 1); //current time - 1 hours
    to.setDate(to.getDate() + 1); // + 1 day
    to.setMinutes(0);

    this.filterGroup = this.fb.group({
      gLiveMatchID: gLiveMatchID,
      tournament: tournament,
      homeTeam: homeTeam,
      awayTeam: awayTeam,
      timeStart: new Date(today),//{ year: today.getFullYear(), month: today.getMonth() + 1, day: today.getDate() },
      timeEnd: new Date(to)//{ year: to.getFullYear(), month: to.getMonth() + 1, day: to.getDate() }
    });

    this.subscriptions.push(
      this.filterGroup.controls.gLiveMatchID.valueChanges.pipe(
        debounceTime(500),
        distinctUntilChanged()
      ).subscribe(() =>
        this.filter()
      )
    );

    this.subscriptions.push(
      this.filterGroup.controls.tournament.valueChanges.pipe(
        debounceTime(500),
        distinctUntilChanged()
      ).subscribe(() =>
        this.filter()
      )
    );

    this.subscriptions.push(
      this.filterGroup.controls.homeTeam.valueChanges.pipe(
        debounceTime(500),
        distinctUntilChanged()
      ).subscribe(() =>
        this.filter()
      )
    );

    this.subscriptions.push(
      this.filterGroup.controls.awayTeam.valueChanges.pipe(
        debounceTime(500),
        distinctUntilChanged()
      ).subscribe(() =>
        this.filter()
      )
    );

    this.subscriptions.push(
      this.filterGroup.controls.timeStart.valueChanges.pipe(
        debounceTime(500),
        distinctUntilChanged()
      ).subscribe(() =>
        this.filter()
      )
    );

    this.subscriptions.push(
      this.filterGroup.controls.timeEnd.valueChanges.pipe(
        debounceTime(500),
        distinctUntilChanged()
      ).subscribe(() =>
        this.filter()
      )
    );

    //initialize filter
    const filter = {
      gLiveMatchID: this.filterGroup.controls.gLiveMatchID.value,
      tournament: this.filterGroup.controls.tournament.value,
      homeTeam: this.filterGroup.controls.homeTeam.value,
      awayTeam: this.filterGroup.controls.awayTeam.value,
      timeStart: this.filterGroup.controls.timeStart.value,
      timeEnd: this.filterGroup.controls.timeEnd.value,
    };
    this.matchService.patchStateWithoutFetch({ filter });
  }

  filter() {
    const filter = {
      gLiveMatchID: '',
      tournament: '',
      homeTeam: '',
      awayTeam: '',
      timeStart: null,
      timeEnd: null
    };

    const gLiveMatchID = this.filterGroup.get('gLiveMatchID').value;
    if (gLiveMatchID) {
      filter['gLiveMatchID'] = gLiveMatchID;
    }

    const tournament = this.filterGroup.get('tournament').value;
    if (tournament) {
      filter['tournament'] = tournament;
    }

    const homeTeam = this.filterGroup.get('homeTeam').value;
    if (homeTeam) {
      filter['homeTeam'] = homeTeam;
    }

    const awayTeam = this.filterGroup.get('awayTeam').value;
    if (awayTeam) {
      filter['awayTeam'] = awayTeam;
    }

    const timeStart = this.filterGroup.get('timeStart').value;
    if (timeStart) {
      filter['timeStart'] = timeStart;
    }

    const timeEnd = this.filterGroup.get('timeEnd').value;
    if (timeEnd) {
      filter['timeEnd'] = timeEnd;
    }

    this.matchService.patchState({ filter });
  }

  // sorting
  sort(column: string) {
    const sorting = this.sorting;
    const isActiveColumn = sorting.column === column;
    if (!isActiveColumn) {
      sorting.column = column;
      sorting.direction = 'asc';
    } else {
      sorting.direction = sorting.direction === 'asc' ? 'desc' : 'asc';
    }
    this.matchService.patchState({ sorting });
  }

  // pagination
  paginate(paginator: PaginatorState) {
    this.matchService.patchState({ paginator });
  }

  refresh(){
    this.matchService.fetch();
  }

   // form actions
   create() {
    //required by theme
  }

  edit() {
    //required by theme
  }

  updateStatusForSelected() {
    //required by theme
  }

  fetchSelected() {
    //required by theme
  }
}
