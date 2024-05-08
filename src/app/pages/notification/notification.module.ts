import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationComponent } from './notification.component';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NgScrollbarModule } from 'ngx-scrollbar';

export const routes: Routes = [
  {
    path: '',
    data: { breadcrumb: 'ADMIN_NAV.NOTIFICATION' },
    children: [
      {
        path: '',
        component: NotificationComponent,
        data: { breadcrumb: 'ADMIN_NAV.NOTIFICATION' },
      },
    ],
  },
];
@NgModule({
  declarations: [NotificationComponent],
  imports: [
    CommonModule,
    NgScrollbarModule,
    TranslateModule.forChild(),
    RouterModule.forChild(routes),
  ],
})
export class NotificationModule {}
