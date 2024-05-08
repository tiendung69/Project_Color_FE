// import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { RouterModule, Routes } from '@angular/router';
// import { UserManagerComponent } from './user-manager/user-manager.component';
// import {
//   FilterService,
//   GridAllModule,
//   GroupService,
//   SortService,
// } from '@syncfusion/ej2-angular-grids';
// import {
//   DropDownListAllModule,
//   MultiSelectAllModule,
// } from '@syncfusion/ej2-angular-dropdowns';
// import { FormsModule } from '@angular/forms';
// import {
//   UploaderModule,
//   TextBoxAllModule,
// } from '@syncfusion/ej2-angular-inputs';
// import { UserService } from 'src/app/core/services/user.service';
// import { ApiService } from 'src/app/core/services/api.service';
// import { UserDetailsComponent } from './user-details/user-details.component';
// import { DialogModule } from '@syncfusion/ej2-angular-popups';
// import { CheckBoxAllModule } from '@syncfusion/ej2-angular-buttons';
// import { TextareaInputComponent } from 'src/app/theme/components/textarea-input/textarea-input.component';
// import { AppModule } from 'src/app/app.module';
// import { SharedModule } from 'src/app/theme/components/shared.module';
// import { TranslateModule } from '@ngx-translate/core';

// export const routes: Routes = [
//   {
//     path: '',
//     redirectTo: 'quan-ly-nguoi-dung',
//     pathMatch: 'full',
//   },
//   {
//     path: '',
//     component: UserManagerComponent,
//     data: { breadcrumb: 'Quản Lý Người Dùng' },
//   },
//   {
//     path: 'add',
//     component: UserDetailsComponent,
//     data: { breadcrumb: 'Đăng Ký' },
//   },
//   {
//     path: 'edit/:id',
//     component: UserDetailsComponent,
//     data: { breadcrumb: 'Chỉnh sửa thông tin' },
//   },
// ];

// @NgModule({
//   declarations: [
//     UserManagerComponent,
//     UserDetailsComponent,
//   ],
//   imports: [
//     CommonModule,
//     TranslateModule,
//     GridAllModule,
//     DropDownListAllModule,
//     FormsModule,
//     DialogModule,
//     CheckBoxAllModule,
//     TextBoxAllModule,
//     MultiSelectAllModule,
//     UploaderModule,
//     SharedModule,
//     RouterModule.forChild(routes),
//   ],
//   providers: [
//     SortService,
//     FilterService,
//     GroupService,
//     UserService,
//     ApiService,
//   ],
// })
// export class UsermanagerModule {}
