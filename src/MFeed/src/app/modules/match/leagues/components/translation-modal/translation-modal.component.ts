import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, of, Subscription } from 'rxjs';
import { catchError, first, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { TeamModel } from '../../../_models/team.model';
import { TeamService } from '../../../_services/team.service';
import { LeagueService } from '../../../_services/league.service';
import { LanguageService } from '../../../_services/language.service';
import { LanguageModel } from '../../../_models/language.model';
import { TeamTransModel } from '../../../_models/team-trans.model';
import { LeagueTransModel } from '../../../_models/league-trans.model';

@Component({
  selector: 'app-translation-modal',
  templateUrl: './translation-modal.component.html'
})
export class TranslationModalComponent implements OnInit, OnDestroy {
  @Input() leagueID: number;
  apiURL = `${environment.apiUrl}`;
  leagueTrans: LeagueTransModel[] = [];
  leagueTransForm: any[] = [];
  teams: TeamModel[] = [];
  teamTrans: TeamTransModel[] = [];
  teamTransForm: any[] = [];
  languages: LanguageModel[] = [];
  isLoading = false;
  subscriptions: Subscription[] = [];
  formGroup: FormGroup;
  msg$ = new BehaviorSubject<string>(undefined);

  constructor(private teamService: TeamService,
    private leagueService: LeagueService,
    private languageService: LanguageService,
    private fb: FormBuilder, 
    public modal: NgbActiveModal) { }

  ngOnInit(): void {
    this.languageService.getList()
        .subscribe( (res) => { 
          this.languages = res; 
        
          this.loadLeague();
          this.loadTeams();
        });

  }

  loadLeague() {
    const sb = this.leagueService.getLeagueTransList(this.leagueID).pipe(
      first()
    ).subscribe((res: LeagueTransModel[]) => {
      this.leagueTrans = res;
      this.loadLeagueForm();
    });
    this.subscriptions.push(sb);
  }

  loadLeagueForm() {
    let row = {};
    for(let item of this.languages){
      let languageID = item.id;

      for(let transItem of this.leagueTrans){
        if(transItem.leagueID == this.leagueID && transItem.languageID == languageID){
          row[languageID] = transItem.displayNameTrans;
          break;
        }
      }
    }
    
    this.leagueTransForm[0] = row;
  } 
  
  loadTeams() {
    const sb = this.teamService.getList(this.leagueID).pipe(
      first()
    ).subscribe((res: TeamModel[]) => {
      this.teams = res;
      this.loadTeamTranslations();
    });
    this.subscriptions.push(sb);
  }


  loadTeamTranslations() {
    const sb = this.teamService.getTeamTransList(this.leagueID).pipe(
      first()
    ).subscribe((res: TeamTransModel[]) => {
      this.teamTrans = res;
      this.loadTeamForm();
    });
    this.subscriptions.push(sb);
  }

  loadTeamForm() {
    this.formGroup = this.fb.group({
    });

    var teamIndex = 0;
    for(let teamItem of this.teams){
      let row = {};
      let teamID = teamItem.id;
      row["teamID"] = teamID;

      for(let langItem of this.languages){
        let languageID = langItem.id;

        for(let transItem of this.teamTrans){
          if(transItem.teamID == teamID && transItem.languageID == languageID){
            row[languageID] = transItem.displayNameTrans;
            break;
          }
        }
      }
    
      this.teamTransForm[teamIndex] = row;
      teamIndex++;
    }
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
  }

  save(){
    this.saveLeagueTrans();
  }

  saveLeagueTrans(){
    this.parseLeagueForm();
    
    const sb = this.leagueService.batchUpdateLeagueTrans(this.leagueTrans).pipe(
      tap(() => {
        this.saveTeamTrans();
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(this.leagueTrans);
      }),
    ).subscribe();
    this.subscriptions.push(sb);
  }

  parseLeagueForm(){
    for(let item of this.leagueTrans){
      item.displayNameTrans = this.leagueTransForm[0][item.languageID];
    }
  }

  saveTeamTrans(){
    this.parseTeamForm();
    
    const sbTeamUpdate = this.teamService.batchUpdateTeamTrans(this.teamTrans).pipe(
      tap(() => {
        this.modal.close();
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(this.teams);
      }),
    ).subscribe();
    this.subscriptions.push(sbTeamUpdate);
  }

  parseTeamForm(){
    for(let teamItem of this.teamTrans){
      let teamID = teamItem.teamID;
      let languageID = teamItem.languageID;

      for(let item of this.teamTransForm){
        if(item.teamID == teamID){
          teamItem.displayNameTrans = item[languageID];
          break;
        }
      }
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}
