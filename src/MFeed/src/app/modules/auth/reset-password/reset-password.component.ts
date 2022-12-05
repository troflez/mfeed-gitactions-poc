import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from '../_services/auth.service';
import { first } from 'rxjs/operators';
import { ConfirmPasswordValidator } from '../../../helpers/confirm-password.validator';
import { ActivatedRoute } from '@angular/router';
import { ResetPasswordModel } from '../_models/reset-password.model';

enum ErrorStates {
  NotSubmitted,
  HasError,
  NoError,
}

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
  forgotPasswordForm: FormGroup;
  errorState: ErrorStates = ErrorStates.NotSubmitted;
  errorStates = ErrorStates;
  isLoading$: Observable<boolean>;
  email: string;
  token: string;

  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: ActivatedRoute
  ) {
    this.isLoading$ = this.authService.isLoading$;
  }

  ngOnInit(): void {
    this.email = this.router.snapshot.queryParamMap.get('email');
    this.token = this.router.snapshot.queryParamMap.get('t');

    this.initForm();
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.forgotPasswordForm.controls;
  }

  initForm() {
    this.forgotPasswordForm = this.fb.group({
      password: ['', Validators.required],
      cPassword: ['', Validators.required]
    },{
      validator: ConfirmPasswordValidator.MatchPassword
    });
  }

  submit() {
    let model: ResetPasswordModel = {
      email: this.email,
      token: this.token,
      newPassword: this.f.password.value
    }

    this.errorState = ErrorStates.NotSubmitted;
    const forgotPasswordSubscr = this.authService
      .resetPassword(model)
      .pipe(first())
      .subscribe((result: boolean) => {
        this.errorState = result ? ErrorStates.NoError : ErrorStates.HasError;
      });
    this.unsubscribe.push(forgotPasswordSubscr);
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

  // helpers for View
  isControlValid(controlName: string): boolean {
    const control = this.forgotPasswordForm.controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.forgotPasswordForm.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  controlHasError(validation, controlName): boolean {
    const control = this.forgotPasswordForm.controls[controlName];
    return control.hasError(validation) && (control.dirty || control.touched);
  }

  isControlTouched(controlName): boolean {
    const control = this.forgotPasswordForm.controls[controlName];
    return control.dirty || control.touched;
  }
}
