import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { catchError, first, tap } from 'rxjs/operators';
import { FormHelper } from 'src/app/helpers/form-helper';
import { CustomAdapter, CustomDateParserFormatter } from '../../../../../_metronic/core';
import { OddsTypeModel } from '../../../_models/odds-type.model';
import { OddsTypeService } from '../../../_services/odds-type.service';

const EMPTY_ODDSTYPE: OddsTypeModel = {
  id: undefined,
  oddsTypeID: undefined,
  name: '',
  code: '',
  isActive: true
};

@Component({
  selector: 'app-edit-odds-type-modal',
  templateUrl: './edit-odds-type-modal.component.html',
  // NOTE: For this example we are only providing current component, but probably
  // NOTE: you will w  ant to provide your main App Module
  providers: [
    {provide: NgbDateAdapter, useClass: CustomAdapter},
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
  ]
})
export class EditOddsTypeModalComponent extends FormHelper implements OnInit, OnDestroy {
  @Input() id: number;
  isLoading$;
  oddsType: OddsTypeModel;
  formGroup: FormGroup;

  private subscriptions: Subscription[] = [];
  
  constructor(
    private oddsTypesService: OddsTypeService,
    private fb: FormBuilder, public modal: NgbActiveModal
    ) { 
      super();
      this.formGroup = super.formGroup;
    }

  ngOnInit(): void {
    this.isLoading$ = this.oddsTypesService.isLoading$;

    this.loadOddsType();
  }

  loadOddsType() {
    if (!this.id) {
      this.oddsType = EMPTY_ODDSTYPE;
      this.loadForm();
    } else {
      const sb = this.oddsTypesService.getItemById(this.id).pipe(
        first(),
        catchError((errorMessage) => {
          this.modal.dismiss(errorMessage);
          return of(EMPTY_ODDSTYPE);
        })
      ).subscribe((oddstype: OddsTypeModel) => {
        this.oddsType = oddstype;
        this.loadForm();
      });
      this.subscriptions.push(sb);
    }
  }

  loadForm() {
    this.formGroup = this.fb.group({
      name: [this.oddsType.name, Validators.compose([Validators.required])],
      code: [this.oddsType.code, Validators.compose([Validators.required])],
      isActive: [this.oddsType.isActive, Validators.compose([Validators.required])]
    });
  }

  save() {
    this.prepareOddsType();
    if (this.oddsType.id) {
      this.edit();
    } else {
      this.create();
    }
  }

  edit() {
    const sbUpdate = this.oddsTypesService.update(this.oddsType).pipe(
      tap(() => {
        this.modal.close();
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(this.oddsType);
      }),
    ).subscribe(res => this.oddsType = res);
    this.subscriptions.push(sbUpdate);
  }

  create() {
    const sbCreate = this.oddsTypesService.create(this.oddsType).pipe(
      tap(() => {
        this.modal.close();
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(this.oddsType);
      }),
    ).subscribe((res: OddsTypeModel) => this.oddsType = res);
    this.subscriptions.push(sbCreate);
  }

  private prepareOddsType() {
    const formData = this.formGroup.value;
    this.oddsType.name = formData.name;
    this.oddsType.code = formData.code;
    this.oddsType.isActive = formData.isActive;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}
