// tslint:disable:no-string-literal
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BehaviorSubject, of, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, first } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatchService } from '../_services/match.service';
import { SportTypeService } from '../_services/sport-type.service';
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
import { PublishMatchesModalComponent } from './components/publish-matches-modal/publish-matches-modal.component';
import { KeyValuePair, SiteConstants } from 'src/app/helpers/site-constants';
import { DatePipe } from '@angular/common';
import { MatchModel } from '../_models/match.model';
import { AssignChannelModalComponent } from './components/assign-channel-modal/assign-channel-modal.component';
import { AuthService } from '../../auth';
import { EditMatchModalComponent } from './components/edit-match-modal/edit-match-modal.component';
import { MatchLogModalComponent } from './components/match-log-modal/match-log-modal.component';
import { AssignGroupModalComponent } from './components/assign-group-modal/assign-group-modal.component';
import { SportTypeModel } from '../_models/sport-type.model';

@Component({
  selector: 'app-matches',
  templateUrl: './matches.component.html',
  styleUrls: ['./matches.component.scss']
})
export class MatchesComponent
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
  sportTypeList$ = new BehaviorSubject<SportTypeModel[]>([]);

  currentSorting: any;

  private subscriptions: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    public matchService: MatchService,
    private datePipe: DatePipe, 
    public authService: AuthService,
    private sportTypeService: SportTypeService
  ) { }

  // angular lifecircle hooks
  ngOnInit(): void {
    this.filterForm();
    this.grouping = this.matchService.grouping;
    this.paginator = this.matchService.paginator;
    this.sorting = this.matchService.sorting;

    this.currentSorting =  { column: "matchDate", direction: "asc" };
    //default sorting
    this.sorting.column = this.currentSorting.column;
    this.sorting.direction = this.currentSorting.direction;

    this.matchService.fetch();

    const sb = this.matchService.isLoading$.subscribe(res => this.isLoading = res);
    this.subscriptions.push(sb);

    const sbST = this.sportTypeService.getList().pipe(
      first()
    ).subscribe((res: SportTypeModel[]) => {
      this.sportTypeList$.next(res);
    });
    this.subscriptions.push(sbST);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  // filtration
  filterForm() {
    let today = new Date();
    let to = new Date();

    today.setHours(today.getHours() - 1); //current time - 1 hours
    today.setMinutes(0);
    today.setSeconds(0);
    to.setDate(to.getDate() + 1); // + 1 day
    to.setMinutes(0);
    to.setSeconds(0);

    this.filterGroup = this.fb.group({
      matchID: [''],
      sportTypeID: [''],
      tournament: [''],
      homeTeam: [''],
      awayTeam: [''],
      matchStartDate: new Date(today),//{ year: today.getFullYear(), month: today.getMonth() + 1, day: today.getDate() },
      matchEndDate:  [''],//new Date(to),//{ year: to.getFullYear(), month: to.getMonth() + 1, day: to.getDate() },
      isPublishedM88: [''],
      isPublishedMGoal88: ['']
    });

    this.subscriptions.push(
      this.filterGroup.controls.matchID.valueChanges.pipe(
        debounceTime(500),
        distinctUntilChanged()
      ).subscribe(() =>
        this.filter()
      )
    );
    this.subscriptions.push(
      this.filterGroup.controls.sportTypeID.valueChanges.pipe(
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
      this.filterGroup.controls.matchStartDate.valueChanges.pipe(
        debounceTime(500),
        distinctUntilChanged()
      ).subscribe(() =>
        this.filter()
      )
    );
    this.subscriptions.push(
      this.filterGroup.controls.matchEndDate.valueChanges.pipe(
        debounceTime(500),
        distinctUntilChanged()
      ).subscribe(() =>
        this.filter()
      )
    );
    this.subscriptions.push(
      this.filterGroup.controls.isPublishedM88.valueChanges.pipe(
        debounceTime(500),
        distinctUntilChanged()
      ).subscribe(() =>
        this.filter()
      )
    );
    this.subscriptions.push(
      this.filterGroup.controls.isPublishedMGoal88.valueChanges.pipe(
        debounceTime(500),
        distinctUntilChanged()
      ).subscribe(() =>
        this.filter()
      )
    );

    //initialize filter
    const filter = {
      matchID: this.filterGroup.controls.matchID.value,
      sportTypeID: this.filterGroup.controls.sportTypeID.value,
      tournament: this.filterGroup.controls.tournament.value,
      homeTeam: this.filterGroup.controls.homeTeam.value,
      awayTeam: this.filterGroup.controls.awayTeam.value,
      matchStartDate: this.filterGroup.controls.matchStartDate.value,
      matchEndDate: this.filterGroup.controls.matchEndDate.value,
      isPublishedM88: this.filterGroup.controls.isPublishedM88.value,
      isPublishedMGoal88: this.filterGroup.controls.isPublishedMGoal88.value
    };
    this.matchService.patchStateWithoutFetch({ filter });
  }

  filter() {
    const filter = {
      matchID: '',
      sportTypeID: '',
      tournament: '',
      homeTeam: '',
      awayTeam: '',
      matchStartDate: null,
      matchEndDate: null,
      isPublishedM88: '',
      isPublishedMGoal88: ''
    };

    const matchID = this.filterGroup.get('matchID').value;
    if (matchID) {
      filter['matchID'] = matchID;
    }

    const sportTypeID = this.filterGroup.get('sportTypeID').value;
    if (sportTypeID) {
      filter['sportTypeID'] = sportTypeID;
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

    const matchStartDate = this.filterGroup.get('matchStartDate').value;
    if (matchStartDate) {
      filter['matchStartDate'] = matchStartDate;
    }

    const matchEndDate = this.filterGroup.get('matchEndDate').value;
    if (matchEndDate) {
      filter['matchEndDate'] = matchEndDate;
    }

    const isPublishedM88 = this.filterGroup.get('isPublishedM88').value;
    if (isPublishedM88) {
      filter['isPublishedM88'] = isPublishedM88;
    }

    const isPublishedMGoal88 = this.filterGroup.get('isPublishedMGoal88').value;
    if (isPublishedMGoal88) {
      filter['isPublishedMGoal88'] = isPublishedMGoal88;
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

    //preserve sorting state
    this.currentSorting = { column: sorting.column, direction: sorting.direction};

    this.matchService.patchState({ sorting });
  }

  // pagination
  paginate(paginator: PaginatorState) {
    this.matchService.patchState({ paginator });
  }

  publishSelected(){
    this.showPublishModal(this.grouping.getSelectedRows(), true);
  }

  unpublishSelected(){
    this.showPublishModal(this.grouping.getSelectedRows(), false);
  }

  publishSingle(id: number){
    let ids: number[] = [id];
    
    this.showPublishModal(ids, true);
  }

  unpublishSingle(id: number){
    let ids: number[] = [id];

    this.showPublishModal(ids, false);
  }

  assignGroup(){
    
    let ids = this.grouping.getSelectedRows();
    let groups = [];

    this.matchService.items$.subscribe((items) => {
      if(items && items.length > 0){
        for(const id of ids){
          let item = items.find(item => item.id == id);
          if(item && item.matchGroup){
            item.matchGroup.split(",").forEach((mgItem) => {
              if(groups.indexOf(mgItem) === -1){
                groups.push(mgItem);
              }
            })
          }
        }
      }
    });
    
    this.showAssignGroupModal(this.grouping.getSelectedRows(), groups);
  }

  private showPublishModal(ids: number[], isPublish: boolean){
    const modalRef = this.modalService.open(PublishMatchesModalComponent, { size: 'xl' });
    modalRef.componentInstance.ids = ids;
    modalRef.componentInstance.isPublish = isPublish;
    modalRef.result.then(() => this.matchService.fetch(), () => { });
  }

  showUpdateChannelModal(match: MatchModel){
    const modalRef = this.modalService.open(AssignChannelModalComponent, { size: 'xl' });
    modalRef.componentInstance.matchParam = match;
    modalRef.result.then(() => this.matchService.fetch(), () => { });
  }

  showLogs(id: number){
    const modalRef = this.modalService.open(MatchLogModalComponent, { size: 'xl' });
    modalRef.componentInstance.id = id;
    modalRef.result.then(() => this.matchService.fetch(), () => { });
  }

  showAssignGroupModal(ids: number[], groups: string[]){
    const modalRef = this.modalService.open(AssignGroupModalComponent, { size: 'lg' });
    modalRef.componentInstance.ids = ids;
    modalRef.componentInstance.selectedGroups = groups;
    modalRef.result.then(() => this.matchService.fetch(), () => { });
  }

  refresh(){
    this.matchService.fetch();
  }

  public get MODULE(): typeof SiteConstants.MODULE {
    return SiteConstants.MODULE; 
  }

  // refreshCallback(){
  //   const sorting = this.sorting;
  //   sorting.column = this.currentSorting.column;
  //   sorting.direction = this.currentSorting.direction;

  //   this.matchService.patchStateWithoutFetch({ sorting });
  //   this.filter();
  // }

   // form actions
   create() {
    //this.edit(undefined);
  }

  edit(id: number) {
    const modalRef = this.modalService.open(EditMatchModalComponent, { size: 'xl' });
    modalRef.componentInstance.id = id;
    modalRef.result.then(() =>
      this.matchService.fetch(),
      () => { }
    );
  }

  matchGroupTransform(val: string){
    let html = '';

    if(val){
      const values = val.split(',');
      for(let i = 0; i < values.length; i++){
        html += html == '' ? values[i]: ', ' + values[i];
        //html += '<span class="label label-lg label-inline label-light-primary mr-2">' + values[i] + '</span>';
      }

      html = '<span class="text-muted font-weight-bold">' + html + ' </span>'
    }

    return html;
  }

  delete(id: number) {
    // const modalRef = this.modalService.open(DeleteUserModalComponent);
    // modalRef.componentInstance.id = id;
    // modalRef.result.then(() => this.matchservice.fetch(), () => { });
  }

  deleteSelected() {
    // const modalRef = this.modalService.open(DeleteMatchesModalComponent);
    // modalRef.componentInstance.ids = this.grouping.getSelectedRows();
    // modalRef.result.then(() => this.matchservice.fetch(), () => { });
  }

  updateStatusForSelected() {
    // const modalRef = this.modalService.open(UpdateMatchesStatusModalComponent);
    // modalRef.componentInstance.ids = this.grouping.getSelectedRows();
    // modalRef.result.then(() => this.matchservice.fetch(), () => { });
  }

  fetchSelected() {
  //   const modalRef = this.modalService.open(FetchMatchesModalComponent);
  //   modalRef.componentInstance.ids = this.grouping.getSelectedRows();
  //   modalRef.result.then(() => this.matchservice.fetch(), () => { });
  }
}
