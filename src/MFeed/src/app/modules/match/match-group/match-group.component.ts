// tslint:disable:no-string-literal
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatchGroupService } from '../_services/match-group.service';
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
import { EditMatchGroupModalComponent } from './components/edit-match-group-modal/edit-match-group-modal.component';
import { SiteConstants } from 'src/app/helpers/site-constants';
import { AuthService } from '../../auth';
import { DeleteMatchGroupModalComponent } from './components/delete-match-group-modal/delete-match-group-modal.component';

@Component({
  selector: 'app-match-group',
  templateUrl: './match-group.component.html'
})
export class MatchGroupComponent
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

  private subscriptions: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    public matchGroupService: MatchGroupService,
    public authService: AuthService
  ) { }

  // angular lifecircle hooks
  ngOnInit(): void {
    this.filterForm();
    this.matchGroupService.fetch();
    this.paginator = this.matchGroupService.paginator;
    this.sorting = this.matchGroupService.sorting;
    const sb = this.matchGroupService.isLoading$.subscribe(res => this.isLoading = res);
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

  // form actions
  create() {
    this.edit(undefined);
  }

  edit(id: number) {
    const modalRef = this.modalService.open(EditMatchGroupModalComponent, { size: 'sm' });
    modalRef.componentInstance.id = id;
    modalRef.result.then(() =>
      this.matchGroupService.fetch()
    );
  }

  public get MODULE(): typeof SiteConstants.MODULE {
    return SiteConstants.MODULE; 
  }

  delete(id: number) {
    const modalRef = this.modalService.open(DeleteMatchGroupModalComponent);
    modalRef.componentInstance.id = id;
    modalRef.result.then(() => this.matchGroupService.fetch());
  }

  updateStatusForSelected() {
    //required by theme
  }

  fetchSelected() {
    //required by theme
  }
}
