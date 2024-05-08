import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  EditSettingsModel,
  FilterSettingsModel,
  GridComponent,
  PageSettingsModel,
  SaveEventArgs,
  ToolbarItems,
} from '@syncfusion/ej2-angular-grids';
import { ToastrService } from 'ngx-toastr';
import {
  Notify,
  PreproductionPlaning,
  PreproductionProgress,
  User,
} from 'src/app/core/models/database/db.model';
import { EmitType } from '@syncfusion/ej2-base';
import { EstimateService } from 'src/app/core/services/estimate.service';
import { NotifyService } from 'src/app/core/services/notify.service';
import { PreMemberService } from 'src/app/core/services/pre-member.service';
import { PrePlanService } from 'src/app/core/services/pre-plan.service';
import { PreProgressService } from 'src/app/core/services/pre-progress.service';
import { PreSegmentMemberService } from 'src/app/core/services/pre-segment-member.service';
import { PreSegmentService } from 'src/app/core/services/pre-segment.service';
import { RolePermissionService } from 'src/app/core/services/role-permission.service';
import { TopicDocumentService } from 'src/app/core/services/topic-document.service';
import { TopicMemberService } from 'src/app/core/services/topic-member.service';
import { UserRoleService } from 'src/app/core/services/user-role.service';
import { UserService } from 'src/app/core/services/user.service';
import {
  AppRoles,
  NotifyActionType,
  NotifyObjectType,
  NotifyStatus,
  PlanStatus,
  RequestTypeAction,
  TopicStatus,
} from 'src/app/core/utils/constant';
import { UserLogged } from 'src/app/core/utils/userLogged';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';

