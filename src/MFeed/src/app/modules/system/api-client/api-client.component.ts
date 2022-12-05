// tslint:disable:no-string-literal
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DomainWhitelistService } from '../_services/domain-whitelist.service';
import {
  GroupingState,
  PaginatorState,
  SortState,
  ICreateAction,
  IEditAction,
  // IDeleteAction,
  // IDeleteSelectedAction,
  IFetchSelectedAction,
  IUpdateStatusForSelectedAction,
  ISortView,
  IFilterView,
  IGroupingView,
  //ISearchView,
} from '../../../_metronic/shared/crud-table';
import { EditAPIClientModalComponent } from './components/edit-api-client-modal/edit-api-client-modal.component';
import { KeyValuePair, SiteConstants } from 'src/app/helpers/site-constants';
import { AuthService } from '../../auth';
import { DeleteAPIClientModalComponent } from './components/delete-api-client-modal/delete-api-client-modal.component';

@Component({
  selector: 'app-api-client',
  templateUrl: './api-client.component.html',
})
export class APIClientComponent
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
  domainwhitelistStatusList: KeyValuePair[];

  private subscriptions: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    public domainWhitelistService: DomainWhitelistService, 
    public authService: AuthService
  ) { }

  // angular lifecircle hooks
  ngOnInit(): void {
    //this.searchForm();
    this.domainWhitelistService.fetch();
    //this.grouping = this.domainWhitelistService.grouping;
    this.paginator = this.domainWhitelistService.paginator;
    this.sorting = this.domainWhitelistService.sorting;
    const sb = this.domainWhitelistService.isLoading$.subscribe(res => this.isLoading = res);
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
    this.domainWhitelistService.patchState({ sorting });
  }// filtration
  filterForm() {
    // this.filterGroup = this.fb.group({
    //   username: [''],
    //   email: [''],
    //   status: [''],
    // });
    // this.subscriptions.push(
    //   this.filterGroup.controls.username.valueChanges.pipe(
    //     debounceTime(150),
    //     distinctUntilChanged()
    //   ).subscribe(() =>
    //     this.filter()
    //   )
    // );
    // this.subscriptions.push(
    //   this.filterGroup.controls.email.valueChanges.pipe(
    //     debounceTime(150),
    //     distinctUntilChanged()
    //   ).subscribe(() =>
    //     this.filter()
    //   )
    // );
    // this.subscriptions.push(
    //   this.filterGroup.controls.status.valueChanges.pipe(
    //     debounceTime(150),
    //     distinctUntilChanged()
    //   ).subscribe(() =>
    //     this.filter()
    //   )
    // );

    // //initialize filter
    // const filter = {
    //   username: '',
    //   email: '',
    //   status: null
    // };
    // this.domainWhitelistService.patchStateWithoutFetch({ filter });
  }

  filter() {
    // const filter = {
    //   username: '',
    //   email: '',
    //   status: null
    // };

    // const username = this.filterGroup.get('username').value;
    // if (username) {
    //   filter['username'] = username;
    // }

    // const email = this.filterGroup.get('email').value;
    // if (email) {
    //   filter['email'] = email;
    // }

    // const status = this.filterGroup.get('status').value;
    // if (status) {
    //   filter['status'] = status;
    // }

    //this.domainWhitelistService.patchState({ filter });
  }

  // pagination
  paginate(paginator: PaginatorState) {
    this.domainWhitelistService.patchState({ paginator });
  }

  // form actions
  create() {
    this.edit(undefined);
  }

  edit(id: number) {
    const modalRef = this.modalService.open(EditAPIClientModalComponent, { size: 'md' });
    modalRef.componentInstance.id = id;
    modalRef.result.then(() =>
      this.domainWhitelistService.fetch(),
      () => { }
    );
  }

  public get MODULE(): typeof SiteConstants.MODULE {
    return SiteConstants.MODULE; 
  }

  delete(id: number) {
    const modalRef = this.modalService.open(DeleteAPIClientModalComponent);
    modalRef.componentInstance.id = id;
    modalRef.result.then(() => this.domainWhitelistService.fetch(), () => { });
  }

  deleteSelected() {
  }

  updateStatusForSelected() {
  }

  fetchSelected() {
  }
}
