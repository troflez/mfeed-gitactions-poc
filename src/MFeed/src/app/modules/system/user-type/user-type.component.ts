import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserTypeService } from '../_services/user-type.service';
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
import { EditUserTypeModalComponent } from './components/edit-user-type-modal/edit-user-type-modal.component';
import { SiteConstants } from 'src/app/helpers/site-constants';
import { AuthService } from '../../auth';

@Component({
  selector: 'app-user-type',
  templateUrl: './user-type.component.html'
})
export class UserTypeComponent
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
    public userTypeService: UserTypeService,
    public authService: AuthService
  ) { }

  // angular lifecircle hooks
  ngOnInit(): void {
    this.filterForm();
    this.userTypeService.fetch();
    this.paginator = this.userTypeService.paginator;
    this.sorting = this.userTypeService.sorting;
    const sb = this.userTypeService.isLoading$.subscribe(res => this.isLoading = res);
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
    this.userTypeService.patchState({ sorting });
  }
  
  // filtration
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

    //initialize filter
    const filter = {
      name: ''
    };

    this.userTypeService.patchStateWithoutFetch({ filter });
  }

  filter() {
    const filter = {
      name: ''
    };

    const name = this.filterGroup.get('name').value;
    if (name) {
      filter['name'] = name;
    }

    this.userTypeService.patchState({ filter });
  }

  // pagination
  paginate(paginator: PaginatorState) {
    this.userTypeService.patchState({ paginator });
  }

  // form actions
  create() {
    this.edit(undefined);
  }

  edit(id: number) {
    const modalRef = this.modalService.open(EditUserTypeModalComponent, { size: 'md' });
    modalRef.componentInstance.id = id;
    modalRef.result.then(() =>
      this.userTypeService.fetch()
    );
  }

  public get MODULE(): typeof SiteConstants.MODULE {
    return SiteConstants.MODULE; 
  }  

  updateStatusForSelected() {
    //required by theme
  }

  fetchSelected() {
    //required by theme
  }
}