@Component({
  selector: 'app-plan',
  templateUrl: './plan.component.html',
  styleUrls: ['./plan.component.scss'],
})
export class PlanComponent implements OnInit {
  listUser: User[] = [];
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
  listMember: Array<any> = [];
  @ViewChild('grid') grid: GridComponent;
  listSegment: Array<any> = [];
  listProgress: Array<any> = [];
  public listUserRole: Array<any> = [];
  listEstimate: Array<any> = [];
  public filterSettings?: Object;
  listProgressMember: Array<any> = [];
  nameDelete: any;
  public planDetail: PreproductionPlaning;
  public editSettings: EditSettingsModel = {
    allowAdding: true,
    allowDeleting: true,
    allowEditing: true,
  };
  public listStatus: any[] = [
    { text: 'Tất cả', value: 10 },
    { text: 'Chưa duyệt', value: PlanStatus.NOTPROCESS },
    { text: 'Đã duyệt', value: PlanStatus.APPROVE },
    { text: 'Đã đóng', value: PlanStatus.APPROVEPREPRODUCTION },
    { text: 'Từ chối đóng', value: PlanStatus.APPROVEPREPRODUCTIONREJECT },
    { text: 'Từ chối', value: PlanStatus.REJECT },
    { text: 'Chờ duyệt đóng', value: PlanStatus.WAITAPPROVE },
  ];
  public pageSettings: PageSettingsModel;
  public userLogged = new UserLogged();
  public toolbarOptions: ToolbarItems[];
  public fields: Object = { text: 'text', value: 'value' };
  public filterOptions: FilterSettingsModel = {
    ignoreAccent: true,
    showFilterBarStatus: false,
  };
  checkRole: boolean = false;
  ngOnInit(): void {
    this.planDetail = new PreproductionPlaning();
    this.loadPlan();
    this.pageSettings = { pageSize: 10 };
  }
  constructor(
    public service: PrePlanService,
    public toastService: ToastrService,
    public readonly router: Router,
    private readonly route: ActivatedRoute,
    public changeDetectorRef: ChangeDetectorRef,
    public serviceMem: PreMemberService,
    private serviceUserRole: UserRoleService,
    public serviceEstimate: EstimateService,
    private notifyService: NotifyService,
    private serviceUser: UserService,
    public serviceMemberSegment: PreSegmentMemberService,
    public serviceProgress: PreProgressService,
    public serviceSegment: PreSegmentService,
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

  loadPlan() {
    this.serviceUserRole.getAllRole().subscribe((data) => {
      this.listUserRole = data.value;
    });
    this.serviceUser.getAllUserCheckStatus().subscribe((data: any) => {
      this.listUser = data.value.filter(
        (item: any) => item.UserName !== undefined
      );
    });
    if (this.roleRightService.hasRole([AppRoles.LEADER])) {
      this.service.getAllPlan().subscribe((data) => {
        this.planDetail = data.value;
      });
    }
    if (this.roleRightService.hasRole([AppRoles.DIRECTOR]))
      this.service
        .getPlanByUser(this.userLogged.getCurrentUser().userId)
        .subscribe((data: any) => {
          this.planDetail = data.value;
        });
  }
  onChange1(args: any): void {
    this.grid.filterByColumn('Name', 'contains', args.value);
  }
  onChange2(args: any): void {
    this.grid.filterByColumn('Topic.Name', 'contains', args.value);
  }
  onChange3(args: any): void {
    this.grid.filterByColumn('Description', 'contains', args.value);
  }
  onChange4(args: any): void {
    if (args.value == 10) {
      this.grid.clearFiltering();
    } else this.grid.filterByColumn('Status', 'equal', args.value);
  }
  async actionComplete(args: SaveEventArgs) {
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
  //     const x = (args.data as any)[0].Id;
  //     const deletedTeam = (args.data as any)[0];
  //     this.nameDelete = deletedTeam.Name;
  //     const isConfirmed = confirm(
  //       `Bạn có muốn xóa kế hoạch ${this.nameDelete} không?`
  //     );
  //     if (isConfirmed) {
  //       try {
  //         const preMemberResponse = await this.serviceMem.getPreMemberbyId(x).toPromise();
  //         if (preMemberResponse && preMemberResponse.value && preMemberResponse.value.length > 0) {
  //           this.listMember = preMemberResponse.value;
  //           for (let index = 0; index < this.listMember.length; index++) {
  //             const element = this.listMember[index].Id;
  //             await this.serviceMem.DeleteMember(element).toPromise();
  //           }
  //         }

  //         const addSegmentResponse = await this.serviceSegment.getAddSegmentbyIdPlan(x).toPromise();
  //         if (addSegmentResponse && addSegmentResponse.value && addSegmentResponse.value.length > 0) {
  //           this.listSegment = addSegmentResponse.value;
  //           for (let index = 0; index < this.listSegment.length; index++) {
  //             const element = this.listSegment[index].Id;
  //             const segmentMemberResponse = await this.serviceMemberSegment.getSegmentMemberByPreSegmentId(element).toPromise();
  //             if (segmentMemberResponse && segmentMemberResponse.value && segmentMemberResponse.value.length > 0) {
  //               this.listProgressMember = segmentMemberResponse.value;
  //               for (let index = 0; index < this.listProgressMember.length; index++) {
  //                 const element = this.listProgressMember[index].Id;
  //                 await this.serviceMemberSegment.DeleteSegmentMember(element).toPromise();
  //               }
  //             }
  //             await this.serviceSegment.DeleteSeg(element).toPromise();
  //           }
  //         }

  //         const preProgressResponse = await this.serviceProgress.getAllPreProgressByIdPlan(x).toPromise();
  //         if (preProgressResponse && preProgressResponse.value && preProgressResponse.value.length > 0) {
  //           this.listProgress = preProgressResponse.value;
  //           for (let index = 0; index < this.listProgress.length; index++) {
  //             const element = this.listProgress[index].Id;
  //             await this.serviceProgress.DeleteProgress(element).toPromise();
  //           }
  //         }

  //         const estimateResponse = await this.serviceEstimate.getEstimateByPlan(x).toPromise();
  //         if (estimateResponse && estimateResponse.value && estimateResponse.value.length > 0) {
  //           this.listEstimate = estimateResponse.value;
  //           for (let index = 0; index < this.listEstimate.length; index++) {
  //             const element = this.listEstimate[index].Id;
  //             await this.serviceEstimate.DeleteEstimate(element).toPromise();
  //           }
  //         }

  //         await this.service.DeletePlan(x).toPromise();
  //         this.toastService.success('Xóa thành công!', 'Thành công');

  //         const loggser = new UserLogged();
  //         for (let index = 0; index < this.listUserRole.length; index++) {
  //           const element = this.listUserRole[index].UserId;
  //           const Title = `Kế hoạch sản xuất tiền kỳ đã bị xóa`;
  //           const Detail = `Đạo diễn <strong>${this.handleRenderMember(
  //             deletedTeam.CreatedBy
  //           )}</strong> đã xóa kế hoạch sản xuất tiền kỳ cho phim <strong>${
  //             deletedTeam.Name
  //           }</strong>. Vui lòng xem xét lại hoặc liên hệ để biết thêm thông tin.`;

  //           await this.notifyService.CreateNotify(
  //             element,
  //             NotifyActionType.DELETE,
  //             NotifyObjectType.PLANPREPROD,
  //             deletedTeam.Id,
  //             Title,
  //             Detail
  //           ).toPromise();
  //         }
  //       } catch (error) {
  //         args.cancel = true;
  //         this.loadPlan();
  //         this.toastService.error(
  //           'Xóa thất bại, kế hoạch đã được duyệt!',
  //           'Thất bại'
  //         );
  //       }
  //     } else {
  //       args.cancel = true;
  //     }
  //   }

  // }
  if (args.requestType === 'delete') {
    const dataRow = (args.data as PreproductionPlaning[])[0];
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
  async onConfirmDelete(dataRow: any) {
  this.dialog.hide();
  if(dataRow.Status == PlanStatus.REJECT || dataRow.Status == PlanStatus.INPROCRESS || dataRow.Status == PlanStatus.NOTPROCESS) {
  try {
          const preMemberResponse = await this.serviceMem.getPreMemberbyId(dataRow.Id).toPromise();
          if (preMemberResponse && preMemberResponse.value && preMemberResponse.value.length > 0) {
            this.listMember = preMemberResponse.value;
            for (let index = 0; index < this.listMember.length; index++) {
              const element = this.listMember[index].Id;
              await this.serviceMem.DeleteMember(element).toPromise();
            }
          }
          const addSegmentResponse = await this.serviceSegment.getAddSegmentbyIdPlan(dataRow.Id).toPromise();
          if (addSegmentResponse && addSegmentResponse.value && addSegmentResponse.value.length > 0) {
            this.listSegment = addSegmentResponse.value;
            for (let index = 0; index < this.listSegment.length; index++) {
              const element = this.listSegment[index].Id;
              const segmentMemberResponse = await this.serviceMemberSegment.getSegmentMemberByPreSegmentId(element).toPromise();
              if (segmentMemberResponse && segmentMemberResponse.value && segmentMemberResponse.value.length > 0) {
                this.listProgressMember = segmentMemberResponse.value;
                for (let index = 0; index < this.listProgressMember.length; index++) {
                  const element = this.listProgressMember[index].Id;
                  await this.serviceMemberSegment.DeleteSegmentMember(element).toPromise();
                }
              }
              await this.serviceSegment.DeleteSeg(element).toPromise();
            }
          }

          const preProgressResponse = await this.serviceProgress.getAllPreProgressByIdPlan(dataRow.Id).toPromise();
          if (preProgressResponse && preProgressResponse.value && preProgressResponse.value.length > 0) {
            this.listProgress = preProgressResponse.value;
            for (let index = 0; index < this.listProgress.length; index++) {
              const element = this.listProgress[index].Id;
              await this.serviceProgress.DeleteProgress(element).toPromise();
            }
          }

          const estimateResponse = await this.serviceEstimate.getEstimateByPlan(dataRow.Id).toPromise();
          if (estimateResponse && estimateResponse.value && estimateResponse.value.length > 0) {
            this.listEstimate = estimateResponse.value;
            for (let index = 0; index < this.listEstimate.length; index++) {
              const element = this.listEstimate[index].Id;
              await this.serviceEstimate.DeleteEstimate(element).toPromise();
            }
          }

          await this.service.DeletePlan(dataRow.Id).toPromise();
          this.toastService.success('Xóa thành công!', 'Thành công');
          this.loadPlan();
          const loggser = new UserLogged();
          for (let index = 0; index < this.listUserRole.length; index++) {
            const element = this.listUserRole[index].UserId;
            const Title = `Kế hoạch sản xuất tiền kỳ đã bị xóa`;
            const Detail = `Đạo diễn <strong>${this.handleRenderMember(
              dataRow.CreatedBy
            )}</strong> đã xóa kế hoạch sản xuất tiền kỳ cho phim <strong>${
              dataRow.Name
            }</strong>. Vui lòng xem xét lại hoặc liên hệ để biết thêm thông tin.`;

            await this.notifyService.CreateNotify(
              element,
              NotifyActionType.DELETE,
              NotifyObjectType.PLANPREPROD,
              dataRow.Id,
              Title,
              Detail
            ).toPromise();
          }

        }catch (error) {
          this.loadPlan();
          this.toastService.error(
            'Xóa thất bại, kế hoạch đã được duyệt!',
            'Thất bại'
          );
        }
      }
    else{
      this.toastService.error(
        'Xóa thất bại, kế hoạch đã được duyệt!',
        'Thất bại'
      );
    }
    () => {
      this.grid.dataSource = this.planDetail;
      this.toastService.warning('Có lỗi xảy ra...');
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
  renderStatus(data: PreproductionPlaning) {
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
}
