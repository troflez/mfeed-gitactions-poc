// tslint:disable:no-string-literal
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OddsTypeService } from '../_services/odds-type.service';
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
import { EditOddsTypeModalComponent } from './components/edit-odds-type-modal/edit-odds-type-modal.component';
import { SiteConstants } from 'src/app/helpers/site-constants';
import { AuthService } from '../../auth';

@Component({
  selector: 'app-odds-type',
  templateUrl: './odds-type.component.html'
})
export class OddsTypeComponent
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
    public oddsTypeService: OddsTypeService,
    public authService: AuthService
  ) { }

  // angular lifecircle hooks
  ngOnInit(): void {
    this.filterForm();
    this.oddsTypeService.fetch();
    this.paginator = this.oddsTypeService.paginator;
    this.sorting = this.oddsTypeService.sorting;
    const sb = this.oddsTypeService.isLoading$.subscribe(res => this.isLoading = res);
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
    this.oddsTypeService.patchState({ sorting });
  }// filtration
  filterForm() {
    this.filterGroup = this.fb.group({
      name: [''],   
      code: [''],   
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

    // //initialize filter
    const filter = {
      name: '',
      code: '',
      isActive: ['']
    };

    this.oddsTypeService.patchStateWithoutFetch({ filter });
  }

  filter() {
    const filter = {
      name: '',
      code: '',
      isActive: ''
    };

    const name = this.filterGroup.get('name').value;
    if (name) {
      filter['name'] = name;
    }

    const code = this.filterGroup.get('code').value;
    if (code) {
      filter['code'] = name;
    }

    const isActive = this.filterGroup.get('isActive').value;
    if (isActive) {
      filter['isActive'] = isActive;
    }

    this.oddsTypeService.patchState({ filter });
  }

  // pagination
  paginate(paginator: PaginatorState) {
    this.oddsTypeService.patchState({ paginator });
  }

  // form actions
  create() {
    this.edit(undefined);
  }

  edit(id: number) {
    const modalRef = this.modalService.open(EditOddsTypeModalComponent, { size: 'md' });
    modalRef.componentInstance.id = id;
    modalRef.result.then(() =>
      this.oddsTypeService.fetch()
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
