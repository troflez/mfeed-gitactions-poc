// tslint:disable:no-string-literal
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MatchGroupService } from '../../../_services/match-group.service';
import { MatchGroupingModel } from '../../../_models/match-grouping.model';
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
} from '../../../../../_metronic/shared/crud-table';
import { SiteConstants } from 'src/app/helpers/site-constants';
import { AuthService } from '../../../../auth';
import { MatchService } from '../../../_services/match.service';

@Component({
  selector: 'app-assign-group-modal',
  templateUrl: './assign-group-modal.component.html'
})
export class AssignGroupModalComponent
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
  @Input() ids: number[];
  @Input() selectedGroups: string[];
  paginator: PaginatorState;
  sorting: SortState;
  grouping: GroupingState;
  isLoading: boolean;
  filterGroup: FormGroup;
  selectedGroupIds: number[] = [];

  private subscriptions: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

  constructor(
    private fb: FormBuilder,
    private matchService: MatchService,
    public matchGroupService: MatchGroupService,
    public authService: AuthService,
    public modal: NgbActiveModal
  ) { }

  // angular lifecircle hooks
  ngOnInit(): void {
    this.filterForm();
    this.matchGroupService.fetch();
    this.grouping = this.matchGroupService.grouping;
    this.paginator = this.matchGroupService.paginator;
    this.sorting = this.matchGroupService.sorting;
    const sb = this.matchGroupService.isLoading$.subscribe(res => this.isLoading = res);
    this.subscriptions.push(sb);

    this.matchGroupService.items$.subscribe((items) => {
      let sIds = [];

      for(const group of this.selectedGroups){
        let item = items.find(i => i.name === group);
        if(item){
          sIds.push(item.id)
        }
      }
      this.selectedGroupIds = sIds;
    });
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
    this.matchGroupService.patchState({ sorting });
  }// filtration
  filterForm() {
    this.filterGroup = this.fb.group({
      name: ['']
    });
    this.subscriptions.push(
      this.filterGroup.controls.name.valueChanges.pipe(
        debounceTime(150),
        distinctUntilChanged()
      ).subscribe(() =>
        this.filter()
      )
    );

    // //initialize filter
    const filter = {
      name: ''
    };

    this.matchGroupService.patchStateWithoutFetch({ filter });
  }

  filter() {
    const filter = {
      name: ''
    };

    const name = this.filterGroup.get('name').value;
    if (name) {
      filter['name'] = name;
    }

    this.matchGroupService.patchState({ filter });
  }

  // pagination
  paginate(paginator: PaginatorState) {
    this.matchGroupService.patchState({ paginator });
  }

  public get MODULE(): typeof SiteConstants.MODULE {
    return SiteConstants.MODULE;
  }

  selectGroup(id: number){
    let i = this.selectedGroupIds.indexOf(id);

    if(i == -1){
      this.selectedGroupIds.push(id);
    }
    else{
      this.selectedGroupIds.splice(i, 1);
    }
  }

  save(){
    let ids = this.selectedGroupIds;
    let matchGrouping: MatchGroupingModel[] = [];

    if(ids.length > 0){
      for(let i = 0; i < this.ids.length; i++){
        for(let j = 0; j < ids.length; j++){
          let item: MatchGroupingModel = { matchID: this.ids[i], matchGroupID: ids[j]};
          matchGrouping.push(item);
        }
      }
    }
    else{
      for(let mId of this.ids){
        let item: MatchGroupingModel = { matchID: mId, matchGroupID: null};
        matchGrouping.push(item);
      }
    }

    const sb = this.matchService.batchAssignMatchGroup(matchGrouping).subscribe(
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

  isSelected(id: number){
    return this.selectedGroupIds.find(s => s === id) != undefined;
  }

  clear(){
    this.selectedGroupIds = [];
  }
}
