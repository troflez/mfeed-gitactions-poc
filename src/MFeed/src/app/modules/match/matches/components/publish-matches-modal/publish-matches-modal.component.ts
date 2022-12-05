import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { MatchModel } from '../../../_models/match.model';
import { MatchService } from '../../../_services/match.service';

@Component({
  selector: 'app-publish-matches-modal',
  templateUrl: './publish-matches-modal.component.html'
})
export class PublishMatchesModalComponent implements OnInit, OnDestroy {
  @Input() ids: number[];
  @Input() isPublish: boolean;
  matches: MatchModel[] = [];
  isLoading = false;
  subscriptions: Subscription[] = [];
  formGroup: FormGroup;
  published: string;

  publishLabel: string;

  constructor(private matchService: MatchService,
    private fb: FormBuilder, 
    public modal: NgbActiveModal) { }

  ngOnInit(): void {
    this.published = "";
    this.loadMatches();
    this.loadForm();
  }

  loadMatches() {
    const sb = this.matchService.items$.pipe(
      first()
    ).subscribe((res: MatchModel[]) => {
      this.matches = res.filter(c => this.ids.indexOf(c.id) > -1);
    });
    this.subscriptions.push(sb);
  }

  loadForm() {
    this.formGroup = this.fb.group({
      published: [this.published]
    });
  }

  unpublish(){
    const formData = this.formGroup.value;
    formData.published = "no";

    this.publish();
  }

  publish() {
    this.isLoading = true;

    const formData = this.formGroup.value;
    this.published = formData.published;
    
    const sb = this.matchService.batchPublish(this.ids, this.published)
      .subscribe(
        () => {
          this.isLoading = false;
          this.modal.close();
        },
        (err) => {
          console.log(err);
          this.modal.close();
        }
      );
    this.subscriptions.push(sb);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}
