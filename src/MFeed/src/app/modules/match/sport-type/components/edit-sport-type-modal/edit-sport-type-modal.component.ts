import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { catchError, first, tap } from 'rxjs/operators';
import { FormHelper } from 'src/app/helpers/form-helper';
import { CustomAdapter, CustomDateParserFormatter } from '../../../../../_metronic/core';
import { SportTypeModel } from '../../../_models/sport-type.model';
import { SportTypeService } from '../../../_services/sport-type.service';

const EMPTY_SPORTTYPE: SportTypeModel = {
  id: undefined,
  sportTypeID: undefined,
  name: '',
  spid: undefined,
  isActive: true
};

@Component({
  selector: 'app-edit-sport-type-modal',
  templateUrl: './edit-sport-type-modal.component.html',
  // NOTE: For this example we are only providing current component, but probably
  // NOTE: you will w  ant to provide your main App Module
  providers: [
    {provide: NgbDateAdapter, useClass: CustomAdapter},
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
  ]
})
export class EditSportTypeModalComponent extends FormHelper implements OnInit, OnDestroy {
  @Input() id: number;
  isLoading$;
  sportType: SportTypeModel;
  formGroup: FormGroup;

  private subscriptions: Subscription[] = [];
  
  constructor(
    private sportTypesService: SportTypeService,
    private fb: FormBuilder, public modal: NgbActiveModal
    ) { 
      super();
      this.formGroup = super.formGroup;
    }

  ngOnInit(): void {
    this.isLoading$ = this.sportTypesService.isLoading$;

    this.loadSportType();
  }

  loadSportType() {
    if (!this.id) {
      this.sportType = EMPTY_SPORTTYPE;
      this.loadForm();
    } else {
      const sb = this.sportTypesService.getItemById(this.id).pipe(
        first(),
        catchError((errorMessage) => {
          this.modal.dismiss(errorMessage);
          return of(EMPTY_SPORTTYPE);
        })
      ).subscribe((sporttype: SportTypeModel) => {
        this.sportType = sporttype;
        this.loadForm();
      });
      this.subscriptions.push(sb);
    }
  }

  loadForm() {
    this.formGroup = this.fb.group({
      name: [this.sportType.name, Validators.compose([Validators.required])],
      spID: [this.sportType.spid, Validators.compose([Validators.required])],
      isActive: [this.sportType.isActive, Validators.compose([Validators.required])]
    });
  }

  save() {
    this.prepareSportType();
    if (this.sportType.id) {
      this.edit();
    } else {
      this.create();
    }
  }

  edit() {
    const sbUpdate = this.sportTypesService.update(this.sportType).pipe(
      tap(() => {
        this.modal.close();
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(this.sportType);
      }),
    ).subscribe(res => this.sportType = res);
    this.subscriptions.push(sbUpdate);
  }

  create() {
    const sbCreate = this.sportTypesService.create(this.sportType).pipe(
      tap(() => {
        this.modal.close();
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(this.sportType);
      }),
    ).subscribe((res: SportTypeModel) => this.sportType = res);
    this.subscriptions.push(sbCreate);
  }

  private prepareSportType() {
    const formData = this.formGroup.value;
    this.sportType.name = formData.name;
    this.sportType.spid = formData.spID;
    this.sportType.isActive = formData.isActive;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}
