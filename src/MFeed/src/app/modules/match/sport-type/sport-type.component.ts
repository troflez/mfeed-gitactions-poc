import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
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
  IGroupingView,
} from '../../../_metronic/shared/crud-table';
import { EditSportTypeModalComponent } from './components/edit-sport-type-modal/edit-sport-type-modal.component';
import { SiteConstants } from 'src/app/helpers/site-constants';
import { AuthService } from '../../auth';

@Component({
  selector: 'app-sport-type',
  templateUrl: './sport-type.component.html'
})
export class SportTypeComponent
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
    public sportTypeService: SportTypeService,
    public authService: AuthService
  ) { }

  // angular lifecircle hooks
  ngOnInit(): void {
    this.filterForm();
    this.paginator = this.sportTypeService.paginator;
    this.sorting = this.sportTypeService.sorting;

    //default sorting
    this.sorting.column = "name";
    this.sorting.direction = "asc";

    this.sportTypeService.fetch();

    const sb = this.sportTypeService.isLoading$.subscribe(res => this.isLoading = res);
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
    this.sportTypeService.patchState({ sorting });
  }// filtration
  filterForm() {
    this.filterGroup = this.fb.group({
      name: [''],      
      isActive: ['']
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
      name: '',
      isActive: ['']
    };

    this.sportTypeService.patchStateWithoutFetch({ filter });
  }

  filter() {
    const filter = {
      name: '',
      isActive: ''
    };

    const name = this.filterGroup.get('name').value;
    if (name) {
      filter['name'] = name;
    }

    const isActive = this.filterGroup.get('isActive').value;
    if (isActive) {
      filter['isActive'] = isActive;
    }

    this.sportTypeService.patchState({ filter });
  }

  // pagination
  paginate(paginator: PaginatorState) {
    this.sportTypeService.patchState({ paginator });
  }

  // form actions
  create() {
    this.edit(undefined);
  }

  edit(id: number) {
    const modalRef = this.modalService.open(EditSportTypeModalComponent, { size: 'md' });
    modalRef.componentInstance.id = id;
    modalRef.result.then(() =>
      this.sportTypeService.fetch()
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
