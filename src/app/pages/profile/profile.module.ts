import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProfileComponent } from './profile.component';
import { ProjectsComponent } from './projects/projects.component';
import { UserInfoComponent } from './user-info/user-info.component';
import { SharedModule } from 'src/app/theme/components/shared.module';
import { DropDownListModule, MultiSelectAllModule } from '@syncfusion/ej2-angular-dropdowns';
import { TextBoxAllModule } from '@syncfusion/ej2-angular-inputs';

export const routes: Routes = [
  {
    path: 'profile',
    component: UserInfoComponent,
    data: { breadcrumb: 'Thông tin chung' },
    children: [
      // { path: '', redirectTo: 'projects', pathMatch: 'full' },
      // {
      //   path: 'projects',
      //   component: ProjectsComponent,
      //   data: { breadcrumb: 'Projects' },
      // },
      {
        path: 'user-info',
        component: UserInfoComponent,
        data: { breadcrumb: 'Thông tin chi tiết' },
      },
    ],
  },
];

@NgModule({
  declarations: [ProfileComponent, ProjectsComponent, UserInfoComponent],
  imports: [CommonModule, ReactiveFormsModule,
    SharedModule,
    DropDownListModule,
    FormsModule,
    TextBoxAllModule,
    MultiSelectAllModule,
    RouterModule.forChild(routes)],
})
export class ProfileModule {}
