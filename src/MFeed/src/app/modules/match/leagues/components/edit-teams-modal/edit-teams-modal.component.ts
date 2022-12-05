import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { FormBuilder, FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, of, Subscription } from 'rxjs';
import { catchError, first, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { TeamModel } from '../../../_models/team.model';
import { TeamService } from '../../../_services/team.service';
import { LogoSelectorModalComponent } from '../logo-selector-modal/logo-selector-modal.component';

@Component({
  selector: 'app-edit-teams-modal',
  templateUrl: './edit-teams-modal.component.html'
})
export class EditTeamsModalComponent implements OnInit, OnDestroy {
  @Input() leagueID: number;
  @Input() leagueName: string;
  apiURL = `${environment.apiUrl}`;
  teams: TeamModel[] = [];
  isLoading = false;
  subscriptions: Subscription[] = [];
  formGroup: FormGroup;
  msg$ = new BehaviorSubject<string>(undefined);

  constructor(private teamService: TeamService,
    private modalService: NgbModal,
    private fb: FormBuilder, 
    public modal: NgbActiveModal,
    public sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.loadTeams();
    this.loadForm();
  }

  loadTeams() {
    const sb = this.teamService.getList(this.leagueID).pipe(
      first()
    ).subscribe((res: TeamModel[]) => {
      this.teams = res;
    });
    this.subscriptions.push(sb);
  }

  loadForm() {
    this.formGroup = this.fb.group({
    });
  }  

  onFileSelected(event, index: number){
    const file: File = event.target.files[0];
    const mimeType: string = file.type;

    this.msg$.next(undefined);

    if (mimeType.match(/image\/*/) == null) {
			this.msg$.next("Only images are supported");
			return;
		}
    
    this.teams[index].icon = file.name;
    this.teams[index].iconFile = file;

    var reader = new FileReader();

    reader.onloadend = () => {      
      this.teams[index].iconURL = reader.result.toString();
    }
    reader.readAsDataURL(file);
  }

  save(){
    const sbUpdate = this.teamService.batchUpdate(this.teams).pipe(
      tap(() => {
        for(let item of this.teams){
          if(item.icon != null && item.icon != undefined && item.icon.length > 0
            && item.iconFile){
            const sbUpload = this.teamService.uploadIcon(item.iconFile).subscribe();
            this.subscriptions.push(sbUpload);
          }
        }
        this.modal.close();
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(this.teams);
      }),
    ).subscribe();
    this.subscriptions.push(sbUpdate);
  }

  openLogoModal(i: number, filename: string) {
    const modalRef = this.modalService.open(LogoSelectorModalComponent, { size: 'md' });
    modalRef.componentInstance.selectedLogo = filename;
    modalRef.componentInstance.mode = 1;
    modalRef.result.then((result) => {
        this.teams[i].icon = result;
      }, () => {  
        // to avoid runtime error
      }
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}
