import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SiteConstants } from 'src/app/helpers/site-constants';
import { AuthGuard } from '../auth/_services/auth.guard';
import { APICheckerComponent } from './api-checker/api-checker.component';
import { APIClientComponent } from './api-client/api-client.component';
import { CacheCheckerComponent } from './cache-checker/cache-checker.component';
import { ChangePasswordComponent } from './change-password/change-password.component';

import { SystemComponent } from './system.component';
import { UserTypePermissionComponent } from './user-type-permission/user-type-permission.component';
import { UserTypeComponent } from './user-type/user-type.component';
import { UsersComponent } from './users/users.component';
import { WorkerServiceSettingComponent } from './worker-service-setting/worker-service-setting.component';

const routes: Routes = [
  {
    path: '',
    component: SystemComponent,
    children: [
      {
        path: 'users',
        component: UsersComponent,
        canActivate: [AuthGuard],
        data: {
          module: SiteConstants.MODULE.UserManagement
        }
      },
      {
        path: 'change-password',
        component: ChangePasswordComponent,
      },
      {
        path: 'user-group',
        component: UserTypeComponent,
        canActivate: [AuthGuard],
        data: {
          module: SiteConstants.MODULE.UserType
        }
      },
      {
        path: 'user-group-permission',
        component: UserTypePermissionComponent,
        canActivate: [AuthGuard],
        data: {
          module: SiteConstants.MODULE.UserTypePermission
        }
      },
      {
        path: 'worker-service-setting',
        component: WorkerServiceSettingComponent,
        canActivate: [AuthGuard],
        data: {
          module: SiteConstants.MODULE.WorkerServiceSetting
        }
      },
      {
        path: 'api-client',
        component: APIClientComponent,
        canActivate: [AuthGuard],
        data: {
          module: SiteConstants.MODULE.UserManagement
        }
      },
      {
        path: 'api-checker',
        component: APICheckerComponent,
        canActivate: [AuthGuard],
        data: {
          module: SiteConstants.MODULE.WorkerServiceSetting
        }
      },
      {
        path: 'cache-checker',
        component: CacheCheckerComponent,
        canActivate: [AuthGuard],
        data: {
          module: SiteConstants.MODULE.WorkerServiceSetting
        }
      },
      { path: '', redirectTo: 'users', pathMatch: 'full' },
      { path: '**', redirectTo: 'users', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SystemRoutingModule {}
