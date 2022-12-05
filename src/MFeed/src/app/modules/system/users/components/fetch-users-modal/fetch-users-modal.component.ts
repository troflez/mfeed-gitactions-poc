import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { UserModel } from '../../../_models/user.model';
import { UserService } from '../../../_services/user.service';

@Component({
  selector: 'app-fetch-users-modal',
  templateUrl: './fetch-users-modal.component.html'
})
export class FetchUsersModalComponent implements OnInit, OnDestroy {
  @Input() ids: number[];
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

  fetchSelected() {
    this.isLoading = true;
    // just imitation, call server for fetching data
    setTimeout(() => {
      this.isLoading = false;
      this.modal.close();
    }, 1000);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}
