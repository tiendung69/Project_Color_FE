import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportComponent } from './report/report.component';
import { GridAllModule } from '@syncfusion/ej2-angular-grids';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { DatePickerAllModule, DateRangePickerAllModule } from '@syncfusion/ej2-angular-calendars';
import { DropDownListModule, MultiSelectAllModule } from '@syncfusion/ej2-angular-dropdowns';
import { ButtonModule } from '@syncfusion/ej2-angular-buttons';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TextBoxModule, UploaderModule } from '@syncfusion/ej2-angular-inputs';
import { SharedModule } from 'src/app/theme/components/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { GuardService } from 'src/app/core/services/guard.service';
import { ReportProgressComponent } from './report-progress/report-progress.component';
import { ReportSegmentComponent } from './report-segment/report-segment.component';
import { ReportCapacityComponent } from './report-capacity/report-capacity.component';
export const routes: Routes = [
  { path: '', redirectTo: '', pathMatch: 'full' },
  {
    path: '',
    data: { breadcrumb: 'Báo cáo', routeKey: 'baocaosanxuat' },
    canActivate: [GuardService],
    children: [
      {
        path: '',
        component: ReportComponent,
        // data: { breadcrumb: "Đăng ký chủ đề"}
      }
    ]
  },
  {
    path: 'bao-cao-tien-do',
    canActivate: [GuardService],
    data: { breadcrumb: 'Báo cáo tiến độ', routeKey: 'dangkydecuong' },
    children: [
      {
        path: '',
        component: ReportProgressComponent, 
        data: { breadcrumb: 'Báo cáo tiến độ' },
      },
    ]
  },
  {
    path: 'bao-cao-phan-doan',
    canActivate: [GuardService],
    data: { breadcrumb: 'Báo cáo phân đoạn', routeKey: 'baocaophandoan' },
    children: [
      {
        path: '',
        component: ReportSegmentComponent, 
        data: { breadcrumb: 'Báo cáo phân đoạn' },
      },
    ]
  },
  {
    path: 'bao-cao-dung-luong',
    canActivate: [GuardService],
    data: { breadcrumb: 'Báo cáo dung lượng', routeKey: 'baocaodungluong' },
    children: [
      {
        path: '',
        component: ReportCapacityComponent, 
        data: { breadcrumb: 'Báo cáo dung lượng' },
      },
    ]
  }
]


@NgModule({
  declarations: [
    ReportComponent,
    ReportProgressComponent,
    ReportSegmentComponent,
    ReportCapacityComponent
  ],
  imports: [
    CommonModule, 
    FormsModule,
    GridAllModule,
    ReactiveFormsModule,
    FormsModule,
    DatePickerAllModule,
    MultiSelectAllModule,
    ButtonModule,
    DateRangePickerAllModule,
    NgbModule,
    TextBoxModule,
    UploaderModule,
    DropDownListModule,
    SharedModule,
    RouterModule.forChild(routes),
  ]
})
export class ReportModule { }
