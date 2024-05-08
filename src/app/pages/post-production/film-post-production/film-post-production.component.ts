import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmitType } from '@syncfusion/ej2-base';
import {
  EditSettingsModel,
  PageSettingsModel,
  SaveEventArgs,
  ToolbarItems,
  FilterSettingsModel,
  GridComponent,
} from '@syncfusion/ej2-angular-grids';
import {
  PostproductionPlaning,
  User,
} from 'src/app/core/models/database/db.model';
import { PostProPlanService } from 'src/app/core/services/post-pro-plan.service';
import { RolePermissionService } from 'src/app/core/services/role-permission.service';
import { L10n } from '@syncfusion/ej2-base';
import {
  AppRoles,
  NotifyActionType,
  NotifyObjectType,
  PlanStatus,
  RequestTypeAction,
  TopicStatus,
} from 'src/app/core/utils/constant';
import { PrePlanService } from 'src/app/core/services/pre-plan.service';
import { PostProductProgressService } from 'src/app/core/services/post-product-progress.service';
import { ToastrService } from 'ngx-toastr';
import { MaskedDateTimeService } from '@syncfusion/ej2-angular-calendars';
import { UserLogged } from 'src/app/core/utils/userLogged';

import { UserService } from 'src/app/core/services/user.service';
import { NotifyService } from 'src/app/core/services/notify.service';
import { UserRoleService } from 'src/app/core/services/user-role.service';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';
L10n.load({
  'en-US': {
    grid: {
      FilterButton: 'Lọc',
      ClearButton: 'Xóa',
      EnterValue: 'Nhập giá trị',
      ChooseDate: 'Chọn ngày',
    },
    datepicker: { day: 'Ngày', month: 'Tháng', year: 'Năm' },
  },
});
@Component({
  selector: 'app-film-post-production',
  templateUrl: './film-post-production.component.html',
  styleUrls: ['./film-post-production.component.scss'],
  providers: [MaskedDateTimeService],
})
export class FilmPostProductionComponent implements OnInit {
  @ViewChild('grid') public grid: GridComponent;
  public listPostProduction: PostproductionPlaning;
  public PostProductionDetail: PostproductionPlaning;
  public fields: Object = { text: 'text', value: 'value' };
  public editSettings: EditSettingsModel = {
    allowAdding: false,
    allowDeleting: false,
    allowEditing: false,
  };
  public targetElement: HTMLElement;
  public hideDialog: EmitType<object> = () => {
    this.dialog.hide();
  };

  public initilaizeTarget: EmitType<object> = () => {
    this.targetElement = this.container.nativeElement.parentElement;
  };
  @ViewChild('ejDialog') public dialog: DialogComponent;
  // Create element reference for dialog target element.
  @ViewChild('container', { read: ElementRef, static: true }) container:
    | ElementRef
    | any;
  public query: any;
  public checkRole = false;
  public userLogged = new UserLogged();
  public pageSettings: PageSettingsModel;
  public toolbarOptions: ToolbarItems[];
  public listDelete: Array<any> = [];
  public enableMaskSupport: boolean = true;
  public filterSettings?: Object;
  public listUser: User[];
  public listUserRole: Array<any> = [];
  public listStatus: any[] = [
    { text: 'Tất cả', value: 10 },
    { text: 'Chưa duyệt', value: PlanStatus.NOTPROCESS },
    { text: 'Đã duyệt', value: PlanStatus.APPROVE },
    { text: 'Đã đóng', value: PlanStatus.APPROVEPREPRODUCTION },
    { text: 'Từ chối đóng', value: PlanStatus.APPROVEPREPRODUCTIONREJECT },
    { text: 'Từ chối', value: PlanStatus.REJECT },
    { text: 'Chờ duyệt đóng', value: PlanStatus.WAITAPPROVE },
  ];
  public filterOptions: FilterSettingsModel = {
    ignoreAccent: false,
    showFilterBarStatus: false,
  };
  private detailUser: User = new User();

  constructor(
    public service: PostProPlanService,
    public readonly router: Router,
    private readonly route: ActivatedRoute,
    private postProgess: PostProductProgressService,
    private servicePlan: PrePlanService,
    private userService: UserService,
    private notifyService: NotifyService,
    private serviceUserRole: UserRoleService,
    public toastService: ToastrService,
    public roleRightService: RolePermissionService
  ) {
    if (this.roleRightService.hasRole([AppRoles.DIRECTOR])) {
      this.checkRole = false;
      this.toolbarOptions = ['Add', 'Edit', 'Delete'];
      this.editSettings = {
        allowEditing: true,
        allowAdding: true,
        allowDeleting: true,
      };
    } else if (this.roleRightService.hasRole([AppRoles.LEADER])) {
      this.checkRole = true;
      this.editSettings = {
        allowEditing: true,
        allowAdding: false,
        allowDeleting: false,
      };
    }
  }

