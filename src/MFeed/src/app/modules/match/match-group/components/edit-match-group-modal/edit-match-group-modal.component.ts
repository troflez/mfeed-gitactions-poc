import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { catchError, first, tap } from 'rxjs/operators';
import { FormHelper } from 'src/app/helpers/form-helper';
import { CustomAdapter, CustomDateParserFormatter } from '../../../../../_metronic/core';
import { MatchGroupModel } from '../../../_models/match-group.model';
import { MatchGroupService } from '../../../_services/match-group.service';

const EMPTY_MATCHGROUP: MatchGroupModel = {
  id: undefined,
  matchGroupID: undefined,
  name: ''
};

@Component({
  selector: 'app-edit-match-group-modal',
  templateUrl: './edit-match-group-modal.component.html',
  // NOTE: For this example we are only providing current component, but probably
  // NOTE: you will w  ant to provide your main App Module
  providers: [
    {provide: NgbDateAdapter, useClass: CustomAdapter},
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
  ]
})
export class EditMatchGroupModalComponent extends FormHelper implements OnInit, OnDestroy {
  @Input() id: number;
  isLoading$;
  matchGroup: MatchGroupModel;
  formGroup: FormGroup;

  private subscriptions: Subscription[] = [];
  
  constructor(
    private matchgroupsService: MatchGroupService,
    private fb: FormBuilder, public modal: NgbActiveModal
    ) {       
      super();
      this.formGroup = super.formGroup;
    }

  ngOnInit(): void {
    this.isLoading$ = this.matchgroupsService.isLoading$;

    this.loadMatchGroup();
  }

  loadMatchGroup() {
    if (!this.id) {
      this.matchGroup = EMPTY_MATCHGROUP;
      this.loadForm();
    } else {
      const sb = this.matchgroupsService.getItemById(this.id).pipe(
        first(),
        catchError((errorMessage) => {
          this.modal.dismiss(errorMessage);
          return of(EMPTY_MATCHGROUP);
        })
      ).subscribe((matchgroup: MatchGroupModel) => {
        this.matchGroup = matchgroup;
        this.loadForm();
      });
      this.subscriptions.push(sb);
    }
  }

  loadForm() {
    this.formGroup = this.fb.group({
      name: [this.matchGroup.name, Validators.compose([Validators.required])]
    });
  }

  save() {
    this.prepareMatchGroup();
    if (this.matchGroup.id) {
      this.edit();
    } else {
      this.create();
    }
  }

  edit() {
    const sbUpdate = this.matchgroupsService.update(this.matchGroup).pipe(
      tap(() => {
        this.modal.close();
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(this.matchGroup);
      }),
    ).subscribe(res => this.matchGroup = res);
    this.subscriptions.push(sbUpdate);
  }

  create() {
    const sbCreate = this.matchgroupsService.create(this.matchGroup).pipe(
      tap(() => {
        this.modal.close();
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(this.matchGroup);
      }),
    ).subscribe((res: MatchGroupModel) => this.matchGroup = res);
    this.subscriptions.push(sbCreate);
  }

  private prepareMatchGroup() {
    const formData = this.formGroup.value;
    this.matchGroup.name = formData.name;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}
