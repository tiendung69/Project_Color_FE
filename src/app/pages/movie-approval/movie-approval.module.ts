import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListMovieapprovalComponent } from './list-movieapproval/list-movieapproval.component';
import { RouterModule, Routes } from '@angular/router';
import { GridAllModule } from '@syncfusion/ej2-angular-grids';
import { FormsModule } from '@angular/forms';
import { DatePickerAllModule } from '@syncfusion/ej2-angular-calendars';
import { TranslateModule } from '@ngx-translate/core';
import { DialogModule } from '@syncfusion/ej2-angular-popups';
import {
  DropDownListModule,
  MultiSelectAllModule,
} from '@syncfusion/ej2-angular-dropdowns';
import { ButtonModule } from '@syncfusion/ej2-angular-buttons';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TextBoxModule, UploaderModule } from '@syncfusion/ej2-angular-inputs';
import { SharedModule } from 'src/app/theme/components/shared.module';
import { MovieApprovalDetailComponent } from './movie-approval-detail/movie-approval-detail.component';
import { AssignedMovieComponent } from './assigned-movie/assigned-movie.component';
import { AssignedMovieDetailComponent } from './assigned-movie-detail/assigned-movie-detail.component';
import { ResultApprovalComponent } from './result-approval/result-approval.component';
import { ResultApprovalDetailComponent } from './result-approval/result-approval-detail/result-approval-detail.component';

export const routes: Routes = [
  { path: '', redirectTo: 'hoi-dong-duyet-phim', pathMatch: 'full' },
  {
    path: 'hoi-dong-duyet-phim',
    data: { breadcrumb: 'Hội đồng duyệt phim', routeKey: 'hoidongduyetphim' },
    children: [
      {
        path: '',
        component: ListMovieapprovalComponent,
        data: { breadcrumb: 'Hội đồng duyệt phim' },
      },
      {
        path: 'add',
        component: MovieApprovalDetailComponent,
        data: { breadcrumb: 'Hội đồng' },
      },
      {
        path: 'edit/:id',
        component: MovieApprovalDetailComponent,
        data: { breadcrumb: 'Chi tiết hội đồng duyệt phim' },
      },
    ],
  },
  
  { path: '', redirectTo: 'phim-duoc-giao', pathMatch: 'full' },
  {
    path: 'phim-duoc-giao',
    data: { breadcrumb: 'Phim được giao', routeKey: 'phimduocgiao' },
    children: [
      {
        path: '',
        component: AssignedMovieComponent,
        data: { breadcrumb: 'Phim được giao' },
      },
     
      {
        path: 'edit/:id',
        component: AssignedMovieDetailComponent,
        data: { breadcrumb: 'Chi tiết phim được giao' },
      },
    ],
  }, { path: '', redirectTo: 'ket-qua-duyet', pathMatch: 'full' },
  {
    path: 'ket-qua-duyet',
    data: { breadcrumb: 'Kết quả duyệt', routeKey: 'phimduocgiao' },
    children: [
      {
        path: '',
        component: ResultApprovalComponent,
        data: { breadcrumb: 'Kết quả duyệt' },
      },
     
      {
        path: 'edit/:id',
        component: ResultApprovalDetailComponent,
        data: { breadcrumb: 'Chi tiết kết quả duyệt' },
      },
    ],
  },
];
@NgModule({
  declarations: [ListMovieapprovalComponent, MovieApprovalDetailComponent, AssignedMovieComponent,AssignedMovieDetailComponent, ResultApprovalComponent, ResultApprovalDetailComponent],
  imports: [
    CommonModule,
    GridAllModule,
    FormsModule,
    DatePickerAllModule,
    TranslateModule,
    DialogModule,
    MultiSelectAllModule,
    ButtonModule,
    NgbModule,
    TextBoxModule,
    UploaderModule,
    DropDownListModule,
    SharedModule,
    RouterModule.forChild(routes),
  ],
})
export class MovieApprovalModule {}
