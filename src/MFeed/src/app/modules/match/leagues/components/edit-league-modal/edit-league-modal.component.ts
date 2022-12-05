import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, of, Subscription } from 'rxjs';
import { catchError, first, tap } from 'rxjs/operators';
import { CustomAdapter, CustomDateParserFormatter } from '../../../../../_metronic/core';
import { LeagueService } from '../../../_services/league.service';
import { LeagueModel } from '../../../_models/league.model';
import { environment } from 'src/environments/environment';
import { LogoSelectorModalComponent } from '../logo-selector-modal/logo-selector-modal.component';
import { FormHelper } from 'src/app/helpers/form-helper';

const EMPTY_LEAGUE: LeagueModel = {
  id: undefined,
  leagueID: undefined,
  displayName: '',
  sbFeedKey: '',
  icon: '',
  iconFile: undefined,
  iconDark: '',
  iconDarkFile: undefined
};

@Component({
  selector: 'app-edit-league-modal',
  templateUrl: './edit-league-modal.component.html',
  
  providers: [
    {provide: NgbDateAdapter, useClass: CustomAdapter},
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
  ]
})
export class EditLeagueModalComponent extends FormHelper implements OnInit, OnDestroy {
  @Input() id: number;
  apiURL = `${environment.apiUrl}`;
  isLoading$;
  league: LeagueModel;
  formGroup: FormGroup;
  
  msg$ = new BehaviorSubject<string>(undefined);
  file$ = new BehaviorSubject<Blob>(undefined);

  private subscriptions: Subscription[] = [];
  
  constructor(
    private leaguesService: LeagueService,
    private modalService: NgbModal,
    private fb: FormBuilder, 
    public modal: NgbActiveModal
    ) {
      super();
      this.formGroup = super.formGroup;
    }

  ngOnInit(): void {
    this.isLoading$ = this.leaguesService.isLoading$;

    this.loadLeague();
  }

  loadLeague() {
    if (!this.id) {
      this.league = EMPTY_LEAGUE;
      this.loadForm();
    } else {
      const sb = this.leaguesService.getItemById(this.id).pipe(
        first(),
        catchError((errorMessage) => {
          this.modal.dismiss(errorMessage);
          return of(EMPTY_LEAGUE);
        })
      ).subscribe((league: LeagueModel) => {
        this.league = league;

        this.loadForm();
      });
      this.subscriptions.push(sb);
    }
  }

  loadForm() {
    this.formGroup = this.fb.group({
      displayName: [this.league.displayName, Validators.compose([Validators.required])],
      icon: [this.league.icon],
      iconDark: [this.league.iconDark]
    });
  }

  onFileSelected(event){
    const file: File = event.target.files[0];
    const mimeType: string = file.type;

    this.msg$.next(undefined);

    if (mimeType.match(/image\/*/) == null) {
			this.msg$.next("Only images are supported");
			return;
		}
    
    const formData = this.formGroup.value;
    formData.icon = file.name;
    this.league.icon = file.name;
    this.league.iconFile = file;
  }

  onFileSelectedDark(event){
    const file: File = event.target.files[0];
    const mimeType: string = file.type;

    this.msg$.next(undefined);

    if (mimeType.match(/image\/*/) == null) {
			this.msg$.next("Only images are supported");
			return;
		}
    
    const formData = this.formGroup.value;
    formData.iconDark = file.name;
    this.league.iconDark = file.name;
    this.league.iconDarkFile = file;
  }

  save() {
    this.prepareLeague();
    if (this.league.id) {
      this.edit();
    } else {
      this.create();
    }
  }

  edit() {
    const sbUpdate = this.leaguesService.update(this.league).pipe(
      tap(() => {
        this.modal.close();
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(this.league);
      }),
    ).subscribe(res => this.league = res);
    this.subscriptions.push(sbUpdate);
  }

  create() {
    const sbCreate = this.leaguesService.create(this.league).pipe(
      tap(() => {
        this.modal.close();
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(this.league);
      }),
    ).subscribe((res: LeagueModel) => this.league = res);
    this.subscriptions.push(sbCreate);
  }
  
  getIcon(filename: string){
    const sbGetIcon = this.leaguesService.getIcon(filename)
      .subscribe(res => this.file$.next(res));

    this.subscriptions.push(sbGetIcon);
  }

  openLogoModal(filename: string, isLightIcon: boolean) {
    const modalRef = this.modalService.open(LogoSelectorModalComponent, { size: 'md' });
    modalRef.componentInstance.selectedLogo = filename;
    modalRef.componentInstance.mode = 2;
    modalRef.result.then((result) => {
        if(isLightIcon)
          this.league.icon = result;
        else
          this.league.iconDark = result;
      }, () => {  
        // to avoid runtime error
      }
    );
  }

  private prepareLeague() {
    const formData = this.formGroup.value;
    this.league.displayName = formData.displayName;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}
