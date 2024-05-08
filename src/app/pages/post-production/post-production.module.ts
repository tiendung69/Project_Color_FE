import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilmPostProductionComponent } from './film-post-production/film-post-production.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/theme/components/shared.module';
import { FilterService, GridAllModule, GroupService, PageService, SortService } from '@syncfusion/ej2-angular-grids';
import { FormsModule } from '@angular/forms';
import { DatePickerAllModule } from '@syncfusion/ej2-angular-calendars';
import { DialogModule } from '@syncfusion/ej2-angular-popups';
import {
  DropDownListModule,
  MultiSelectAllModule,
} from '@syncfusion/ej2-angular-dropdowns';
import { ButtonModule } from '@syncfusion/ej2-angular-buttons';
import { TextBoxModule, UploaderModule } from '@syncfusion/ej2-angular-inputs';
import { FilmPostProductionDetailComponent } from './film-post-production-detail/film-post-production-detail.component';
import { GuardService } from 'src/app/core/services/guard.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FilmPostProgressComponent } from './film-post-production-detail/film-post-progress/film-post-progress.component';
import { TranslateModule } from '@ngx-translate/core';

export const routes: Routes = [
  { path: '', redirectTo: 'dung-hau-ky-phim', pathMatch: 'full' },
  {
    path: 'dung-hau-ky-phim',
    data: { breadcrumb: 'Dựng hậu kỳ phim', routeKey: 'dunghaukyphim' },
    canActivate: [GuardService],
    children: [
      {
        path: '',
        component: FilmPostProductionComponent,
        // data: { breadcrumb: "Đăng ký chủ đề"}
      },
      {
        path: 'add',
        component: FilmPostProductionDetailComponent,
        data: { breadcrumb: 'Thêm danh sách sản xuất hậu kỳ' },
      },
      {
        path: 'edit/:id',
        data: { breadcrumb: 'Chi tiết sản xuất hậu kỳ' },
        
        children: [
          {
            path: '',
            component: FilmPostProductionDetailComponent,
            data: { breadcrumb: 'Chi tiết sản xuất hậu kỳ' },
          },
          {
            path: 'add-progress',
            component: FilmPostProgressComponent,
            data: { breadcrumb: 'Tạo mới tiến độ' },
          },
          {
            path: 'edit-progress/:progressId',
            component: FilmPostProgressComponent,
            data: { breadcrumb: 'Tiến độ chi tiết' },
          },
        ],
      },
    ],
  },
];

@NgModule({
  declarations: [
    FilmPostProductionComponent,
    FilmPostProductionDetailComponent,
    FilmPostProgressComponent,
  ],
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
  
  providers: [PageService, SortService, FilterService, GroupService],
})
export class PostProductionModule {
  
}
