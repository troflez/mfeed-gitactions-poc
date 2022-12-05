// tslint:disable:no-string-literal
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../_services/user.service';
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
import { EditUserModalComponent } from './components/edit-user-modal/edit-user-modal.component';
import { KeyValuePair, SiteConstants } from 'src/app/helpers/site-constants';
import { AuthService } from '../../auth';
import { ResetPasswordModalComponent } from './components/reset-password-modal/reset-password-modal.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html'
})
export class UsersComponent
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
  userStatusList: KeyValuePair[];

  private subscriptions: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    public userService: UserService, 
    public authService: AuthService
  ) { }

  // angular lifecircle hooks
  ngOnInit(): void {
    this.filterForm();
    this.userService.fetch();
    this.paginator = this.userService.paginator;
    this.sorting = this.userService.sorting;
    const sb = this.userService.isLoading$.subscribe(res => this.isLoading = res);
    this.subscriptions.push(sb);

    this.userStatusList = SiteConstants.getUserStatusList();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  // filtration
  filterForm() {
    this.filterGroup = this.fb.group({
      username: [''],
      email: [''],
      status: ['1'],
    });
    this.subscriptions.push(
      this.filterGroup.controls.username.valueChanges.pipe(
        debounceTime(150),
        distinctUntilChanged()
      ).subscribe(() =>
        this.filter()
      )
    );
    this.subscriptions.push(
      this.filterGroup.controls.email.valueChanges.pipe(
        debounceTime(150),
        distinctUntilChanged()
      ).subscribe(() =>
        this.filter()
      )
    );
    this.subscriptions.push(
      this.filterGroup.controls.status.valueChanges.pipe(
        debounceTime(150),
        distinctUntilChanged()
      ).subscribe(() =>
        this.filter()
      )
    );

    //initialize filter
    const filter = {
      username: '',
      email: '',
      status: '1'
    };
    this.userService.patchStateWithoutFetch({ filter });
  }

  filter() {
    const filter = {
      username: '',
      email: '',
      status: null
    };

    const username = this.filterGroup.get('username').value;
    if (username) {
      filter['username'] = username;
    }

    const email = this.filterGroup.get('email').value;
    if (email) {
      filter['email'] = email;
    }

    const status = this.filterGroup.get('status').value;
    if (status) {
      filter['status'] = status;
    }

    this.userService.patchState({ filter });
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
    this.userService.patchState({ sorting });
  }

  // pagination
  paginate(paginator: PaginatorState) {
    this.userService.patchState({ paginator });
  }

  // form actions
  create() {
    this.edit(undefined);
  }

  edit(id: number) {
    const modalRef = this.modalService.open(EditUserModalComponent, { size: 'md' });
    modalRef.componentInstance.id = id;
    modalRef.result.then(() =>
      this.userService.fetch(),
      () => { }
    );
  }

  resetPassword(id: number){
    const modalRef = this.modalService.open(ResetPasswordModalComponent, { size: 'md' });
    modalRef.componentInstance.id = id;
  }

  public get MODULE(): typeof SiteConstants.MODULE {
    return SiteConstants.MODULE; 
  }

  delete(id: number) {
  }
  //required by metronic

  deleteSelected() {
    //required by metronic
  }

  updateStatusForSelected() {
    //required by metronic
  }

  fetchSelected() {
    //required by metronic
  }
}
