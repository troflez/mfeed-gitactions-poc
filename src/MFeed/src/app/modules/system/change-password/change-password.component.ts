import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { AuthService } from '../../auth';
import { AuthModel } from '../../auth/_models/auth.model';
import { ChangePasswordModel } from '../_models/change-password.model';
import { ConfirmPasswordValidator } from '../../../helpers/confirm-password.validator';
import { UserService } from '../_services/user.service';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ChangeSuccessModalComponent } from './components/change-success-modal/change-success-modal.component';
import { FormHelper } from 'src/app/helpers/form-helper';

const EMPTY_MODEL : ChangePasswordModel = {
  oldPassword: "",
  newPassword: ""
};

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html'
})
export class ChangePasswordComponent extends FormHelper implements OnInit, OnDestroy {
  formGroup: FormGroup;
  user: AuthModel;
  model: ChangePasswordModel;
  firstUserState: AuthModel;
  subscriptions: Subscription[] = [];
  hasError$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  //isLoading$: Observable<boolean>;
  
  constructor(private authService: AuthService, 
    private userService: UserService, 
    private fb: FormBuilder,
    private config: NgbModalConfig,
    private modalService: NgbModal) {
      super();
      this.formGroup = super.formGroup;
  }

  ngOnInit(): void {
    this.model = EMPTY_MODEL;

    const sb = this.authService.currentUserSubject.asObservable().pipe(
      first(user => !!user)
    ).subscribe(user => {
      this.user = Object.assign({}, user);
      this.firstUserState = Object.assign({}, user);

      this.loadForm();
    });
    this.subscriptions.push(sb);

    this.config.backdrop = 'static';
  }

  loadForm() {
    this.formGroup = this.fb.group({
      currentPassword: ['', Validators.required],
      password: ['', Validators.required],
      cPassword: ['', Validators.required]
    }, {
      validator: ConfirmPasswordValidator.MatchPassword
    });
  }

  save() {
    this.hasError$.next(false);

    this.formGroup.markAllAsTouched();
    if (!this.formGroup.valid) {
      return;
    }

    this.model.oldPassword = this.formGroup.value.currentPassword;
    this.model.newPassword = this.formGroup.value.password;

    //this.modalService.open(ChangeSuccessModalComponent, {size: 'md'});
    const cpSub = this.userService.changePassword(this.model)
     .subscribe((message: string) => {
        this.modalService.open(ChangeSuccessModalComponent, {size: 'md'});
      },
      (err: string) => {
        this.hasError$.next(true);
      });
    
    this.subscriptions.push(cpSub);
  }

  cancel() {
    this.user = Object.assign({}, this.firstUserState);
    this.loadForm();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}
