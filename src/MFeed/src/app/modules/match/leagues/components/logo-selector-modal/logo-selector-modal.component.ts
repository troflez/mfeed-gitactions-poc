import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { FormBuilder, FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, first } from 'rxjs/operators';
import { PaginatorState } from 'src/app/_metronic/shared/crud-table/models/paginator.model';
import { environment } from 'src/environments/environment';
import { TeamService } from '../../../_services/team.service';
import { LeagueService } from '../../../_services/league.service';

@Component({
  selector: 'app-logo-selector-modal',
  templateUrl: './logo-selector-modal.component.html'
})
export class LogoSelectorModalComponent implements OnInit, OnDestroy {
  @Input() selectedLogo: string;
  @Input() mode: number; //1 = Team, 2 = League
  apiURL = `${environment.apiUrl}`;
  logos: string[] = [];
  filteredLogos: string[] = [];
  isLoading = false;
  subscriptions: Subscription[] = [];
  formGroup: FormGroup;
  paginator: PaginatorState;
  msg$ = new BehaviorSubject<string>(undefined);
  filterGroup: FormGroup;

  constructor(private teamService: TeamService,
    private leagueService: LeagueService,
    private fb: FormBuilder, 
    public modal: NgbActiveModal,
    public sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.paginator = new PaginatorState();
    this.filterForm();

    if(this.mode == 1)
      this.loadTeamLogo();
    else
      this.loadLeagueLogo();

    this.loadForm();
  }

  filterForm() {
    this.filterGroup = this.fb.group({
      filename: ['']
    });
    this.subscriptions.push(
      this.filterGroup.controls.filename.valueChanges.pipe(
        debounceTime(150),
        distinctUntilChanged()
      ).subscribe(() =>
        this.filter()
      )
    );
  }

  filter() {
    const filename = this.filterGroup.get('filename').value;
    if (filename) {
      this.refreshDataTable();
    }
  }

  loadTeamLogo() {
    const sb = this.teamService.getLogoList().pipe(
      first()
    ).subscribe((res: string[]) => {
      this.logos = res;
      this.refreshDataTable();
    });
    this.subscriptions.push(sb);
  }

  loadLeagueLogo() {
    const sb = this.leagueService.getLogoList().pipe(
      first()
    ).subscribe((res: string[]) => {
      this.logos = res;
      this.refreshDataTable();
    });
    this.subscriptions.push(sb);
  }

  refreshDataTable(){    
    const filename = this.filterGroup.get('filename').value;

    this.filteredLogos = this.logos.filter((item) => { return filename.length == 0 || item.toLowerCase().indexOf(filename.toLowerCase()) > -1;  })
      .slice((this.paginator.page - 1) * this.paginator.pageSize, 
        ((this.paginator.page - 1) * this.paginator.pageSize) + this.paginator.pageSize);

    this.paginator.total = this.logos.filter((item) => { return filename.length == 0 || item.toLowerCase().indexOf(filename.toLowerCase()) > -1;  }).length;
  }

  loadForm() {
    this.formGroup = this.fb.group({
    });
  }  
  
  // pagination
  paginate() {
    this.refreshDataTable();
  }

  selectLogo(logo: string){    
    this.selectedLogo = logo;
  }

  isSelected(logo: string){
    return logo == this.selectedLogo;
  }

  save(){
    if(this.selectedLogo)
      this.modal.close(this.selectedLogo);
    else
      this.msg$.next("Please select a logo.");
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}
