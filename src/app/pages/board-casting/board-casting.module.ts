import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoardCastingComponent } from './board-casting/board-casting.component';
import { RouterModule, Routes } from '@angular/router';
import { Grid, GridAllModule } from '@syncfusion/ej2-angular-grids';
import { FormsModule } from '@angular/forms';
import { DatePickerAllModule, DateTimePicker, DateTimePickerModule } from '@syncfusion/ej2-angular-calendars';
import { TranslateModule } from '@ngx-translate/core';
import { DialogModule } from '@syncfusion/ej2-angular-popups';
import { DropDownListModule, MultiSelectAllModule } from '@syncfusion/ej2-angular-dropdowns';
import { ButtonModule } from '@syncfusion/ej2-angular-buttons';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from 'src/app/theme/components/shared.module';
import { TextBoxModule, UploaderModule } from '@syncfusion/ej2-angular-inputs';
import { BroadCastingDetailComponent } from './broad-casting-detail/broad-casting-detail.component';
import { TreeGrid, TreeGridAllModule, TreeGridModule } from '@syncfusion/ej2-angular-treegrid';
import { BroadcastingDocumentComponent } from './broad-casting-detail/broadcasting-document/broadcasting-document.component';

export const routes: Routes = [
  { path: '', redirectTo: 'danh-sach', pathMatch: 'full' },
  {
    path: 'danh-sach',
    // component: RegisterTopicComponent,
    data: { breadcrumb: 'Danh sách phim', routeKey: 'dangky' },
    children: [
      {
        path: '',
        component: BoardCastingComponent,
        data: { breadcrumb: 'Danh sách phim' },
      },
      {
        path: 'edit/:id',
        data: { breadcrumb: 'Đăng ký lịch phát sóng' },
        children: [
          {
            path: '',
            component: BroadCastingDetailComponent,
            data: { breadcrumb: 'Chi tiết tài liệu đính kèm' },
          },
          {
            path: 'add-document',
            component: BroadcastingDocumentComponent,
            data: { breadcrumb: 'Thêm mới tài liệu đính kèm' },
          },
          {
            path: 'edit-document/:documentId',
            component: BroadcastingDocumentComponent,
            data: { breadcrumb: 'Chi tiết tài liệu đính kèm' },
          },
        ]
      },
      {
        path: 'add',
        component: BroadCastingDetailComponent,
        data: { breadcrumb: 'Đăng ký lịch phát sóng' },
      },
    ]
  }
];

@NgModule({
  declarations: [
    BoardCastingComponent,
    BroadCastingDetailComponent,
    BroadcastingDocumentComponent
  ],
  imports: [
    CommonModule,
    GridAllModule,
    FormsModule,
   
    DatePickerAllModule,
    TranslateModule,
    DialogModule,
    TreeGridAllModule,
    MultiSelectAllModule,
    ButtonModule,
    NgbModule,
    TextBoxModule,
    UploaderModule,
    DateTimePickerModule,
    DropDownListModule,
    SharedModule,
    RouterModule.forChild(routes),
  ]
})
export class BoardCastingModule { }
