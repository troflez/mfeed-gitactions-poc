// tslint:disable:no-string-literal
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { GLiveMatchService } from '../../../_services/glive-match.service';
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
} from '../../../../../_metronic/shared/crud-table';
import { KeyValuePair } from 'src/app/helpers/site-constants';
import { MatchModel } from '../../../_models/match.model';
import { MatchService } from '../../../_services/match.service';

@Component({
  selector: 'app-matches',
  templateUrl: './assign-channel-modal.component.html',
})
export class AssignChannelModalComponent
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
  @Input() matchParam: MatchModel;

  paginator: PaginatorState;
  sorting: SortState;
  grouping: GroupingState;
  isLoading: boolean;
  filterGroup: FormGroup;
  matchestatusList: KeyValuePair[];
  selectedGLiveID: number;

  private subscriptions: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

  constructor(
    private fb: FormBuilder,
    public gLiveMatchService: GLiveMatchService,
    public matchService: MatchService,
    public modal: NgbActiveModal
  ) { }

  // angular lifecircle hooks
  ngOnInit(): void {
    this.filterForm();
    this.grouping = this.gLiveMatchService.grouping;
    this.paginator = this.gLiveMatchService.paginator;
    this.sorting = this.gLiveMatchService.sorting;

    //default sorting
    this.sorting.column = "timeStart";
    this.sorting.direction = "asc";

    this.gLiveMatchService.fetch();

    const sb = this.gLiveMatchService.isLoading$.subscribe(res => this.isLoading = res);
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

    if(this.matchParam && this.matchParam.matchDate){
      if(this.matchParam.gLiveMatchID){
        gLiveMatchID = this.matchParam.gLiveMatchID.toString();

        this.selectedGLiveID = this.matchParam.gLiveMatchID;
      }
      
      today = new Date(this.matchParam.matchDate); 

      to.setHours(today.getHours() + 6); // today + 6 hours
    }


    this.filterGroup = this.fb.group({
      gLiveMatchID: gLiveMatchID,
      tournament: tournament,
      homeTeam: homeTeam,
      awayTeam: awayTeam,
      timeStart: new Date(today),
      timeEnd: new Date(to)
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
    this.gLiveMatchService.patchStateWithoutFetch({ filter });
  }

  filter() {
    this.selectedGLiveID = 0; //clear selected match

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

    this.gLiveMatchService.patchState({ filter });
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
    this.gLiveMatchService.patchState({ sorting });
  }

  // pagination
  paginate(paginator: PaginatorState) {
    this.gLiveMatchService.patchState({ paginator });
  }

  selectMatch(id: number){    
    this.selectedGLiveID = id;
  }

  clearMapping(){
    this.matchParam.gLiveMatchID = null;
    this.mapMatchChannel();
  }

  submitSelected(){
    if(this.selectedGLiveID && this.selectedGLiveID > 0){
      this.matchParam.gLiveMatchID = this.selectedGLiveID;
      this.mapMatchChannel();
    }
  }

  mapMatchChannel(){
    const sb = this.matchService.mapMatchChannel(this.matchParam)
      .subscribe(
        () => {
          this.modal.close();
        },
        (err) => {
          console.log(err);
          this.modal.close();
        }
      );
  
      this.subscriptions.push(sb);
  }

  isSelected(id: number){
    return id == this.selectedGLiveID;
  }

   // form actions
  create() {
    //theme required
  }

  edit() {
    //theme required
  }

  deleteSelected() {
    //theme required
  }

  updateStatusForSelected() {
    //theme required
  }

  fetchSelected() {
    //theme required
  }
}
