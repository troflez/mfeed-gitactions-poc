import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { catchError, delay, finalize, first, tap } from 'rxjs/operators';
import { UserModel } from '../../../_models/user.model';
import { UserService } from '../../../_services/user.service';

@Component({
  selector: 'app-update-users-status-modal',
  templateUrl: './update-users-status-modal.component.html'
})
export class UpdateUsersStatusModalComponent implements OnInit, OnDestroy {
  @Input() ids: number[];
  status = 2;
  users: UserModel[] = [];
  isLoading = false;
  subscriptions: Subscription[] = [];

  constructor(private userService: UserService, public modal: NgbActiveModal) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    const sb = this.userService.items$.pipe(
      first()
    ).subscribe((res: UserModel[]) => {
      this.users = res.filter(c => this.ids.indexOf(c.id) > -1);
    });
    this.subscriptions.push(sb);
  }

  updateUsersStatus() {
    this.isLoading = true;
    const sb = this.userService.updateStatusForItems(this.ids, +this.status).pipe(
      delay(1000), // Remove it from your code (just for showing loading)
      tap(() => this.modal.close()),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(undefined);
      }),
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe();
    this.subscriptions.push(sb);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}
