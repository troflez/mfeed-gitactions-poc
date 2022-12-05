import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SiteConstants } from 'src/app/helpers/site-constants';
import { AuthGuard } from '../auth/_services/auth.guard';
import { GLiveMatchesComponent } from './glive-matches/glive-matches.component';
import { LeagueComponent } from './leagues/league.component';
import { MatchGroupComponent } from './match-group/match-group.component';

import { MatchComponent } from './match.component';
import { MatchesComponent } from './matches/matches.component';
import { OddsTypeComponent } from './odds-type/odds-type.component';
import { SportTypeComponent } from './sport-type/sport-type.component';

const routes: Routes = [
  {
    path: '',
    component: MatchComponent,
    children: [
      {
        path: 'matches',
        component: MatchesComponent,
        canActivate: [AuthGuard],
        data: {
          module: SiteConstants.MODULE.SBFeedMatches
        }
      },
      {
        path: 'glive-matches',
        component: GLiveMatchesComponent,
        canActivate: [AuthGuard],
        data: {
          module: SiteConstants.MODULE.GLiveMatches
        }
      },
      {
        path: 'leagues',
        component: LeagueComponent,
        canActivate: [AuthGuard],
        data: {
          module: SiteConstants.MODULE.League
        }
      },
      {
        path: 'match-group',
        component: MatchGroupComponent,
        canActivate: [AuthGuard],
        data: {
          module: SiteConstants.MODULE.MatchGroup
        }
      },
      {
        path: 'sport-type',
        component: SportTypeComponent,
        canActivate: [AuthGuard],
        data: {
          module: SiteConstants.MODULE.SportType
        }
      },
      {
        path: 'odds-type',
        component: OddsTypeComponent,
        canActivate: [AuthGuard],
        data: {
          module: SiteConstants.MODULE.OddsType
        }
      },
      { path: '', redirectTo: 'matches', pathMatch: 'full' },
      { path: '**', redirectTo: 'matches', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MatchRoutingModule {}
