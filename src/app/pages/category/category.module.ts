import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListCommoncategoryComponent } from './list-commoncategory/list-commoncategory.component';
import { ListVTVComponent } from './list-vtv/list-vtv.component';
import { MovieComponent } from './movie/movie.component';
import { RoleComponent } from './role/role.component';
import { TopicComponent } from './topic/topic.component';
import { XaComponent } from './xa/xa.component';
import { KenhtruyenhinhComponent } from './kenhtruyenhinh/kenhtruyenhinh.component';
import { HuyenComponent } from './huyen/huyen.component';
import { DetaidangkyComponent } from './detaidangky/detaidangky.component';
import { ChiphiComponent } from './chiphi/chiphi.component';
import { DecuongComponent } from './decuong/decuong.component';
import { DepartmentComponent } from './department/department.component';
import {
  FilterService,
  GridAllModule,
  GroupService,
  PageService,
  SortService,
} from '@syncfusion/ej2-angular-grids';
import {
  DropDownListAllModule,
  MultiSelectAllModule,
} from '@syncfusion/ej2-angular-dropdowns';
import { FormsModule } from '@angular/forms';
import {
  UploaderModule,
  TextBoxAllModule,
} from '@syncfusion/ej2-angular-inputs';
import { RouterModule, Routes } from '@angular/router';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { SharedModule } from 'src/app/theme/components/shared.module';
import { PermissionsComponent } from './permissions/permissions.component';
import { TranslateModule } from '@ngx-translate/core';
import { GuardService } from 'src/app/core/services/guard.service';
import { UserManagerComponent } from './user-manager/user-manager.component';
import { UserDetailsComponent } from './user-details/user-details.component';
import { TeamDetailComponent } from './team-detail/team-detail.component';
import { TeamManageComponent } from './team-manage/team-manage.component';
import { DialogModule } from '@syncfusion/ej2-angular-popups';
import { DocumentComponent } from './document/document.component';
import { LogManagerComponent } from './log-manager/log-manager.component';
import { SystemConfigComponent } from './system-config/system-config.component';

export const routes: Routes = [
  { path: '', redirectTo: 'phong-ban', pathMatch: 'full' },
  {
    path: 'phong-ban',
    component: DepartmentComponent,
    data: { breadcrumb: 'Phòng Ban', routeKey: 'phongban' },
    canActivate: [GuardService],
  },
  {
    path: 'thanh-pho',
    component: ListCommoncategoryComponent,
    canActivate: [GuardService],
    data: { breadcrumb: 'Tỉnh/Thành Phố', routeKey: 'thanhpho' },
  },
  {
    path: 'dai-truyen-hinh',
    component: ListVTVComponent,
    canActivate: [GuardService],
    data: { breadcrumb: 'Đài Truyền Hình', routeKey: 'daitruyenhinh' },
  },
  {
    path: 'phim',
    component: MovieComponent,
    data: { breadcrumb: 'Phim', routeKey: 'phim' },
    canActivate: [GuardService],
  },
  {
    path: 'de-tai',
    component: TopicComponent,
    data: { breadcrumb: 'Đề tài', routeKey: 'detai' },
    canActivate: [GuardService],
  },
  {
    path: 'nhom-quyen',
    component: RoleComponent,
    data: { breadcrumb: 'Nhóm Quyền', routeKey: 'nhomquyen' },
    canActivate: [GuardService],
  },
  {
    path: 'quan-huyen',
    component: HuyenComponent,
    canActivate: [GuardService],
    data: { breadcrumb: 'Quận/Huyện', routeKey: 'quan-huyen' },
  },
  {
    path: 'xa-phuong',
    component: XaComponent,
    canActivate: [GuardService],
    data: { breadcrumb: 'Xã/Phường', routeKey: 'xa-phuong' },
  },
  {
    path: 'kenh-truyen-hinh',
    component: KenhtruyenhinhComponent,
    canActivate: [GuardService],
    data: { breadcrumb: 'Kênh Truyền Hình', routeKey: 'kenhtruyenhinh' },
  },
  {
    path: 'document',
    component: DocumentComponent,
    canActivate: [GuardService],
    data: { breadcrumb: 'Tài liệu', routeKey: 'document' },
  },
  {
    path: 'de-cuong',
    component: DecuongComponent,
    canActivate: [GuardService],
    data: { breadcrumb: 'Đề Cương', routeKey: 'decuong' },
  },
  {
    path: 'chi-phi',
    component: ChiphiComponent,
    canActivate: [GuardService],
    data: { breadcrumb: 'Chi Phí', routeKey: 'chiphi' },
  },
  {
    path: 'quyen',
    component: PermissionsComponent,
    canActivate: [GuardService],
    data: { breadcrumb: 'Quyền', routeKey: 'quyen' },
  },
  {
    path: 'quan-ly-nguoi-dung',
    canActivate: [GuardService],
    children: [
      {
        path: '',
        component: UserManagerComponent,
        data: { breadcrumb: 'Quản Lý Người Dùng' },
      },
      {
        path: 'add',
        component: UserDetailsComponent,
        data: { breadcrumb: 'Đăng Ký' },
      },
      {
        path: 'edit/:id',
        component: UserDetailsComponent,
        data: { breadcrumb: 'Chỉnh sửa thông tin' },
      },
    ],
    data: { breadcrumb: 'Quản Lý Người Dùng', routeKey: '' },
  },
  {
    path: 'quan-ly-to-doi',
    canActivate: [GuardService],
    children: [
      {
        path: '',
        component: TeamManageComponent,
        data: { breadcrumb: 'Quản Lý Tổ Đội' },
      },
      {
        path: 'add',
        component: TeamDetailComponent,
        data: { breadcrumb: 'Thêm Tổ Đội' },
      },
      {
        path: 'edit/:id',
        component: TeamDetailComponent,
        data: { breadcrumb: 'Chỉnh Sửa Thông Tin Tổ Đội' },
      },
    ],
    data: { breadcrumb: 'Quản Lý Tổ Đội', routeKey: '' },
  },
  {
    path: 'quan-ly-log',
    component: LogManagerComponent,
    canActivate: [GuardService],
  },
  {
    path: 'cau-hinh-he-thong',
    component: SystemConfigComponent,
    canActivate: [GuardService],
  },
];
@NgModule({
  declarations: [
    ListCommoncategoryComponent,
    ListVTVComponent,
    MovieComponent,
    RoleComponent,
    TopicComponent,
    XaComponent,
    KenhtruyenhinhComponent,
    HuyenComponent,
    DetaidangkyComponent,
    DepartmentComponent,
    DecuongComponent,
    ChiphiComponent,
    PermissionsComponent,
    UserDetailsComponent,
    UserManagerComponent,
    TeamManageComponent,
    TeamDetailComponent,
    DocumentComponent,
    LogManagerComponent,
    SystemConfigComponent,
  ],

  imports: [
    CommonModule,
    GridAllModule,
    DropDownListAllModule,
    FormsModule,
    DialogModule,
    MultiSelectAllModule,
    ScrollingModule,
    SharedModule,
    TranslateModule,
    TextBoxAllModule,
    UploaderModule,
    RouterModule.forChild(routes),
  ],
  providers: [PageService, SortService, FilterService, GroupService],
})
export class CategoryModule {}
