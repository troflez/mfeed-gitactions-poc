import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { catchError, first, tap } from 'rxjs/operators';
import { CustomAdapter, CustomDateParserFormatter } from '../../../../../_metronic/core';
import { KeyValuePair } from 'src/app/helpers/site-constants';
import { DomainWhitelistService } from '../../../_services/domain-whitelist.service';
import { DomainWhitelistModel } from '../../../_models/domain-whitelist.model';
import { FormHelper } from 'src/app/helpers/form-helper';

const EMPTY_DOMAINWHITELIST: DomainWhitelistModel = {
  id: undefined,
  domainWhitelistID: undefined,
  name: ''
};

@Component({
  selector: 'app-edit-api-client-modal',
  templateUrl: './edit-api-client-modal.component.html',
  // NOTE: For this example we are only providing current component, but probably
  // NOTE: you will w  ant to provide your main App Module
  providers: [
    {provide: NgbDateAdapter, useClass: CustomAdapter},
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
  ]
})
export class EditAPIClientModalComponent extends FormHelper implements OnInit, OnDestroy {
  @Input() id: number;
  isLoading$;
  domainWhitelist: DomainWhitelistModel;
  formGroup: FormGroup;
  domainwhitelistTypeList: KeyValuePair[];  
  domainwhitelistStatusList: KeyValuePair[];

  private subscriptions: Subscription[] = [];
  
  constructor(
    private domainwhitelistsService: DomainWhitelistService,
    private fb: FormBuilder, public modal: NgbActiveModal
    ) { 
      super();
      this.formGroup = super.formGroup;
    }

  ngOnInit(): void {
    this.isLoading$ = this.domainwhitelistsService.isLoading$;

    this.loadDomainWhitelist();
  }

  loadDomainWhitelist() {
    if (!this.id) {
      this.domainWhitelist = EMPTY_DOMAINWHITELIST;
      this.loadForm();
    } else {
      const sb = this.domainwhitelistsService.getItemById(this.id).pipe(
        first(),
        catchError((errorMessage) => {
          this.modal.dismiss(errorMessage);
          return of(EMPTY_DOMAINWHITELIST);
        })
      ).subscribe((domainwhitelist: DomainWhitelistModel) => {
        this.domainWhitelist = domainwhitelist;
        this.loadForm();
      });
      this.subscriptions.push(sb);
    }
  }

  loadForm() {
    this.formGroup = this.fb.group({
      name: [this.domainWhitelist.name, Validators.compose([Validators.required])]
    });
  }

  save() {
    this.prepareDomainWhitelist();
    if (this.domainWhitelist.id) {
      this.edit();
    } else {
      this.create();
    }
  }

  edit() {
    const sbUpdate = this.domainwhitelistsService.update(this.domainWhitelist).pipe(
      tap(() => {
        this.modal.close();
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(this.domainWhitelist);
      }),
    ).subscribe(res => this.domainWhitelist = res);
    this.subscriptions.push(sbUpdate);
  }

  create() {
    const sbCreate = this.domainwhitelistsService.create(this.domainWhitelist).pipe(
      tap(() => {
        this.modal.close();
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(this.domainWhitelist);
      }),
    ).subscribe((res: DomainWhitelistModel) => this.domainWhitelist = res);
    this.subscriptions.push(sbCreate);
  }

  private prepareDomainWhitelist() {
    const formData = this.formGroup.value;
    this.domainWhitelist.name = formData.name;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}
