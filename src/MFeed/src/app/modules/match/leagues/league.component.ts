// tslint:disable:no-string-literal
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BehaviorSubject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, first } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LeagueService } from '../_services/league.service';
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
  IGroupingView,
} from '../../../_metronic/shared/crud-table';
import { EditLeagueModalComponent } from './components/edit-league-modal/edit-league-modal.component';
import { KeyValuePair, SiteConstants } from 'src/app/helpers/site-constants';
import { AuthService } from '../../auth';
import { environment } from 'src/environments/environment';
import { EditTeamsModalComponent } from './components/edit-teams-modal/edit-teams-modal.component';
import { TranslationModalComponent } from './components/translation-modal/translation-modal.component';
import { BatchUploadTeamLogoModalComponent } from './components/batch-upload-team-logo/batch-upload-team-logo-modal.component';
import { SyncLeagueTeamModalComponent } from './components/sync-league-team-modal/sync-league-team-modal.component';
import { SportTypeModel } from '../_models/sport-type.model';
import { SportTypeService } from '../_services/sport-type.service';

@Component({
  selector: 'app-league',
  templateUrl: './league.component.html',
})
export class LeagueComponent
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
  leagueStatusList: KeyValuePair[];
  sportTypeList$ = new BehaviorSubject<SportTypeModel[]>([]);
  apiURL = `${environment.apiUrl}`;
  
  currentSorting: any;

  private subscriptions: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    public leagueService: LeagueService, 
    public authService: AuthService,
    private sportTypeService: SportTypeService
  ) { }

  // angular lifecircle hooks
  ngOnInit(): void {
    const sbST = this.sportTypeService.getList().pipe(
      first()
    ).subscribe((res: SportTypeModel[]) => {
      this.sportTypeList$.next(res);
    });
    this.subscriptions.push(sbST);

    this.filterForm();
    this.paginator = this.leagueService.paginator;
    this.sorting = this.leagueService.sorting;
    
    this.currentSorting =  { column: "displayName", direction: "asc" };
    //default sorting
    this.sorting.column = this.currentSorting.column;
    this.sorting.direction = this.currentSorting.direction;

    this.leagueService.fetch();

    const sb = this.leagueService.isLoading$.subscribe(res => this.isLoading = res);
    this.subscriptions.push(sb);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
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

    this.leagueService.patchState({ sorting });
  }
  // filtration
  filterForm() {
    this.filterGroup = this.fb.group({
      name: [''],
      sportTypeID: [''],
      showTeamWoLogo: [ false ]
    });

    this.subscriptions.push(
      this.filterGroup.controls.name.valueChanges.pipe(
        debounceTime(150),
        distinctUntilChanged()
      ).subscribe(() =>
        this.filter()
      )
    );

    this.subscriptions.push(
      this.filterGroup.controls.sportTypeID.valueChanges.pipe(
        debounceTime(150),
        distinctUntilChanged()
      ).subscribe(() =>
        this.filter()
      )
    );

    this.subscriptions.push(
      this.filterGroup.controls.showTeamWoLogo.valueChanges.pipe(
        debounceTime(150),
        distinctUntilChanged()
      ).subscribe(() =>
        this.filter()
      )
    );
    //initialize filter
    const filter = {
      name: '',
      sportTypeID: '',
      showTeamWoLogo: false
    };
    this.leagueService.patchStateWithoutFetch({ filter });
  }

  filter() {
    const filter = {
      name: '',
      sportTypeID: '',
      showTeamWoLogo: false
    };

    const name = this.filterGroup.get('name').value;
    const sportTypeID = this.filterGroup.get('sportTypeID').value;
    const showTeamWoLogo = this.filterGroup.get('showTeamWoLogo').value;
    if (name) {
      filter['name'] = name;
    }
    if(sportTypeID){
      filter['sportTypeID'] = sportTypeID;
    }
    if(showTeamWoLogo){
      filter['showTeamWoLogo'] = showTeamWoLogo;
    }

    this.leagueService.patchState({ filter });
  }

  // pagination
  paginate(paginator: PaginatorState) {
    this.leagueService.patchState({ paginator });
  }

  // form actions
  create() {
    this.edit(undefined);
  }
  
  showTranslationModal(id: number){
    const modalRef = this.modalService.open(TranslationModalComponent, { size: 'xl' });
    modalRef.componentInstance.leagueID = id;
    modalRef.result.then(() =>
      this.leagueService.fetch(),
      () => {  
        // to avoid runtime error
      }
    );
  }

  edit(id: number) {
    const modalRef = this.modalService.open(EditLeagueModalComponent, { size: 'md' });
    modalRef.componentInstance.id = id;
    modalRef.result.then(() =>
      this.leagueService.fetch(),
      () => {  
        // to avoid runtime error
      }
    );
  }

  editTeams(leagueID: number, leagueName: string) {
    const modalRef = this.modalService.open(EditTeamsModalComponent, { size: 'lg' });
    modalRef.componentInstance.leagueID = leagueID;
    modalRef.componentInstance.leagueName = leagueName;
    modalRef.result.then(() =>
      this.leagueService.fetch(),
      () => {  
        // to avoid runtime error
      }
    );
  }

  showBatchUploadLeagueIcon(){    
    const modalRef = this.modalService.open(BatchUploadTeamLogoModalComponent, { size: 'md' });
    modalRef.componentInstance.mode = 2;
    modalRef.result.then(() =>
      this.leagueService.fetch(),
      () => {  
        // to avoid runtime error
      }
    );
  }

  showBatchUploadTeamIcon(){    
    const modalRef = this.modalService.open(BatchUploadTeamLogoModalComponent, { size: 'md' });
    modalRef.componentInstance.mode = 1;
    modalRef.result.then(() =>
      this.leagueService.fetch(),
      () => {  
        // to avoid runtime error
      }
    );
  }

  syncLT(){
    const modalRef = this.modalService.open(SyncLeagueTeamModalComponent, { size: 'lg' });
    modalRef.result.then(() =>
      this.leagueService.fetch(),
      () => {
        this.leagueService.fetch();
      }
    );
  }

  public get MODULE(): typeof SiteConstants.MODULE {
    return SiteConstants.MODULE; 
  }

  public get USERTYPE(): typeof SiteConstants.USERTYPE {
    return SiteConstants.USERTYPE; 
  }

  updateStatusForSelected() {
    //required by theme
  }

  fetchSelected() {
    //required by theme
  }
}
