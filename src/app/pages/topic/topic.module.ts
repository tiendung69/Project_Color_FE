import { DatePickerAllModule } from '@syncfusion/ej2-angular-calendars';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterTopicComponent } from './register-topic/register-topic.component';
import { RouterModule, Routes } from '@angular/router';
import {
  DatePickerEditCell,
  FilterService,
  GridAllModule,
  GridModule,
  GroupService,
  PageService,
  SortService,
} from '@syncfusion/ej2-angular-grids';
import { FormsModule } from '@angular/forms';
import { TextBoxModule, UploaderModule } from '@syncfusion/ej2-angular-inputs';
import { TopicDetailComponent } from './topic-detail/topic-detail.component';
import { DialogModule } from '@syncfusion/ej2-angular-popups';
import { ButtonModule } from '@syncfusion/ej2-angular-buttons';
import {
  DropDownListModule,
  MultiSelectAllModule,
} from '@syncfusion/ej2-angular-dropdowns';
import { SharedModule } from 'src/app/theme/components/shared.module';
import { OutlineComponent } from './outline/outline.component';
import { OutlineDetailComponent } from './outline-detail/outline-detail.component';
import { PlanComponent } from './plan/plan.component';
import { PlanDetailComponent } from './plan-detail/plan-detail.component';
import { PreProductEndComponent } from './pre-product-end/pre-product-end.component';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { GuardService } from 'src/app/core/services/guard.service';
import { PlanProgressComponent } from './plan-detail/plan-progress/plan-progress.component';
import { PlanSegmentComponent } from './plan-detail/plan-segment/plan-segment.component';

export const routes: Routes = [
  { path: '', redirectTo: 'de-tai', pathMatch: 'full' },
  {
    path: 'de-tai',
    // component: RegisterTopicComponent,
    data: { breadcrumb: 'Danh sách đề tài', routeKey: 'dangkychude' },
    children: [
      {
        path: '',
        component: RegisterTopicComponent,
        data: { breadcrumb: 'Danh sách đề tài' },
      },
      {
        path: 'edit/:id',
        component: TopicDetailComponent,
        data: { breadcrumb: 'Chi tiết đề tài' },
      },
      {
        path: 'add',
        component: TopicDetailComponent,
        data: { breadcrumb: 'Đăng ký đề tài' },
      },
    ],
    // canActivate: [GuardService],
  },
  {
    path: 'de-cuong',
    canActivate: [GuardService],
    data: { breadcrumb: 'Danh sách đề cương', routeKey: 'dangkydecuong' },
    children: [
      {
        path: '',
        component: OutlineComponent,
        data: { breadcrumb: 'Danh sách đề cương' },
      },
      {
        path: 'edit/:id',
        component: OutlineDetailComponent,
        data: { breadcrumb: 'Chi tiết đề cương' },
      },
      {
        path: 'add',
        component: OutlineDetailComponent,
        data: { breadcrumb: 'Đăng ký đề cương' },
      },
    ],
  },
  {
    path: 'san-xuat-tien-ky',
    canActivate: [GuardService],
    data: { breadcrumb: 'Sản xuất tiền kỳ', routeKey: 'dangkykehoach' },
    children: [
      {
        path: '',
        component: PlanComponent,
        data: { breadcrumb: 'Sản xuất tiền kỳ' },
      },
      {
        path: 'add',
        component: PlanDetailComponent,
        data: { breadcrumb: 'Đăng ký sản xuất tiền kỳ' },
      },
      {
        path: 'edit/:id',
        data: { breadcrumb: 'Chi tiết sản xuất tiền kỳ' },
        children: [
          {
            path: '',
            component: PlanDetailComponent,
            data: { breadcrumb: 'Chi tiết sản xuất tiền kỳ' },
          },
          {
            path: 'add-progress',
            component: PlanProgressComponent,
            data: { breadcrumb: 'Tạo mới tiến độ phân đoạn' },
          },
          {
            path: 'edit-progress/:progressId',
            component: PlanProgressComponent,
            data: { breadcrumb: 'Phân đoạn tiến độ chi tiết' },
          },
          {
            path: 'add-segment',
            component: PlanSegmentComponent,
            data: { breadcrumb: 'Thêm mới phân đoạn' },
          },
          {
            path: 'edit-segment/:segmentId',
            component: PlanSegmentComponent,
            data: { breadcrumb: 'Phân đoạn chi tiết' },
          },
        ],
      },
    ],
  },
];
@NgModule({
  declarations: [
    RegisterTopicComponent,
    TopicDetailComponent,
    OutlineComponent,
    OutlineDetailComponent,
    PlanComponent,
    PlanDetailComponent,
    PreProductEndComponent,
    PlanProgressComponent,
    PlanSegmentComponent,
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
export class TopicModule {}