  ngOnInit(): void {
    this.loadPostPlan();
    this.pageSettings = { pageSize: 10 };
  }
  onChange(args: any): void {
    if (args.value == 10) {
      this.grid.clearFiltering();
    } else this.grid.filterByColumn('Status', 'equal', args.value);
  }
  onChange1(args: any): void {
    this.grid.filterByColumn('ToDate', 'equal', args.value);
  }
  onChange0(args: any): void {
    this.grid.filterByColumn('FromDate', 'equal', args.value);
  }
  onChangeFilm(args: any): void {
    console.log(this.grid.columns);
    this.grid.filterByColumn('PreProduction.Name', 'contains', args.value);
  }
  onChangeTitle(args: any): void {
    this.grid.filterByColumn('WorkContent', 'contains', args.value);
  }
  onChangeBudget(args: any): void {
    this.grid.filterByColumn('Budget', 'contains', args.value);
  }

  loadPostPlan() {
    this.serviceUserRole.getAllRole().subscribe((data: any) => {
      this.listUserRole = data.value;
    });
    this.userService
      .getUserByIds(this.userLogged.getCurrentUser().userId)
      .subscribe((res) => {
        this.detailUser = res.value[0];
      });
    this.userService
      .getListUserByQuery(
        '$Select=Id, FirstName, LastName, UserName, Email, Tel&$Filter=Status eq 1'
      )
      .subscribe((data) => {
        this.listUser = data.value;
      });
    if (this.roleRightService.hasRole([AppRoles.LEADER])) {
      this.service.getAllPostPlan().subscribe((res) => {
        this.listPostProduction = res.value;
      });
    }
    if (this.roleRightService.hasRole([AppRoles.DIRECTOR])) {
      this.service
        .getAllPostPlanByIdUser(this.userLogged.getCurrentUser().userId)
        .subscribe((res) => {
          this.listPostProduction = res.value;
        });
    }
    if (this.roleRightService.hasRole([AppRoles.DIRECTOR])) {
      this.service
        .getAllPostPlanByIdUser(this.userLogged.getCurrentUser().userId)
        .subscribe((res) => {
          this.listPostProduction = res.value;
        });
      console.log(this.listPostProduction);
    }
  }
  renderStatus(data: PostproductionPlaning) {
    const status = data.Status;
    switch (status) {
      case PlanStatus.APPROVEPREPRODUCTIONREJECT:
        return 'Từ chối đóng ';
      case PlanStatus.APPROVEPREPRODUCTION:
        return 'Đã đóng';
      case PlanStatus.WAITAPPROVE:
        return 'Chờ duyệt đóng';
      case PlanStatus.APPROVE:
        return 'Đã duyệt';
      case PlanStatus.INPROCRESS:
        return 'Chờ duyệt';
      case PlanStatus.REJECT:
        return 'Từ chối';
      case PlanStatus.NOTPROCESS:
        return 'Chưa duyệt';
      default:
        return '';
    }
  }
  actionBegin(args: SaveEventArgs) {
    if (args.requestType === RequestTypeAction.BEGINEDIT) {
      const Id = (args.rowData as any).Id;
      this.router.navigate(['./edit', Id], {
        relativeTo: this.route,
      });
    }
    if (args.requestType === RequestTypeAction.ADD) {
      this.router.navigate(['./add'], {
        relativeTo: this.route,
      });
    }
    //   if (args.requestType === 'delete') {
    //     const deletedTeam = (args.data as any)[0];
    //     const x = (args.data as any)[0].Id;
    //     const isConfirmed = confirm(`Bạn có muốn xóa hậu kỳ phim này không?`);
    //     if (isConfirmed) {
    //       if ((args.data as any)[0].Status >=3  || (args.data as any)[0].Status == -5) {
    //         args.cancel = true;
    //         this.toastService.error(
    //           'Xóa thất bại, hậu kỳ phim này đang đợi Hội đồng duyệt!',
    //           'Thất bại'
    //         );
    //       } else if (
    //         deletedTeam.Status == PlanStatus.NOTPROCESS ||
    //         deletedTeam.Status == PlanStatus.REJECT ||
    //         deletedTeam.Status == PlanStatus.INPROCRESS
    //       ) {
    //         {
    //           this.service.DeletePostPlan(x).subscribe(() => {
    //             this.toastService.success('Xóa hậu kỳ thành công', 'Thành công');
    //             for (let index = 0; index < this.listUserRole.length; index++) {
    //               const element = this.listUserRole[index].UserId;
    //               const Title = `Kế hoạch sản xuất hậu kỳ đã bị xóa`;
    //               const Detail = `Đạo diễn <strong>${this.handleRenderMember(
    //                 deletedTeam.PreProduction.CreatedBy
    //               )}</strong> đã xóa kế hoạch sản xuất hậu kỳ cho phim <strong>${
    //                 deletedTeam.PreProduction.Name
    //               }</strong>. Vui lòng xem xét lại hoặc liên hệ để biết thêm thông tin.`;

    //               this.notifyService
    //                 .CreateNotify(
    //                   element,
    //                   NotifyActionType.DELETE,
    //                   NotifyObjectType.POSTPLANPROD,
    //                   deletedTeam.Id,
    //                   Title,
    //                   Detail
    //                 )
    //                 .subscribe((data) => {})
    //             }
    //           },(err) => {
    //             this.toastService.error(
    //               'Xóa thất bại, hậu kỳ phim này đang đợi Hội đồng duyệt!',
    //               'Thất bại'
    //             );
    //           });
    //         }
    //       }
    //     }
    //     if (isConfirmed == false) {
    //       args.cancel = true;
    //     }
    //   }
    // }
    if (args.requestType === 'delete') {
      const dataRow = (args.data as PostproductionPlaning[])[0];
      args.cancel = true;
      this.dialog.show();
      this.dialog.header = 'Xác nhận xóa quyền';
      this.dialog.content = 'Bạn có chắc chắn muốn tiếp tục không?';
      this.dialog.animationSettings = {
        effect: 'Fade',
        duration: 100,
        delay: 0,
      };
      this.dialog.buttons = [
        {
          click: this.onConfirmDelete.bind(this, dataRow),
          buttonModel: { content: 'OK', isPrimary: true },
        },
        {
          click: this.hideDialog.bind(this),
          buttonModel: { content: 'Hủy' },
        },
      ];
    }
  }
  onConfirmDelete(dataRow: any) {
    this.dialog.hide();
    if (dataRow.Status >= 3 || dataRow.Status == -5) {
      this.toastService.error(
        'Xóa thất bại, hậu kỳ phim này đang đợi Hội đồng duyệt!',
        'Thất bại'
      );
    } else if (
      dataRow.Status == PlanStatus.NOTPROCESS ||
      dataRow.Status == PlanStatus.REJECT ||
      dataRow.Status == PlanStatus.INPROCRESS
    ) {
      
        this.service.DeletePostPlan(dataRow.Id).subscribe(
          () => {
            this.toastService.success('Xóa hậu kỳ thành công', 'Thành công');
            for (let index = 0; index < this.listUserRole.length; index++) {
              const element = this.listUserRole[index].UserId;
              const Title = `Kế hoạch sản xuất hậu kỳ đã bị xóa`;
              const Detail = `Đạo diễn <strong>${this.handleRenderMember(
                dataRow.PreProduction.CreatedBy
              )}</strong> đã xóa kế hoạch sản xuất hậu kỳ cho phim <strong>${
                dataRow.PreProduction.Name
              }</strong>. Vui lòng xem xét lại hoặc liên hệ để biết thêm thông tin.`;

              this.notifyService
                .CreateNotify(
                  element,
                  NotifyActionType.DELETE,
                  NotifyObjectType.POSTPLANPROD,
                  dataRow.Id,
                  Title,
                  Detail
                )
                .subscribe((data) => {});
            }
          },
          (err) => {
            this.toastService.error(
              'Xóa thất bại, hậu kỳ phim này đang đợi Hội đồng duyệt!',
              'Thất bại'
            );
          }
        );
      
      () => {
        this.grid.dataSource = this.listPostProduction;
        this.toastService.warning('Có lỗi xảy ra...');
      };
    }
  }
  handleRenderMember(MemberId: number) {
    let userName: any = '';
    if (MemberId) {
      const user = this.listUser.find((item) => item.Id === MemberId);
      userName = `${user?.FirstName} ${user?.LastName}`;
    }
    return userName;
  }
}
