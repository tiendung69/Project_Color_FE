import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { PagesComponent } from './pages/pages.component';
import { BlankComponent } from './pages/blank/blank.component';
import { SearchComponent } from './pages/search/search.component';
import { NotFoundComponent } from './pages/errors/not-found/not-found.component';
import { AppSettings } from './app.settings';
import { ApiService } from './core/services/api.service';
import { CommoncategoryService } from './core/services/commoncategory.service';
import { ListVTVComponent } from './pages/category/list-vtv/list-vtv.component';
import { GuardService } from './core/services/guard.service';
import { AppRoles } from './core/utils/constant';

export const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./pages/dashboard/dashboard.module').then(
            (m) => m.DashboardModule
          ),
        data: { breadcrumb: 'Dashboard' },
      },
      {
        path: 'danh-muc',
        loadChildren: () =>
          import('./pages/category/category.module').then(
            (m) => m.CategoryModule
          ),
        data: {
          breadcrumb: 'Danh mục',
          // routeKey: 'danhmuc',
        //  roles: [AppRoles.ADMIN],
        },
     //   canActivate: [GuardService],
      },
      {
        path: 'quan-ly-tien-ky',
        loadChildren: () =>
          import('./pages/topic/topic.module').then((m) => m.TopicModule),
        data: {
          breadcrumb: 'Quản lý sản xuất tiền kỳ',
          // routeKey: 'quanlysanxuattienky',
     //     roles: [AppRoles.LEADER, AppRoles.DIRECTOR],
        },
      //  canActivate: [GuardService],
      },
      // {
      //   path: 'quan-ly-nguoi-dung',
      //   loadChildren: () =>
      //     import('./pages/users/usermanager.module').then(
      //       (m) => m.UsermanagerModule
      //     ),
      //   data: {
      //     breadcrumb: 'Quản lý người dùng',
      //     routeKey: 'quanlynguoidung',
      //   },
      //   canActivate: [GuardService],
      // },
      {
        path: 'quan-ly-san-xuat-hau-ky',
        loadChildren: () =>
          import('./pages/post-production/post-production.module').then(
            (m) => m.PostProductionModule
          ),
        data: {
          breadcrumb: 'Quản lý sản xuất hậu kỳ',
          // routeKey: 'quanlysanxuathauky',
       //   roles: [AppRoles.LEADER, AppRoles.DIRECTOR],
        },
      //  canActivate: [GuardService],
      },
      {
        path: 'duyet-phim',
        loadChildren: () =>
          import('./pages/movie-approval/movie-approval.module').then(
            (m) => m.MovieApprovalModule
          ),
        data: {
          breadcrumb: 'Duyệt phim',
       //   roles: [AppRoles.LEADER, AppRoles.DIRECTOR],
       //   canActivate: [GuardService],
        },
      },
      {
        path: 'lich-phat-song',
        loadChildren: () =>
          import('./pages/board-casting/board-casting.module').then(
            (m) => m.BoardCastingModule
          ),
        data: {
          breadcrumb: 'Lịch phát sóng',
          // routeKey: 'danhmuc',
        //  roles: [AppRoles.LEADER, AppRoles.DIRECTOR],
        },
      //  canActivate: [GuardService],
      },
      {
        path: 'search',
        loadChildren: () =>
          import('./pages/search/search.module').then((m) => m.SearchModule),
        data: { breadcrumb: 'Tìm kiếm' },
      //  canActivate: [GuardService],
      },

      // {
      //   path: 'quan-ly-to-doi',
      //   loadChildren: () =>
      //     import('./pages/team-manage/team-manage.module').then(
      //       (m) => m.TeamManageModule
      //     ),
      //   data: {
      //     breadcrumb: 'Quản Lý Tổ Đội',
      //     routeKey: 'quanlytodoi',
      //   },
      //   canActivate: [GuardService],
      // },
      {
        path: '',
        loadChildren: () =>
          import('./pages/profile/profile.module').then((m) => m.ProfileModule),
        data: { breadcrumb: 'Profile' },
      },
      {
        path: 'Elastic',
        loadChildren: () =>
          import('./pages/elastic-settings/elastic-settings.module').then(
            (m) => m.ElasticSettingsModule
          ),
        data: {
          breadcrumb: 'Cài đặt tìm kiếm toàn văn',
          // routeKey: 'danhmuc',
        //  roles: [AppRoles.LEADER, AppRoles.DIRECTOR],
        },
      //  canActivate: [GuardService],
      },
      {
        path: 'document',
        loadChildren: () =>
          import('./pages/document/document.module').then(
            (m) => m.DocumentModule
          ),
        data: {
          breadcrumb: 'Tài liệu',
          // routeKey: 'danhmuc',
          // roles: [AppRoles.LEADER, AppRoles.DIRECTOR],
        },
      //  canActivate: [GuardService],
      },
      {
        path: 'bao-cao',
        loadChildren: () =>
          import('./pages/report/report.module').then((m) => m.ReportModule),
        data: {
          breadcrumb: 'Báo cáo',
          // routeKey: 'danhmuc',
        //  roles: [AppRoles.REPORTER],
        },
      //  canActivate: [GuardService],
      },
      {
        path: 'notifications',
        loadChildren: () =>
          import('./pages/notification/notification.module').then(
            (m) => m.NotificationModule
          ),
        data: {
          breadcrumb: 'Thông báo',
          // routeKey: 'danhmuc',
        },
      //  canActivate: [GuardService],
      },
    ],
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./pages/login/login.module').then((m) => m.LoginModule),
  },
  {
    path: 'register',
    loadChildren: () =>
      import('./pages/register/register.module').then((m) => m.RegisterModule),
  },
  { path: '**', component: NotFoundComponent },
];
@NgModule({
  imports: [RouterModule.forRoot(routes, {})],
  exports: [RouterModule],
  providers: [ApiService],
})
export class AppRoutingModule {}
