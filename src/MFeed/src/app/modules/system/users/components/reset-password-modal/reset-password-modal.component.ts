import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, of, Subscription } from 'rxjs';
import { catchError, first } from 'rxjs/operators';
import { AuthService } from '../../../../auth/_services/auth.service';
import { UserModel } from '../../../_models/user.model';
import { UserService } from '../../../_services/user.service';
@Component({
  selector: 'app-reset-password-modal',
  templateUrl: './reset-password-modal.component.html',
})
export class ResetPasswordModalComponent implements OnInit {  
  @Input() id: number;

  _userModel$ = new BehaviorSubject<UserModel>({
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
    lastUpdatedBy: ''});
  _isYes: boolean;

  private unsubscribe: Subscription[] = [];

  constructor(private authService: AuthService, 
    private userService: UserService, 
    public modal: NgbActiveModal){
    
  }

  ngOnInit(): void {
    this._isYes = false;

    this.initForm();
  }

  initForm(){
    const sb = this.userService.getItemById(this.id).pipe(
      first(),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(undefined);
      })
    ).subscribe((user: UserModel) => {
      this._userModel$.next(user);
    });
  }

  yes(): void{
    const resetPWSub = this.authService.forgotPassword(this._userModel$.value.email)
      .subscribe((success: boolean) => {
        if(success){
          this._isYes = true;
          //this.modal.close();
          //document.location.reload();
        }
      });

    this.unsubscribe.push(resetPWSub);    
  }
  ok(): void{
    this.modal.close();
  }
  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
