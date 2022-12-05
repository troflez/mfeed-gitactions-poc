import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { InlineSVGModule } from 'ng-inline-svg';
import { UsersComponent } from './users/users.component';
import { SystemComponent } from './system.component';
import { SystemRoutingModule } from './system-routing.module';
import { CRUDTableModule } from '../../_metronic/shared/crud-table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FetchUsersModalComponent } from './users/components/fetch-users-modal/fetch-users-modal.component';
import { UpdateUsersStatusModalComponent } from './users/components/update-users-status-modal/update-users-status-modal.component';
import { EditUserModalComponent } from './users/components/edit-user-modal/edit-user-modal.component';
import { NgbDatepickerModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ChangeSuccessModalComponent } from './change-password/components/change-success-modal/change-success-modal.component';
import { WorkerServiceSettingComponent } from './worker-service-setting/worker-service-setting.component';
import { UserTypePermissionComponent } from './user-type-permission/user-type-permission.component';
import { ResetPasswordModalComponent } from './users/components/reset-password-modal/reset-password-modal.component';
import { APICheckerComponent } from './api-checker/api-checker.component';
import { APIClientComponent } from './api-client/api-client.component';
import { EditAPIClientModalComponent } from './api-client/components/edit-api-client-modal/edit-api-client-modal.component';
import { DeleteAPIClientModalComponent } from './api-client/components/delete-api-client-modal/delete-api-client-modal.component';
import { CacheCheckerComponent } from './cache-checker/cache-checker.component';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { UserTypeComponent } from './user-type/user-type.component';
import { EditUserTypeModalComponent } from './user-type/components/edit-user-type-modal/edit-user-type-modal.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    UsersComponent,
    SystemComponent,
    FetchUsersModalComponent,
    UpdateUsersStatusModalComponent,
    ResetPasswordModalComponent,
    EditUserModalComponent,
    ChangePasswordComponent,
    ChangeSuccessModalComponent,
    WorkerServiceSettingComponent,
    UserTypePermissionComponent,
    EditAPIClientModalComponent,
    DeleteAPIClientModalComponent,
    APIClientComponent,
    APICheckerComponent,
    CacheCheckerComponent,
    UserTypeComponent,
    EditUserTypeModalComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    SystemRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    InlineSVGModule,
    CRUDTableModule,
    NgbModalModule,
    NgbDatepickerModule,
    NgxJsonViewerModule,
    NgbModule
  ],
  entryComponents: [
    UpdateUsersStatusModalComponent,
    FetchUsersModalComponent
  ]
})
export class SystemModule {}
