import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { InlineSVGModule } from 'ng-inline-svg';
import { NewsComponent } from './news.component';
import { NewsRoutingModule } from './news-routing.module';
import { CRUDTableModule } from '../../_metronic/shared/crud-table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDatepickerModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    NewsComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    NewsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    InlineSVGModule,
    CRUDTableModule,
    NgbModalModule,
    NgbDatepickerModule
  ],
  // entryComponents: [
  //   UpdateUsersStatusModalComponent,
  //   FetchUsersModalComponent
  // ]
})
export class NewsModule {}
