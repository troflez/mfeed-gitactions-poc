import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject,  Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { MatchLogModel } from '../../../_models/match-log.model';
import { MatchService } from '../../../_services/match.service';

@Component({
  selector: 'app-match-log-modal',
  templateUrl: './match-log-modal.component.html'
})
export class MatchLogModalComponent implements OnInit, OnDestroy {
  @Input() id: number;
  apiURL = `${environment.apiUrl}`;
  matchLogs: MatchLogModel[] = [];
  isLoading = false;
  subscriptions: Subscription[] = [];
  formGroup: FormGroup;
  msg$ = new BehaviorSubject<string>(undefined);

  constructor(private matchService: MatchService,
    private fb: FormBuilder, 
    public modal: NgbActiveModal) { }

  ngOnInit(): void {
    this.loadMatchLoges();
    this.loadForm();
  }

  loadMatchLoges() {
    const sb = this.matchService.getMatchLogs(this.id).pipe(
      first()
    ).subscribe((res: MatchLogModel[]) => {
      this.matchLogs = res;
    });
    this.subscriptions.push(sb);
  }

  loadForm() {
    this.formGroup = this.fb.group({
    });
  }  

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}
