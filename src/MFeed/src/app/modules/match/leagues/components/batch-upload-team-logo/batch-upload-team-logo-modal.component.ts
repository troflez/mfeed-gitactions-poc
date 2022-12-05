import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, of, Subscription } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { TeamService } from '../../../_services/team.service';
import { LeagueService } from '../../../_services/league.service';

@Component({
  selector: 'app-batch-upload-team-logo-modal',
  templateUrl: './batch-upload-team-logo-modal.component.html'
})
export class BatchUploadTeamLogoModalComponent implements OnInit, OnDestroy {
  @Input() leagueID: number;
  @Input() mode: number; //1 = team, 2 = league
  apiURL = `${environment.apiUrl}`;
  zipFilename: string;
  zipFile: File;
  isLoading = false;
  subscriptions: Subscription[] = [];
  formGroup: FormGroup;
  msg$ = new BehaviorSubject<string>(undefined);

  constructor(private teamService: TeamService,
    private leagueService: LeagueService,
    private fb: FormBuilder, 
    public modal: NgbActiveModal) { }

  ngOnInit(): void {
    this.loadForm();
  }

  loadForm() {
    this.formGroup = this.fb.group({
      //published: [this.published]
    });
  }  

  onFileSelected(event){
    const file: File = event.target.files[0];
    const mimeType: string = file.type;

    this.msg$.next(undefined);

    if (mimeType.match(/zip\/*/) == null) {
			this.msg$.next("Only images are supported");
			return;
		}
    
    this.zipFilename = file.name;
    this.zipFile = file;
  }

  save(){
    if(this.mode == 1)
      this.uploadTeamIcons();
    else
      this.uploadLeagueIcons();
  }

  uploadLeagueIcons(){
    const sbUpdate = this.leagueService.batchUploadIcon(this.zipFile)
    .pipe(
      tap(() => {
        this.modal.close();
      }),
      catchError(err => {
        this.msg$.next("File size should be less than 1MB.");
        return of(undefined);
      }),
    ).subscribe();
    this.subscriptions.push(sbUpdate);
  }

  uploadTeamIcons(){
    const sbUpdate = this.teamService.batchUploadIcon(this.zipFile)
    .pipe(
      tap(() => {
        this.modal.close();
      }),
      catchError(err => {
        this.msg$.next("File size should be less than 1MB.");
        return of(undefined);
      }),
    ).subscribe();
    this.subscriptions.push(sbUpdate);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}
