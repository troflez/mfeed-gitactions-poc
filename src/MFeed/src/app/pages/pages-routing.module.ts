import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SiteConstants } from '../helpers/site-constants';
import { AuthGuard } from '../modules/auth/_services/auth.guard';
import { LayoutComponent } from './_layout/layout.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'match',
        loadChildren: () =>
          import('../modules/match/match.module').then((m) => m.MatchModule),
      },
      {
        path: 'builder',
        loadChildren: () =>
          import('./builder/builder.module').then((m) => m.BuilderModule),
      },
      {
        path: 'system',
        canActivate: [AuthGuard],
        data: {
          moduleGroup: 'system',
          module: 0
        },
        loadChildren: () =>
          import('../modules/system/system.module').then((m) => m.SystemModule),
      },
      {
        path: '',
        redirectTo: '/match/matches',
        pathMatch: 'full',
      },
      {
        path: '**',
        redirectTo: 'error/404',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
