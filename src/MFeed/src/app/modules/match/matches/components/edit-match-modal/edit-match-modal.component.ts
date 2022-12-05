import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, of, Subscription } from 'rxjs';
import { catchError, first, tap } from 'rxjs/operators';
import { MatchModel } from '../../../_models/match.model';
import { MatchService } from '../../../_services/match.service';
import { CustomAdapter, CustomDateParserFormatter } from '../../../../../_metronic/core';
import { __makeTemplateObject } from 'tslib';
import { environment } from 'src/environments/environment';
import { FormHelper } from 'src/app/helpers/form-helper';


@Component({
  selector: 'app-edit-match-modal',
  templateUrl: './edit-match-modal.component.html',
  // NOTE: For this example we are only providing current component, but probably
  // NOTE: you will w  ant to provide your main App Module
  providers: [
    {provide: NgbDateAdapter, useClass: CustomAdapter},
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
  ]
})
export class EditMatchModalComponent extends FormHelper implements OnInit, OnDestroy {
  @Input() id: number;
  _apiURL = `${environment.apiUrl}`;
  isLoading$;
  _match: MatchModel;
  formGroup: FormGroup;
  _homeTeamFile: File;
  _awayTeamFile: File;
  _isHomeTeamFileLocal: boolean;
  _isAwayTeamFileLocal: boolean;

  _msg$ = new BehaviorSubject<string>(undefined);

  private subscriptions: Subscription[] = [];
  constructor(
    private matchService: MatchService,
    private fb: FormBuilder, public modal: NgbActiveModal
    ) {
      super();
      this.formGroup = super.formGroup;
    }

  ngOnInit(): void {
    this.isLoading$ = this.matchService.isLoading$;
    this.loadMatch();
  }

  loadMatch() {
    this._msg$.next(undefined);
    this._isHomeTeamFileLocal = true;
    this._isHomeTeamFileLocal = true;

      const sb = this.matchService.getItemById(this.id).pipe(
        first(),
        catchError((errorMessage) => {
          this.modal.dismiss(errorMessage);
          return of(undefined);
        })
      ).subscribe((match: MatchModel) => {
        this._match = match;

        this._isHomeTeamFileLocal = (match.homeTeamIcon == "" || match.homeTeamIcon == null || match.homeTeamIcon == undefined);
        this._isAwayTeamFileLocal = (match.awayTeamIcon == "" || match.awayTeamIcon == null || match.homeTeamIcon == undefined);

        this.loadForm();
      });
      this.subscriptions.push(sb);
  }

  loadForm() {
    this.formGroup = this.fb.group({
      tournament: [this._match.tournament, Validators.compose([Validators.required])],
      homeTeam: [this._match.homeTeam, Validators.compose([Validators.required])],
      homeTeamIcon: [this._match.homeTeamIcon, Validators.compose([Validators.required])],
      awayTeam: [this._match.awayTeam, Validators.compose([Validators.required])],
      awayTeamIcon: [this._match.awayTeamIcon, Validators.compose([Validators.required])]
    });
  }

  reset(){
    this.loadMatch();
  }

  save() {
    if (this._match.id) {
      this.edit();
    }
  }

  edit() {
    const sbUpdate = this.matchService.update(this._match).pipe(
      tap(() => {
        if(this._homeTeamFile != null && this._homeTeamFile != undefined){
          const sbUpload = this.matchService.uploadTeamIcon(this._homeTeamFile).subscribe();
          this.subscriptions.push(sbUpload);
        }
        
        if(this._awayTeamFile != null && this._awayTeamFile != undefined){
          const sbUpload = this.matchService.uploadTeamIcon(this._awayTeamFile).subscribe();
          this.subscriptions.push(sbUpload);
        }
        
        this.modal.close();
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(this._match);
      }),
    ).subscribe(res => this._match = res);
    this.subscriptions.push(sbUpdate);
  }

  onFileSelected(event, isHomeTeam: boolean){
    const file: File = event.target.files[0];
    const mimeType: string = file.type;

    this._msg$.next(undefined);

    if (mimeType.match(/image\/*/) == null) {
			this._msg$.next("Only images are supported");
			return;
		}
    
    const formData = this.formGroup.value;
    if(isHomeTeam){
      formData.homeTeamIcon = file.name;
      this._match.homeTeamIcon = file.name;
      this._homeTeamFile = file;

      this._isHomeTeamFileLocal = true;
    }
    else{
      formData.awayTeamIcon = file.name;
      this._match.awayTeamIcon = file.name;
      this._awayTeamFile = file;

      this._isHomeTeamFileLocal = true;
    }
  }

  private readUrl(file: File) {
    var reader = new FileReader();
		reader.readAsDataURL(file);

    return reader.result;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}
