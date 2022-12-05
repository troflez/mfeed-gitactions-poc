import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { catchError, first, tap } from 'rxjs/operators';
import { FormHelper } from 'src/app/helpers/form-helper';
import { CustomAdapter, CustomDateParserFormatter } from '../../../../../_metronic/core';
import { UserTypeModel } from '../../../_models/user-type.model';
import { UserTypeService } from '../../../_services/user-type.service';

const EMPTY_USERTYPE: UserTypeModel = {
  id: undefined,
  userTypeID: undefined,
  name: ''
};

@Component({
  selector: 'app-edit-user-type-modal',
  templateUrl: './edit-user-type-modal.component.html',
  // NOTE: For this example we are only providing current component, but probably
  // NOTE: you will w  ant to provide your main App Module
  providers: [
    {provide: NgbDateAdapter, useClass: CustomAdapter},
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
  ]
})
export class EditUserTypeModalComponent extends FormHelper implements OnInit, OnDestroy {
  @Input() id: number;
  isLoading$;
  userType: UserTypeModel;
  formGroup: FormGroup;

  private subscriptions: Subscription[] = [];
  
  constructor(private userTypesService: UserTypeService,
    private fb: FormBuilder, 
    public modal: NgbActiveModal
    ) { 
      super();
      this.formGroup = super.formGroup;
    }

  ngOnInit(): void {
    this.isLoading$ = this.userTypesService.isLoading$;

    this.loadUserType();
  }

  loadUserType() {
    if (!this.id) {
      this.userType = EMPTY_USERTYPE;
      this.loadForm();
    } else {
      const sb = this.userTypesService.getItemById(this.id).pipe(
        first(),
        catchError((errorMessage) => {
          this.modal.dismiss(errorMessage);
          return of(EMPTY_USERTYPE);
        })
      ).subscribe((usertype: UserTypeModel) => {
        this.userType = usertype;
        this.loadForm();
      });
      this.subscriptions.push(sb);
    }
  }

  loadForm() {
    this.formGroup = this.fb.group({
      name: [this.userType.name, Validators.compose([Validators.required])]
    });
  }

  save() {
    this.prepareUserType();
    if (this.userType.id) {
      this.edit();
    } else {
      this.create();
    }
  }

  edit() {
    const sbUpdate = this.userTypesService.update(this.userType).pipe(
      tap(() => {
        this.modal.close();
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(this.userType);
      }),
    ).subscribe(res => this.userType = res);
    this.subscriptions.push(sbUpdate);
  }

  create() {
    const sbCreate = this.userTypesService.create(this.userType).pipe(
      tap(() => {
        this.modal.close();
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(this.userType);
      }),
    ).subscribe((res: UserTypeModel) => this.userType = res);
    this.subscriptions.push(sbCreate);
  }

  private prepareUserType() {
    const formData = this.formGroup.value;
    this.userType.name = formData.name;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}
