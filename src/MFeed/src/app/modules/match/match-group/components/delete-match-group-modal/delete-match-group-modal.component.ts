import { Component, Input, OnDestroy } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { catchError, delay, finalize, tap } from 'rxjs/operators';
import { MatchGroupService } from '../../../_services/match-group.service';

@Component({
  selector: 'app-delete-match-group-modal',
  templateUrl: './delete-match-group-modal.component.html'
})
export class DeleteMatchGroupModalComponent implements OnDestroy {
  @Input() id: number;
  isLoading = false;
  subscriptions: Subscription[] = [];

  constructor(private matchGroupService: MatchGroupService, public modal: NgbActiveModal) { }

  delete() {
    this.isLoading = true;
    const sb = this.matchGroupService.delete(this.id).pipe(
      delay(1000), // Remove it from your code (just for showing loading)
      tap(() => this.modal.close()),
      catchError((err) => {
        this.modal.dismiss(err);
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
