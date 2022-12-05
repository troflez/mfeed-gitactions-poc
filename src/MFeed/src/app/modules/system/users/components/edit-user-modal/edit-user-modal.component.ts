import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { catchError, first, tap } from 'rxjs/operators';
import { UserModel } from '../../../_models/user.model';
import { UserService } from '../../../_services/user.service';
import { CustomAdapter, CustomDateParserFormatter } from '../../../../../_metronic/core';
import { KeyValuePair, SiteConstants } from 'src/app/helpers/site-constants';
import { UserTypeService } from '../../../_services/user-type.service';
import { UserTypeModel } from '../../../_models/user-type.model';
import { FormHelper } from 'src/app/helpers/form-helper';

const EMPTY_USER: UserModel = {
  id: undefined,
  email: '',
  username: '',
  userTypeID: 1,
  userType: '',
  userStatusID: 1,
  userStatus: '',
  dateCreated: undefined,
  createdBy: '',
  lastUpdated: undefined,
  lastUpdatedBy: ''
};

@Component({
  selector: 'app-edit-user-modal',
  templateUrl: './edit-user-modal.component.html',
  // NOTE: For this example we are only providing current component, but probably
  // NOTE: you will w  ant to provide your main App Module
  providers: [
    {provide: NgbDateAdapter, useClass: CustomAdapter},
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
  ]
})
export class EditUserModalComponent extends FormHelper implements OnInit, OnDestroy {
  @Input() id: number;
  isLoading$;
  user: UserModel;
  formGroup: FormGroup;
  userTypeList: UserTypeModel[];  
  userStatusList: KeyValuePair[];

  private subscriptions: Subscription[] = [];
  
  constructor(
    private usersService: UserService,
    private userTypeService: UserTypeService,
    private fb: FormBuilder, public modal: NgbActiveModal
    ) {
      super();
      this.formGroup = super.formGroup;
    }

  ngOnInit(): void {
    this.isLoading$ = this.usersService.isLoading$;

    const sb = this.userTypeService.getList().pipe(
      first()
    ).subscribe((res: UserTypeModel[]) => {
      this.userTypeList = res;
    });
    this.subscriptions.push(sb);
      
    this.userStatusList = SiteConstants.getUserStatusList();

    this.loadUser();
  }

  loadUser() {
    if (!this.id) {
      this.user = EMPTY_USER;
      this.loadForm();
    } else {
      const sb = this.usersService.getItemById(this.id).pipe(
        first(),
        catchError((errorMessage) => {
          this.modal.dismiss(errorMessage);
          return of(EMPTY_USER);
        })
      ).subscribe((user: UserModel) => {
        this.user = user;
        this.loadForm();
      });
      this.subscriptions.push(sb);
    }
  }

  loadForm() {
    this.formGroup = this.fb.group({
      email: [this.user.email, Validators.compose([Validators.required, Validators.email])],
      username: [this.user.username, Validators.compose([Validators.required])],
      userTypeID: [this.user.userTypeID, Validators.compose([Validators.required])],
      userStatusID: [this.user.userStatusID, Validators.compose([Validators.required])]
    });
  }

  save() {
    this.prepareUser();
    if (this.user.id) {
      this.edit();
    } else {
      this.create();
    }
  }

  edit() {
    const sbUpdate = this.usersService.update(this.user).pipe(
      tap(() => {
        this.modal.close();
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(this.user);
      }),
    ).subscribe(res => this.user = res);
    this.subscriptions.push(sbUpdate);
  }

  create() {
    const sbCreate = this.usersService.create(this.user).pipe(
      tap(() => {
        this.modal.close();
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(this.user);
      }),
    ).subscribe((res: UserModel) => this.user = res);
    this.subscriptions.push(sbCreate);
  }

  private prepareUser() {
    const formData = this.formGroup.value;
    this.user.email = formData.email;
    this.user.username = formData.username;
    this.user.userTypeID = formData.userTypeID;
    this.user.userStatusID = formData.userStatusID;
    // this.user.ipAddress = formData.ipAddress;
    // this.user.lastName = formData.lastName;
    // this.user.type = +formData.type;
    // this.user.userName = formData.userName;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}
