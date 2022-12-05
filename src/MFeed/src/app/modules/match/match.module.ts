import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { InlineSVGModule } from 'ng-inline-svg';
import { MatchComponent } from './match.component';
import { MatchRoutingModule } from './match-routing.module';
import { CRUDTableModule } from '../../_metronic/shared/crud-table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDatepickerModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { MatchesComponent } from './matches/matches.component';
import { PublishMatchesModalComponent } from './matches/components/publish-matches-modal/publish-matches-modal.component';
import { GLiveMatchesComponent } from './glive-matches/glive-matches.component';
import { EditLeagueModalComponent } from './leagues/components/edit-league-modal/edit-league-modal.component';
import { LeagueComponent } from './leagues/league.component';

import { OwlDateTimeModule, OwlNativeDateTimeModule } from '@danielmoncada/angular-datetime-picker';
import { AssignChannelModalComponent } from './matches/components/assign-channel-modal/assign-channel-modal.component';
import { EditMatchModalComponent } from './matches/components/edit-match-modal/edit-match-modal.component';
import { EditTeamsModalComponent } from './leagues/components/edit-teams-modal/edit-teams-modal.component';
import { MatchLogModalComponent } from './matches/components/match-log-modal/match-log-modal.component';
import { TranslationModalComponent } from './leagues/components/translation-modal/translation-modal.component';
import { BatchUploadTeamLogoModalComponent } from './leagues/components/batch-upload-team-logo/batch-upload-team-logo-modal.component';
import { MatchGroupComponent } from './match-group/match-group.component';
import { EditMatchGroupModalComponent } from './match-group/components/edit-match-group-modal/edit-match-group-modal.component';
import { DeleteMatchGroupModalComponent } from './match-group/components/delete-match-group-modal/delete-match-group-modal.component';
import { AssignGroupModalComponent } from './matches/components/assign-group-modal/assign-group-modal.component';
import { SyncLeagueTeamModalComponent } from './leagues/components/sync-league-team-modal/sync-league-team-modal.component'
import { SportTypeComponent } from './sport-type/sport-type.component';
import { EditSportTypeModalComponent } from './sport-type/components/edit-sport-type-modal/edit-sport-type-modal.component';
import { OddsTypeComponent } from './odds-type/odds-type.component';
import { EditOddsTypeModalComponent } from './odds-type/components/edit-odds-type-modal/edit-odds-type-modal.component';
import { LogoSelectorModalComponent } from './leagues/components/logo-selector-modal/logo-selector-modal.component';

@NgModule({
  declarations: [
    MatchesComponent,
    MatchComponent,
    EditMatchModalComponent,
    PublishMatchesModalComponent,
    GLiveMatchesComponent,
    AssignChannelModalComponent,
    AssignGroupModalComponent,
    EditLeagueModalComponent,
    LeagueComponent,
    EditTeamsModalComponent,
    MatchLogModalComponent,
    TranslationModalComponent,
    BatchUploadTeamLogoModalComponent,
    MatchGroupComponent,
    EditMatchGroupModalComponent,
    DeleteMatchGroupModalComponent,
    SyncLeagueTeamModalComponent,
    SportTypeComponent,
    EditSportTypeModalComponent,
    OddsTypeComponent,
    EditOddsTypeModalComponent,
    LogoSelectorModalComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    MatchRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    InlineSVGModule,
    CRUDTableModule,
    NgbModalModule,
    NgbDatepickerModule,
    OwlDateTimeModule, 
    OwlNativeDateTimeModule
  ],
  providers: [DatePipe],
  entryComponents: [
    EditMatchModalComponent,
    PublishMatchesModalComponent,
    AssignChannelModalComponent,
    AssignGroupModalComponent
  ]
})
export class MatchModule {}
