import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmitType } from '@syncfusion/ej2-base';
import {
  Approved,
  Commoncategory,
  Estimate,
  PreproductionMember,
  PreproductionPlaning,
  PreproductionProgress,
  PreproductionSegment,
  PreproductionsegmentMember,
  Topic,
  User,
} from 'src/app/core/models/database/db.model';
import { Location } from '@angular/common';
import { PrePlanService } from 'src/app/core/services/pre-plan.service';
import { PreSegmentService } from 'src/app/core/services/pre-segment.service';
import { TopicService } from 'src/app/core/services/topic.service';
import { PreMemberService } from 'src/app/core/services/pre-member.service';
import {
  EditSettingsModel,
  GridComponent,
  PageSettingsModel,
  SaveEventArgs,
  ToolbarItems,
  beginEdit,
} from '@syncfusion/ej2-angular-grids';
import {
  NotifyActionType,
  AppRoles,
  ApprovedObjectType,
  ApprovedResultStatus,
  CommonCategoriesType,
  NotifyStatus,
  PlanStatus,
  RequestTypeAction,
  TopicStatus,
  NotifyObjectType,
} from 'src/app/core/utils/constant';
import { UserService } from 'src/app/core/services/user.service';
import { ApprovedService } from 'src/app/core/services/approve.service';
import { CommoncategoryService } from 'src/app/core/services/commoncategory.service';
import { PreSegmentMemberService } from 'src/app/core/services/pre-segment-member.service';
import { EstimateService } from 'src/app/core/services/estimate.service';
import { UserLogged } from 'src/app/core/utils/userLogged';
import { ToastrService } from 'ngx-toastr';
import { PreProgressService } from 'src/app/core/services/pre-progress.service';
import { RolePermissionService } from 'src/app/core/services/role-permission.service';
import { NotifyService } from 'src/app/core/services/notify.service';
import { UserRoleService } from 'src/app/core/services/user-role.service';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-plan-detail',
  templateUrl: './plan-detail.component.html',
  styleUrls: ['./plan-detail.component.scss'],
})
export class PlanDetailComponent implements OnInit {
  idPlan: any;
  public listTopic: Array<any> = [];
  public editSettings: EditSettingsModel;
  public userLogged = new UserLogged();
  public editSetting3: EditSettingsModel;
  public pageSettings: PageSettingsModel = { pageSize: 10 };
  public editSettings2: EditSettingsModel;
  messageProgess: boolean = false;
  public toolbarOptions: ToolbarItems[];
  public listMember: PreproductionMember = new PreproductionMember();
  public IdSegment: any;
  isCollapsed9 = true;
  isCollapsed8 = true;
  listSegmentMember: PreproductionsegmentMember;
  segment: any = [];
  planEdit: PreproductionPlaning;
  messageSegmentMember: boolean = false;
  isButtonDisabled = false;
  public estimateDetail: Estimate;
  public listEstimate: Estimate;
  public dropdownField: Object = { text: 'Name', value: 'Id' };
  public checkSegmentMember: boolean;
  listMembers: any[] = [];
  public addressDetail: Array<any> = [];
  message1: boolean = false;
  message2: boolean = false;
  public addressCommune: Array<any> = [];
  public addressDistrict: Array<any> = [];
  public addressDistrict1: Array<any> = [];
  public member: any;
  listUser: Array<any> = [];
  public checkTable: boolean = false;
  editMode: boolean;
  public status = {
    APPROVE: ApprovedResultStatus.APPROVED,
    REJECT: ApprovedResultStatus.REJECT,
  };
  public listPlan: PreproductionPlaning;

  public listRole: any[] = [
    { Name: 'Đạo diễn', Id: 'Đạo diễn' },
    { Name: 'Phụ trách quay phim', Id: 'Phụ trách quay phim' },
    { Name: 'Phụ trách sản xuất', Id: 'Phụ trách sản xuất' },
    { Name: 'Phụ trách nghệ thuật', Id: 'Phụ trách nghệ thuật' },
    { Name: 'Phụ trách nội dung', Id: 'Phụ trách nội dung' },
  ];
  public fields = { text: 'Name', value: 'Id' };
  public aprovedTimes: number;
  public enableForm: boolean = false;
  public enableApprove: boolean = false;
  public aprovedTimes1: number;
  public messageName: boolean = false;
  isPheduyetClicked: boolean = false;
  public targetElement: HTMLElement;
  public hideDialog: EmitType<object> = () => {
    //this.dialog.hide();
    this.dialogMember.hide();
    this.dialogEstimate.hide();
    this.dialogSegment.hide();
    this.dialogProgress.hide();
  };
  
  public initilaizeTarget: EmitType<object> = () => {
    this.targetElement = this.container.nativeElement.parentElement;
  };
  @ViewChild('gridEstimate') gridEstimate: GridComponent;
  @ViewChild('gridMember') gridMember: GridComponent;
  @ViewChild('gridSegment') gridSegment: GridComponent;
  @ViewChild('gridProgress') gridProgress: GridComponent;
  @ViewChild('ejDialog') public dialog: DialogComponent;
  @ViewChild('ejDialogEstimate') public dialogEstimate: DialogComponent;
  @ViewChild('ejDialogMember') public dialogMember: DialogComponent;
  @ViewChild('ejDialogSegment') public dialogSegment: DialogComponent;
  @ViewChild('ejDialogProgress') public dialogProgress: DialogComponent;
  // Create element reference for dialog target element.
  @ViewChild('container', { read: ElementRef, static: true }) container:
    | ElementRef
    | any;
  @ViewChild('orderForm') public orderForm?: FormGroup;
  @ViewChild('gridDocuments') gridDocuments: GridComponent;
  public approvedDetail: Approved;
  listApproved: Approved[] = [];
  listApprovedClose: Approved[] = [];
  public approvedClose: Approved;
  public segmentDetail: PreproductionSegment = new PreproductionSegment();
  isCommentVisible: boolean = false;
  selectedCommentIndex: number = -1;
  isCommentVisible1: boolean = false;
  selectedCommentIndex1: number = -1;
  public segmentMemberDetail: PreproductionsegmentMember;
  public dropdownUser: Object = { text: 'FirstName', value: 'Id' };
  public dropdownList: Object = { text: 'Name', value: 'Id' };
  public listSegment: PreproductionSegment;
  public dropdownProgress: Object = { text: 'Scenario', value: 'Id' };
  check: boolean = false;
  isCollapsed10 = true;
  isCollapsed = true;
  isCollapsed1 = true;
  listData: Array<any> = [];
  isCollapsed4 = false;
  isCollapsed3 = true;
  isCollapsed2 = true;
  isCollapsed6 = true;
  isCollapsed5 = true;
  isCollapsed7 = true;
  showProgress = true;
  isCollapsed11 = true;
  isCollapsed12 = true;
  listProgress: PreproductionProgress;
  progressDetail: PreproductionProgress;
  messageEstimate: boolean = false;
  public isEditMode: boolean = false;
  public isAddMode: boolean = false;
  checkClose: boolean;
  checks1: boolean = false;
  public editSettings3: Object;
  public memberDetail: Array<any> = [];
  public checkStatus = false;
  public messageSegment: boolean = false;
  public planDetail = new PreproductionPlaning();
  checkApproved = false;
  listCate: Commoncategory;
query : any;
  private detailUser: User = new User();
  public listRoleUser: Array<any> = [];
  public listSegementDropdown: Array<any> = [];
  canGoBack: boolean;
  @ViewChild('nestedGrid', { static: false }) nestedGrid: GridComponent;
  ngOnInit(): void {
    this.loadAddress();
    this.approvedClose = new Approved();
    this.listSegment = new PreproductionSegment();
    this.planEdit = new PreproductionPlaning();
    this.segmentMemberDetail = new PreproductionsegmentMember();
    this.loadItem();
    this.estimateDetail = new Estimate();
    this.progressDetail = new PreproductionProgress();
    this.refreshSegmentMember();
    this.loadEstimated();
    this.editMode = false;
    this.loadPlan();
    this.loadUser();

    this.canGoBack = !!this.router.getCurrentNavigation()?.previousNavigation;
    if (this.roleRightService.hasRole([AppRoles.DIRECTOR])) {
      this.toolbarOptions = ['Add', 'Edit', 'Delete'];
      this.enableForm = true;
      this.editSettings = {
        allowEditing: true,
        allowAdding: true,
        allowDeleting: true,
        mode: 'Dialog',
      };
      this.editSettings2 = {
        allowAdding: true,
        allowDeleting: true,
        allowEditing: true,
        template: false,
      };
      this.editSettings3 = {
        allowAdding: true,
        allowDeleting: true,
        allowEditing: true,
      };
    } else if (this.roleRightService.hasRole([AppRoles.LEADER])) {
      this.enableApprove = true;
      this.editSettings = {
        allowEditing: true,
        allowAdding: false,
        allowDeleting: false,
        mode: 'Dialog',
      };
      this.editSettings2 = {
        allowAdding: false,
        allowDeleting: false,
        allowEditing: true,
        template: false,
      };
      this.editSettings3 = {
        allowAdding: false,
        allowDeleting: false,
        allowEditing: true,
      };
    }
  }
  constructor(
    public route: ActivatedRoute,
    private readonly router: Router,
    public serviceEstimate: EstimateService,
    private readonly toastService: ToastrService,
    public serviceApproved: ApprovedService,
    private readonly cdr: ChangeDetectorRef,
    public service: PrePlanService,
    private readonly notifyService: NotifyService,
    public serviceSegment: PreSegmentService,
    public serviceTopic: TopicService,
    public roleUserService: UserRoleService,
    public serviceProgress: PreProgressService,
    public serviceMember: PreMemberService,
    public serviceUser: UserService,
    public serviceAddress: CommoncategoryService,
    public serviceSegmentMember: PreSegmentMemberService,
    public roleRightService: RolePermissionService
  ) {this.idPlan = this.route.snapshot.paramMap.get('id');}

  toggleCommentVisibility(index: number) {
    this.isCommentVisible = !this.isCommentVisible;
    this.selectedCommentIndex = this.isCommentVisible ? index : -1;
  }
  toggleCommentVisibility1(index: number) {
    this.isCommentVisible1 = !this.isCommentVisible1;
    this.selectedCommentIndex1 = this.isCommentVisible1 ? index : -1;
  }
  loadPlan() {
    this.serviceUser
      .getUserByIds(this.userLogged.getCurrentUser().userId)
      .subscribe((data: any) => {
        this.detailUser = data.value[0];
      });
    this.showProgress = true;
    this.roleUserService.getAllRole().subscribe((data: any) => {
      this.listRoleUser = data.value;
    });
    this.serviceAddress
      .getCateByType(CommonCategoriesType.FILM)
      .subscribe((data: any) => {
        this.listCate = data.value;
      });
    if (this.idPlan) {
      this.service.getPlanById(this.idPlan).subscribe((data: any) => {
        this.checkClose = true;
        this.planDetail = data.value[0];
        if (this.planDetail.Status == PlanStatus.APPROVEPREPRODUCTION) {
          this.checkClose = false;
          this.editSettings2 = {
            allowAdding: false,
            allowDeleting: false,
            allowEditing: false,
            mode: 'Dialog',
          };
          this.editSettings3 = {
            allowAdding: false,
            allowDeleting: false,
            allowEditing: true,
          };
        }
        if (
          this.planDetail.Status === PlanStatus.APPROVEPREPRODUCTION ||
          this.planDetail.Status === PlanStatus.APPROVEPREPRODUCTIONREJECT ||
          this.planDetail.Status === PlanStatus.WAITAPPROVE
        ) {
          this.checkApproved = true;
        }
        if (
          this.planDetail.Status !== 2 ||
          this.planDetail.Status !== undefined ||
          this.planDetail.Status !== 0
        ) {
          this.editSettings = {
            allowAdding: false,
            allowDeleting: false,
            allowEditing: false,
            mode: 'Dialog',
          };
          this.editSettings3 = {
            allowAdding: false,
            allowDeleting: false,
            allowEditing: true,
          };
        }
        if (
          !this.idPlan ||
          this.planDetail.Status === undefined ||
          this.planDetail.Status === PlanStatus.REJECT ||
          this.planDetail.Status === PlanStatus.NOTPROCESS || this.planDetail.Status === PlanStatus.INPROCRESS
        ) {
          this.checkStatus = true;
          this.showProgress = false;
          this.editSettings = {
            allowDeleting: true,
            allowAdding: true,
            allowEditing: true,
            mode: 'Dialog',
          };
          this.editSettings3 = {
            allowDeleting: true,
            allowAdding: true,
            allowEditing: true,
          };
          if (this.planDetail.Status != PlanStatus.REJECT) {
            this.check = true;
          } else {
            this.check = false;
          }
        }
        if (this.planDetail.Status !== PlanStatus.NOTPROCESS) {
          this.serviceApproved
            .getListApprovedByQuery(
              `$Filter=ObjectId eq ${this.idPlan} and ObjectType eq 2`
            )
            .subscribe((data) => {
              this.listApproved = data.value;
              this.aprovedTimes = data.value.length;
              const sortedList = data.value.sort((a: Approved, b: Approved) => {
                // @ts-ignore
                return new Date(b.ProcessedAt) - new Date(a.ProcessedAt);
              });
              this.cdr.detectChanges();
              this.approvedDetail = sortedList[0];

              if (this.approvedDetail.Result != 1) {
                this.check = true;
              } else {
                this.check = false;
              }

              this.serviceApproved
                .getListApprovedByQuery(
                  `$Filter=ObjectId eq ${this.idPlan} and ObjectType eq 4`
                )
                .subscribe((data) => {
                  this.listApprovedClose = data.value;
                  this.aprovedTimes1 = data.value.length;
                  const sortedList = data.value.sort(
                    (a: Approved, b: Approved) => {
                      // @ts-ignore
                      return new Date(b.ProcessedAt) - new Date(a.ProcessedAt);
                    }
                  );
                  this.cdr.detectChanges();
                  this.approvedClose = sortedList[0];
                });
            });
        }
      });

      this.serviceMember
        .getPreMemberbyId(this.idPlan)
        .subscribe((data: any) => {
          this.memberDetail = data.value;
        });
      this.serviceSegment
        .getAddSegmentbyIdPlan(this.idPlan)
        .subscribe((data: any) => {
          this.listSegment = data.value;
          this.IdSegment = this.listSegment.Id;
          this.listSegementDropdown = data.value;
          this.serviceProgress
            .getAllPreProgressByIdPlan(this.idPlan)
            .subscribe((data) => {
              for (
                let index = 0;
                index < this.listSegementDropdown.length;
                index++
              ) {
                const element = this.listSegementDropdown[index].Id;
                let foundMatch = false;
                for (let j = 0; index < data.value.length; index++) {
                  const element1 = data.value[index].SegmentId;
                  if (element === element1) {
                    foundMatch = true;
                    this.listSegementDropdown.splice(index, 1);
                    index--;
                    break;
                  }
                }
                if (!foundMatch) {
                  const data = this.listSegementDropdown.filter(
                    (item) => item.Id == element
                  );
                }
              }
              this.cdr.detectChanges;
            });
        });
      this.serviceProgress
        .getAllPreProgressByIdPlan(this.idPlan)
        .subscribe((data) => {
          this.listProgress = data.value;
        });
      this.editMode = true;
    } else {
      this.editMode = false;
    }
  }
  onChangeFilm(args: any) {
    this.planDetail.CategoryId = args.value;
  }
  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
  }
  toggleCollapse1() {
    this.isCollapsed1 = !this.isCollapsed1;
  }
  toggleCollapse2() {
    this.isCollapsed2 = !this.isCollapsed2;
  }
  toggleCollapse3() {
    this.isCollapsed3 = !this.isCollapsed3;
  }
  toggleCollapse4() {
    this.isCollapsed4 = !this.isCollapsed4;
  }
  toggleCollapse5() {
    this.isCollapsed5 = !this.isCollapsed5;
  }
  toggleCollapse6() {
    this.isCollapsed6 = !this.isCollapsed6;
  }
  toggleCollapse7() {
    this.isCollapsed7 = !this.isCollapsed7;
  }
  toggleCollapse8() {
    this.isCollapsed8 = !this.isCollapsed8;
  }
  toggleCollapse9() {
    this.isCollapsed9 = !this.isCollapsed9;
  }
  toggleCollapse10() {
    this.isCollapsed10 = !this.isCollapsed10;
  }
  toggleCollapse11() {
    this.isCollapsed11 = !this.isCollapsed11;
  }
  toggleCollapse12() {
    this.isCollapsed12 = !this.isCollapsed12;
  }
  loadItem() {
    if (this.roleRightService.hasRole([AppRoles.DIRECTOR])) {
      this.query = `and CreatedBy eq ${
        this.userLogged.getCurrentUser().userId
      }`;
    }
    if (
      this.roleRightService.hasRole([AppRoles.LEADER]) &&
      this.planDetail.CreatedBy != this.userLogged.getCurrentUser().userId
    ) {
      this.query = '';
    }

    this.serviceTopic
      .getTopicByQuery(`$Filter=Status eq 3 and Type eq 1 ${this.query}`)
      .subscribe((data: any) => {
        this.listTopic = data.value;
        this.service.getAllPlan().subscribe((parentData) => {
          for (let index = 0; index < this.listTopic.length; index++) {
            const element = this.listTopic[index].Id;
            let foundMatch = false;
            for (let j = 0; j < parentData.value.length; j++) {
              const element1 = parentData.value[j].TopicId;
              if (element === element1) {
                foundMatch = true;
                this.listTopic.splice(index, 1);
                index--;
                break;
              }
            }
            if (!foundMatch) {
              const data = this.listTopic.filter((item) => item.Id == element);
            }
          }
        });
      });
  }
  loadUser() {
    this.serviceUser.getAllUserCheckStatus().subscribe((data: any) => {
      this.listUser = data.value;
      this.cdr.markForCheck();
    });
  }
  handleRenderMember(MemberId: number) {
    let userName: any = '';
    if (MemberId) {
      const user = this.listUser.find((item) => item.Id === MemberId);
      userName = `${user?.FirstName} ${user?.LastName}`;
    }
    return userName;
  }
  onInputComment(value: any) {
    const key = value.key;
    const event = value.value;
    const data = { ...this.approvedDetail, [key]: event };
    this.approvedDetail = data;
  }
  onInputCommentClose(value: any) {
    const key = value.key;
    const event = value.value;
    const data = { ...this.approvedClose, [key]: event };
    this.approvedClose = data;
  }
  onSubmitApprove(result: ApprovedResultStatus) {
    if (this.idPlan) {
      console.log(this.planDetail.Name);
      let userLogged: UserLogged = new UserLogged();
      // @ts-ignore
      this.approvedDetail.Id = undefined;
      this.approvedDetail.ObjectId = this.idPlan as number;
      this.approvedDetail.ObjectType = ApprovedObjectType.PLANPREPROD;
      this.approvedDetail.Result = result;
      this.approvedDetail.ProcessedBy = userLogged.getCurrentUser().userId;
      this.approvedDetail.ProcessedAt = new Date();
      let Title = ``;
      let Detail = ``;
      if (result === ApprovedResultStatus.APPROVED) {
        this.planDetail.Status = PlanStatus.APPROVE;
        Title = `Kế hoạch sản xuất tiền kỳ đã được duyệt`;
        Detail = `Kế hoạch sản xuất tiền kỳ cho phim <strong>${
          this.planDetail.Name
        }</strong> của bạn đã được duyệt bởi <strong>${
          this.detailUser.FirstName + ' ' + this.detailUser.LastName
        }</strong>. Bạn có thể bắt đầu bước tiếp theo ngay bây giờ.`;
        this.editSettings = {
          allowDeleting: false,
          allowAdding: false,
          allowEditing: false,
          mode: 'Dialog',
        };
        this.editSettings3 = {
          allowDeleting: false,
          allowAdding: false,
          allowEditing: true,
        };
      }
      if (result === ApprovedResultStatus.REJECT) {
        this.planDetail.Status = PlanStatus.REJECT;
        Title = `Kế hoạch sản xuất tiền kỳ không được duyệt`;
        Detail = `Kế hoạch sản xuất tiền kỳ cho phim <strong>${this.planDetail.Name}</strong> của bạn đã không được duyệt lần này. Cần có một số điều chỉnh hoặc bổ sung để đảm bảo tính đầy đủ và phù hợp.`;
        this.editSettings = {
          allowDeleting: true,
          allowAdding: true,
          allowEditing: true,
          mode: 'Dialog',
        };
        this.editSettings3 = {
          allowDeleting: true,
          allowAdding: true,
          allowEditing: true,
          //mode: 'Dialog',
        };
      }
      this.planDetail.ApprovedMember = this.approvedDetail.ProcessedBy;
      this.service
        .UpdatePlan(this.planDetail, this.idPlan)
        .subscribe((data) => {
          this.serviceApproved
            .CreateApprove(this.approvedDetail)
            .subscribe((data) => {
              this.aprovedTimes = this.aprovedTimes + 1;
              this.toastService.success(`${this.handleRenderResult(result)}`);
              this.notifyService
                .CreateNotify(
                  this.planDetail.CreatedBy,
                  result === ApprovedResultStatus.APPROVED
                    ? NotifyActionType.APPROVE
                    : NotifyActionType.REJECT,
                  NotifyObjectType.PLANPREPROD,
                  this.idPlan,
                  Title,
                  Detail
                )
                .subscribe();
              this.loadPlan();
            });
        });
    }
  }
  onSubmitApproveClose(result: ApprovedResultStatus) {
    if (this.idPlan) {
      let detail = new Approved();
      let userLogged: UserLogged = new UserLogged();
      detail.ObjectId = this.idPlan as number;
      detail.ObjectType = ApprovedObjectType.ENDPREPRODUCT;
      detail.Result = result;
      detail.ProcessedBy = userLogged.getCurrentUser().userId;
      detail.ProcessedAt = new Date();
      detail.Comment = this.approvedClose.Comment;
      this.approvedClose = detail;
      let Title = ``;
      let Detail = ``;
      if (result === ApprovedResultStatus.APPROVED) {
        this.planDetail.Status = PlanStatus.APPROVEPREPRODUCTION;
        Title = `Yêu cầu đóng sản xuất tiền kỳ đã được duyệt`;
        Detail = `Yêu cầu đóng sản xuất tiền kỳ cho phim <strong>${
          this.planDetail.Name
        }</strong> của bạn đã được duyệt bởi <strong>${
          this.detailUser.FirstName + ' ' + this.detailUser.LastName
        }</strong>. Bạn có thể bắt đầu bước tiếp theo ngay bây giờ.`;
      }
      if (result === ApprovedResultStatus.REJECT) {
        this.planDetail.Status = PlanStatus.APPROVEPREPRODUCTIONREJECT;
        Title = `Yêu cầu đóng sản xuất tiền kỳ không được duyệt`;
        Detail = `Yêu cầu đóng sản xuất tiền kỳ cho phim <strong>${this.planDetail.Name}</strong> của bạn đã không được duyệt lần này. Cần có một số điều chỉnh hoặc bổ sung để đảm bảo tính đầy đủ và phù hợp.`;
      }

      this.planDetail.ApprovedMember = this.approvedDetail.ProcessedBy;
      this.service
        .UpdatePlan(this.planDetail, this.idPlan)
        .subscribe((data) => {
          this.serviceApproved
            .CreateApprove(this.approvedClose)
            .subscribe((data) => {
              this.aprovedTimes1 = this.aprovedTimes1 + 1;
              this.toastService.success(`${this.handleRenderResult(result)}`);
              this.notifyService
                .CreateNotify(
                  this.planDetail.CreatedBy,
                  result === ApprovedResultStatus.APPROVED
                    ? NotifyActionType.APPROVE
                    : NotifyActionType.REJECT,
                  NotifyObjectType.ENDPREPRODUCT,
                  this.idPlan,
                  Title,
                  Detail
                )
                .subscribe();
              this.loadPlan();
            });
        });
    }
  }

  onSubmitApprove2(result: ApprovedResultStatus) {}
  handleRenderDate(date: Date) {
    const timeString = date.toTimeString().slice(0, 5);
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric' as const,
    };
    const dateFormatter = new Intl.DateTimeFormat('en-US', options);
    const formattedDate = dateFormatter.format(date);

    const [month, day, year] = formattedDate.split('/');

    return `${day}/${month}/${year}  ${timeString}`;
  }
  handleRenderResult(result: number) {
    switch (result) {
      case ApprovedResultStatus.APPROVED:
        return 'Đã phê duyệt';
      case ApprovedResultStatus.REJECT:
        return 'Đã từ chối';
      default:
        return '';
    }
  }
  actionBeginMember(args: SaveEventArgs): void {
    if (args.action === RequestTypeAction.ADD) {
      if (this.idPlan) {
        if (this.listMember.MemberId == undefined) {
          if (args.requestType == 'save') {
            this.messageName = true;
            args.cancel = true;
          } else {
            args.cancel = false;
          }
        } else {
          this.messageName = false;
          this.listMember.PreProductionId = this.idPlan;
          this.serviceMember.CreatePreMember(this.listMember).subscribe(
            (res) => {
              this.loadPlan();
            },
            () => {
              (args as any).cancel = true;
            }
          );
        }
      }
    }
    if (args.action === RequestTypeAction.EDIT) {
      if (this.idPlan) {
        const x = (args.data as any).Id;
        this.serviceMember.UpdateMember(this.listMember, x).subscribe(() => {
          this.loadPlan();
        });
      }
    }
    if (args.requestType === 'delete') {
      const dataRow = (args.data as PreproductionMember[])[0];
      args.cancel = true;
      this.dialogMember.show();
      this.dialogMember.header = 'Xác nhận xóa thành viên';
      this.dialogMember.content = 'Bạn có chắc chắn muốn tiếp tục không?';
      this.dialogMember.animationSettings = {
        effect: 'Fade',
        duration: 100,
        delay: 0,
      };
      this.dialogMember.buttons = [
        {
          click: this.onConfirmDeleteMember.bind(this, dataRow),
          buttonModel: { content: 'OK', isPrimary: true },
        },
        {
          click: this.hideDialog.bind(this),
          buttonModel: { content: 'Hủy' },
        },
      ];
    }
  } 
  onConfirmDeleteMember(dataRow: any) {
    this.dialogMember.hide();
    
        this.serviceMember.DeleteMember(dataRow.Id).subscribe(
          (data) => {
            this.loadPlan();
            this.toastService.success('Xóa thành công!');
          },
          () => {
            this.gridMember.dataSource = this.listMember;
            this.toastService.warning('Có lỗi xảy ra...');
          }
        );
      }
  
  actionBeginSegment(args: SaveEventArgs): void {
    this.isAddMode = false;
    if (args.requestType === 'add') {
      this.isAddMode = false;
    }
    if (args.requestType === 'beginEdit') {
      this.isAddMode = true;
      this.cdr.detectChanges();
    }
    if (args.action === RequestTypeAction.ADD) {
      this.isAddMode = false;
      this.messageSegment = false;
      if (this.idPlan) {
        if (this.segmentDetail.Scenario == undefined) {
          if (args.requestType === 'cancel') {
            args.cancel = false;
          } else {
            args.cancel = true;
            this.messageSegment = true;
            args.cancel = true;
          }
        } else {
          this.messageSegment = false;
          this.segmentDetail.PreProductionId = this.idPlan;
          this.serviceSegment.CreateSeg(this.segmentDetail).subscribe(
            () => {
              this.loadPlan();
            },
            () => {
              this.segmentDetail = new PreproductionSegment();
              (args as any).cancel = true;
            }
          );
        }
      }
    }

    if (args.action === RequestTypeAction.EDIT) {
      if (this.idPlan) {
        this.checkSegmentMember = true;
        if (this.segmentDetail.Scenario == '') {
          if (args.requestType === 'cancel') {
            args.cancel = false;
          } else {
            args.cancel = true;
            this.messageSegment = true;
            args.cancel = true;
          }
        } else {
          this.messageSegment = false;
          const x = (args.data as any).Id;
          this.serviceSegment.UpdateSeg(this.segmentDetail, x).subscribe(() => {
            this.loadPlan();
          });
        }
      }
    }
    if (args.requestType === RequestTypeAction.DELETE) {
      const x = (args.data as any)[0].Id;
      this.serviceSegment.DeleteSeg(x).subscribe(
        () => {},
        (error) => {}
      );
    }
  }
  submitAndDisable() {
    if (this.idPlan) {
    } else {
      this.onSubmit();
      if (this.message1 == false && this.message2 == false) {
        this.isButtonDisabled = true;
      }
    }
  }
  onInputChange(value: any) {
    const key = value.key;
    const event = value.value;
    const data = { ...this.planDetail, [key]: event };
    this.planDetail = data;
  }
  onChangeNameFilm(value: any) {
    this.planDetail.Name = value.value;
  }
  onInputChange2(value: any) {
    const key = value.key;
    const event = value.value;
    const data = { ...this.planEdit, [key]: event };
    this.planEdit = data;
  }
  onSubmitEdit() {
    this.planEdit.Status = 4;
    this.service.UpdatePlan(this.planEdit, this.idPlan).subscribe(() => {
      this.toastService.success('Cập nhật thành công!', 'Thành công');
      if (
        this.planEdit.Status === PlanStatus.APPROVEPREPRODUCTION ||
        this.planEdit.Status === PlanStatus.APPROVEPREPRODUCTIONREJECT ||
        this.planEdit.Status === PlanStatus.WAITAPPROVE
      ) {
        this.checkApproved = true;
      }
      if (this.planDetail.Status === PlanStatus.WAITAPPROVE) {
        for (let index = 0; index < this.listRoleUser.length; index++) {
          const element = this.listRoleUser[index].UserId;
          const Title = `Yêu cầu đóng sản xuất tiền kỳ được sửa đổi`;
          const Detail = `Đạo diễn <strong>${this.handleRenderMember(
            this.planDetail.CreatedBy
          )}</strong> đã cập nhật yêu cầu đóng sản xuất tiền kỳ cho phim <strong>${
            this.planDetail.Name
          }</strong>. Vui lòng kiểm tra và duyệt lại
          `;

          this.notifyService
            .CreateNotify(
              element,
              NotifyActionType.EDIT,
              NotifyObjectType.ENDPREPRODUCT,
              this.idPlan,
              Title,
              Detail
            )
            .subscribe((data) => {});
        }
      } else {
        for (let index = 0; index < this.listRoleUser.length; index++) {
          const element = this.listRoleUser[index].UserId;
          const Title = `Yêu cầu đóng sản xuất tiền kỳ`;
          const Detail = `Đạo diễn <strong>${this.handleRenderMember(
            this.planDetail.CreatedBy
          )}</strong> đã gửi yêu cầu đóng sản xuất tiền kỳ cho phim <strong>${
            this.planDetail.Name
          }</strong>. Vui lòng kiểm tra và xử lý
          `;

          this.notifyService
            .CreateNotify(
              element,
              NotifyActionType.EDIT,
              NotifyObjectType.ENDPREPRODUCT,
              this.idPlan,
              Title,
              Detail
            )
            .subscribe((data) => {});
        }
      }
    });
  }
  onInputChangeSegmentMember(value: any) {
    const key = value.key;
    const event = value.value;
    const data = { ...this.segmentMemberDetail, [key]: event };
    this.segmentMemberDetail = data;
  }
  onInputChangeSegment(value: any) {
    const key = value.key;
    const event = value.value;
    const updatedSegmentDetail = { ...this.segmentDetail, [key]: event };
    this.segmentDetail = updatedSegmentDetail;
    if (key === 'Budget') {
      this.segmentDetail.Budget = parseFloat(event);
    }
    if (this.segmentDetail.Budget == undefined) {
      this.segmentDetail.Budget = 0;
    }
  }

  onInputChangeMem(value: any) {
    const key = value.key;
    const event = value.value;
    const data = { ...this.listMember, [key]: event };
    this.listMember = data;
  }
  onSubmit() {
    if (!this.idPlan) {
      if (this.planDetail.Name == undefined) {
        this.message1 = true;
      } else {
        this.message1 = false;
      }
      if (this.planDetail.TopicId == undefined) {
        this.message2 = true;
      } else {
        this.message2 = false;
      }
      if (
        this.planDetail.TopicId != undefined &&
        this.planDetail.Name != undefined
      ) {
        this.planDetail.Status = PlanStatus.NOTPROCESS;
        this.planDetail.CreatedBy = this.userLogged.getCurrentUser().userId;
        this.planDetail.CreatedAt = new Date();
        this.service.CreatePlan(this.planDetail).subscribe((res) => {
          // @ts-ignore
          this.idPlan = res.Id;
          this.editSettings = {
            allowDeleting: true,
            allowAdding: true,
            allowEditing: true,
            mode: 'Dialog',
          };
          this.editSettings3 = {
            allowDeleting: true,
            allowAdding: true,
            allowEditing: true,
            mode: 'Dialog',
          };
          this.listMember.PreProductionId = res.Id;

          for (let index = 0; index < this.listMembers.length; index++) {
            this.listMember.MemberId = this.listMembers[index].MemberId;
            this.listMember.Role = this.listMembers[index].Role;
            this.listMember.Description = this.listMembers[index].Description;

            this.serviceMember
              .CreatePreMember(this.listMember)
              .subscribe(() => {});
          }

          this.router.navigate(['../edit', this.idPlan], {
            relativeTo: this.route,
          });

          this.toastService.success('Đăng ký thành công!', 'Thành công');
          for (let index = 0; index < this.listRoleUser.length; index++) {
            const element = this.listRoleUser[index].UserId;
            const Title = `Kế hoạch sản xuất tiền kỳ cần duyệt`;
            const Detail = `Đạo diễn <strong>${this.handleRenderMember(
              res.CreatedBy
            )}</strong> đã gửi kế hoạch sản xuất tiền kỳ cho phim <strong>
            ${res.Name}</strong> cần bạn duyệt. Vui lòng kiểm tra và xử lý.`;

            this.notifyService
              .CreateNotify(
                element,
                NotifyActionType.ADD,
                NotifyObjectType.PLANPREPROD,
                res.Id,
                Title,
                Detail
              )
              .subscribe((data) => {});
          }
        });
      }
    }
    if (this.idPlan) {
      if (this.planDetail.Name == '') {
        this.message1 = true;
      } else {
        this.message1 = false;
      }
      if (this.planDetail.Name != '') {
        if (this.approvedDetail.Result == ApprovedResultStatus.REJECT) {
          this.planDetail.Status = PlanStatus.INPROCRESS;
          this.service
            .UpdatePlan(this.planDetail, this.idPlan)
            .subscribe(() => {
              this.toastService.success('Cập nhật thành công!', 'Thành công');
              for (let index = 0; index < this.listRoleUser.length; index++) {
                const element = this.listRoleUser[index].UserId;
                const Title = `Kế hoạch sản xuất tiền kỳ được cập nhật`;
                const Detail = `Đạo diễn <strong>${this.handleRenderMember(
                  this.planDetail.CreatedBy
                )}</strong> đã cập nhật thông tin kế hoạch sản xuất tiền kỳ cho phim <strong>
                ${
                  this.planDetail.Name
                }</strong>. Vui lòng kiểm tra và duyệt lại.`;

                this.notifyService
                  .CreateNotify(
                    element,
                    NotifyActionType.EDIT,
                    NotifyObjectType.PLANPREPROD,
                    this.planDetail.Id,
                    Title,
                    Detail
                  )
                  .subscribe((data) => {});
              }
            });
        }
        if (this.approvedDetail.Result != ApprovedResultStatus.REJECT) {
          this.service
            .UpdatePlan(this.planDetail, this.idPlan)
            .subscribe(() => {
              this.toastService.success('Cập nhật thành công!', 'Thành công');
              for (let index = 0; index < this.listRoleUser.length; index++) {
                const element = this.listRoleUser[index].UserId;
                const Title = `Kế hoạch sản xuất tiền kỳ được cập nhật`;
                const Detail = `Đạo diễn <strong>${this.handleRenderMember(
                  this.planDetail.CreatedBy
                )}</strong> đã cập nhật kế hoạch sản xuất tiền kỳ cho phim <strong>
                ${
                  this.planDetail.Name
                }</strong> cần bạn duyệt. Vui lòng kiểm tra và xử lý.`;

                this.notifyService
                  .CreateNotify(
                    element,
                    NotifyActionType.EDIT,
                    NotifyObjectType.PLANPREPROD,
                    this.planDetail.Id,
                    Title,
                    Detail
                  )
                  .subscribe((data) => {});
              }
            });
        }
      }
    }
  }
  onChange(event: any) {
    this.planDetail.TopicId = event.value;
    if (!this.idPlan) {
      this.serviceTopic
        .getTopicById(this.planDetail.TopicId)
        .subscribe((data: any) => {
          this.listData = data.value[0];
          this.planDetail.Scenario = data.value[0].Scenario;
          this.listMembers = [];
          for (
            let index = 0;
            index < data.value[0].TopicMembers.length;
            index++
          ) {
            const element = data.value[0].TopicMembers[index];
            const member = {
              Role: element.Role,
              MemberId: element.MemberId,
              Description: element.Description,
            };
            this.listMembers.push(member);
          }
        });
    }
  }

  onCancelClick() {
    if (this.canGoBack) {
      this.router.navigate(['quan-ly-tien-ky/san-xuat-tien-ky/']);
    } else {
      this.router.navigate(['../../'], { relativeTo: this.route });
    }
  }
  actionComplete(args: any) {
    if (
      (args as any).requestType === 'beginEdit' ||
      (args as any).requestType === 'add'
    ) {
      const dialog = (args as any).dialog;
      dialog.width = 500;
      dialog.header =
        (args as any).requestType === 'beginEdit'
          ? 'Chỉnh sửa'
          : 'Thêm thành viên';
    }
  }
  actionCompleteProgress(args: any) {
    if (args.requestType === 'beginEdit') {
      const Id = (args.rowData as any).Id;
      this.router.navigate(['./edit-progress', Id], {
        relativeTo: this.route,
      });
    }
    if (args.requestType === 'add') {
      this.router.navigate(['./add-progress'], {
        relativeTo: this.route,
      });
    }
  }
  actionCompleteSegmentMember(args: any) {
    if (
      (args as any).requestType === 'beginEdit' ||
      (args as any).requestType === 'add'
    ) {
      const dialog = (args as any).dialog;
      dialog.width = 500;
      dialog.header =
        (args as any).requestType === 'beginEdit'
          ? 'Chỉnh sửa'
          : 'Thêm thành viên';
    }
  }
  actionCompleteSegment(args: any) {
    if (args.requestType === 'beginEdit') {
      const Id = (args.rowData as any).Id;
      this.router.navigate(['./edit-segment', Id], {
        relativeTo: this.route,
      });
    }
    if (args.requestType === 'add') {
      this.router.navigate(['./add-segment'], {
        relativeTo: this.route,
      });
    }
   
  } 
  onActionBegin(args: SaveEventArgs){
    if (args.requestType === 'delete') {
      args.cancel = true;
      const dataRow = (args.data as PreproductionSegment[])[0];
      this.dialogSegment.show();
      this.dialogSegment.header = 'Xác nhận xóa phân đoạn';
      this.dialogSegment.content = 'Bạn có chắc chắn muốn tiếp tục không?';
      this.dialogSegment.animationSettings = {
        effect: 'Fade',
        duration: 100,
        delay: 0,
      };
      this.dialogSegment.buttons = [
        {
          click: this.onConfirmDeleteSegment.bind(this, dataRow),
          buttonModel: { content: 'OK', isPrimary: true },
        },
        {
         
          click: this.hideDialog.bind(this),
          buttonModel: { content: 'Hủy' },
        },
      ];
    }
  }
  onConfirmDeleteSegment(dataRow: any) {
    this.dialogSegment.hide();
   
    this.serviceSegmentMember
            .getSegmentMemberByPreSegmentId(dataRow.Id)
            .subscribe((data) => {
              for (let index = 0; index < data.value.length; index++) {
                const element = data.value[index];
                this.serviceSegmentMember
                  .DeleteSegmentMember(element.Id)
                  .subscribe(() => {
                    this.serviceSegment.DeleteSeg(dataRow.Id).subscribe(() => {
                      this.loadPlan();
                      this.toastService.success('Xóa thành công', 'Thành công');
                    }, () => {
                      this.gridMember.dataSource = this.listMember;
                      this.toastService.warning('Có lỗi xảy ra...');
                    });
                  });
              }
            });
          this.serviceSegment.DeleteSeg(dataRow.Id).subscribe(() => {
            this.loadPlan();
            this.toastService.success('Xóa thành công', 'Thành công');
          });
        }
  actionBeginProgress(args: SaveEventArgs) {
    this.messageProgess = false;
    if (args.action == RequestTypeAction.ADD) {
      if (this.progressDetail.SegmentId == undefined) {
        if (args.requestType == 'save') {
          args.cancel = true;
          this.messageProgess = true;
          args.cancel = true;
        } else {
          this.progressDetail = new PreproductionProgress();
          args.cancel = false;
        }
      } else {
        this.messageProgess = false;
        this.progressDetail.PreProductionId = this.idPlan;
        this.serviceProgress
          .CreateProgess(this.progressDetail)
          .subscribe(() => {
            this.loadPlan();
          });
      }
    }

    if (args.action == RequestTypeAction.EDIT) {
      const x = (args.data as any).Id;
      this.serviceProgress
        .UpdateProgess(this.progressDetail, x)
        .subscribe(() => {
          this.loadPlan();
        });
    }
    if (args.requestType === 'delete') {
      const dataRow = (args.data as PreproductionProgress[])[0];
      args.cancel = true;
      this.dialogProgress.show();
      this.dialogProgress.header = 'Xác nhận xóa Tiến độ';
      this.dialogProgress.content = 'Bạn có chắc chắn muốn tiếp tục không?';
      this.dialogProgress.animationSettings = {
        effect: 'Fade',
        duration: 100,
        delay: 0,
      };
      this.dialogProgress.buttons = [
        {
          click: this.onConfirmDeleteProgress.bind(this, dataRow),
          buttonModel: { content: 'OK', isPrimary: true },
        },
        {
          click: this.hideDialog.bind(this),
          buttonModel: { content: 'Hủy' },
        },
      ];
    }
  } 
  onConfirmDeleteProgress(dataRow: any) {
    this.dialogProgress.hide();
        this.serviceProgress.DeleteProgress(dataRow.Id).subscribe(
          (data) => {
            this.loadPlan();
            this.toastService.success('Xóa thành công!');
          },
          () => {
            this.gridEstimate.dataSource = this.listEstimate;
            this.toastService.warning('Có lỗi xảy ra...');
          }
        );
      }
  renderStatus(data: PreproductionProgress) {
    const status = data.Status;
    switch (status) {
      case TopicStatus.APPROVE:
        return 'Hoàn thành';
      case TopicStatus.INPROCRESS:
        return 'Đang tiến hành';
      case TopicStatus.NOTPROCESS:
        return 'Chưa tiến hành';
      default:
        return '';
    }
  }
  onChangeProgress(value: any) {
    const key = value.key;
    const event = value.value;
    const data = { ...this.progressDetail, [key]: event };
    this.progressDetail = data;
  }
  onChangeProgressExpense(value: any) {
    this.progressDetail.Expense = parseFloat(value);
  }
  onChangeProgressPercent(value: any) {
    if (
      this.progressDetail.SegmentProgress == null ||
      this.progressDetail.SegmentProgress == undefined
    ) {
      this.progressDetail.SegmentProgress = 0;
    } else {
      this.progressDetail.SegmentProgress = parseFloat(value);
    }
  }

  onChangeDistrict(event: any) {
    this.segmentDetail.DistrictId = event;
    this.loadAddressCommune(event);
  }
  onChangeProvince(event: any) {
    this.segmentDetail.ProvinceId = event;
    this.loadAddressDistrict(event);
  }
  onChangeCommune(event: any) {
    this.segmentDetail.CommuneId = event;
  }
  loadAddress() {
    this.serviceAddress
      .getCateByType(CommonCategoriesType.PROVINCE)
      .subscribe((data: any) => {
        this.addressDetail = data.value;
      });
  }
  loadAddressDistrict(Id?: any) {
    this.serviceAddress
      .getCateByType(CommonCategoriesType.DISTRICTS)
      .subscribe((data: any) => {
        this.addressDistrict = data.value.filter(
          (item: any) => item.Name !== undefined && item.ParentId == Id
        );
      });
  }
  loadAddressCommune(Id?: any) {
    this.serviceAddress
      .getCateByType(CommonCategoriesType.COMMUNE)
      .subscribe((data: any) => {
        this.addressCommune = data.value.filter(
          (item: any) => item.Name !== undefined && item.ParentId == Id
        );
      });
  }
  refreshSegmentMember() {
    if (this.idPlan) {
      this.serviceSegment.getbyIdPlan(this.idPlan).subscribe((data) => {
        if (data && data.value && data.value.length > 0 && data.value[0].Id) {
          const planId = data.value[0].Id;

          this.serviceSegmentMember
            .getSegmentMemberByPreSegmentId(planId)
            .subscribe((segmentData) => {
              if (segmentData && segmentData.value) {
                this.listSegmentMember = segmentData.value;
              } else {
              }
            });
        } else {
        }
      });
    }
  }
  onActionBeginSegmentMember(args: SaveEventArgs, Id: any) {
    if (args.action == RequestTypeAction.ADD) {
      if (this.segmentMemberDetail.UserId == undefined) {
        if (args.requestType == 'save') {
          this.messageSegmentMember = true;
          args.cancel = true;
        } else {
          args.cancel = false;
        }
      } else {
        this.cdr.markForCheck();
        this.messageSegmentMember = false;
        this.segmentMemberDetail.PreProductionSegmentId = Id;
        this.serviceSegmentMember
          .CreateSegmentMember(this.segmentMemberDetail)
          .subscribe(() => {
            this.refreshSegmentMember();
          });
      }
    }
    if (args.action == RequestTypeAction.EDIT) {
      const x = (args.data as any).Id;
      this.serviceSegmentMember
        .UpdateSegmentMember(this.segmentMemberDetail, x)
        .subscribe(() => {
          this.refreshSegmentMember();
        });
    }
    if (args.requestType == RequestTypeAction.DELETE) {
      const x = (args.data as any)[0].Id;
      this.serviceSegmentMember.DeleteSegmentMember(x).subscribe(() => {});
    }
  }
  loadEstimated() {
    this.serviceEstimate.getEstimateByPlan(this.idPlan).subscribe((data) => {
      this.listEstimate = data.value;
    });
  }
  actionBegin(args: SaveEventArgs) {
    if (args.action === RequestTypeAction.EDIT) {
      const x = (args.data as any).Id;

      if (this.estimateDetail.TaskName == undefined) {
        args.cancel = true;
        this.messageEstimate = true;
      } else {
        this.messageEstimate = false;
        this.serviceEstimate
          .UpdateEstimate(this.estimateDetail, x)
          .subscribe(() => {});
      }
      this.estimateDetail = new Estimate();
    }
    if (args.action === RequestTypeAction.ADD) {
      if (this.estimateDetail.TaskName == undefined) {
        if (args.requestType == 'save') {
          args.cancel = true;
          this.messageEstimate = true;
        } else {
          args.cancel = false;
        }
      } else {
        this.messageEstimate = false;
        this.estimateDetail.PreProductPlaningId = parseInt(
          this.idPlan as string
        );
        this.estimateDetail.CreatedBy = this.userLogged.getCurrentUser().userId;
        this.estimateDetail.CreatedAt = new Date();
        this.serviceEstimate
          .CreateEstimate(this.estimateDetail)
          .subscribe((data) => {
            this.loadEstimated();
          });
      }
      this.estimateDetail = new Estimate();
    }
    if (args.requestType === 'delete') {
      const dataRow = (args.data as Estimate[])[0];
      args.cancel = true;
      this.dialogEstimate.show();
      this.dialogEstimate.header = 'Xác nhận xóa Dự toán';
      this.dialogEstimate.content = 'Bạn có chắc chắn muốn tiếp tục không?';
      this.dialogEstimate.animationSettings = {
        effect: 'Fade',
        duration: 100,
        delay: 0,
      };
      this.dialogEstimate.buttons = [
        {
          click: this.onConfirmDeleteEstimate.bind(this, dataRow),
          buttonModel: { content: 'OK', isPrimary: true },
        },
        {
          click: this.hideDialog.bind(this),
          buttonModel: { content: 'Hủy' },
        },
      ];
    }
  } 
  onConfirmDeleteEstimate(dataRow: any) {
    this.dialogEstimate.hide();
        this.serviceEstimate.DeleteEstimate(dataRow.Id).subscribe(
          (data) => {
            this.loadEstimated();
            this.toastService.success('Xóa thành công!');
          },
          () => {
            this.gridEstimate.dataSource = this.listEstimate;
            this.toastService.warning('Có lỗi xảy ra...');
          }
        );
      }
  
  onInputChangeValue(value: any) {
    const key = value.key;
    const event = value.value;
    const data = { ...this.estimateDetail, [key]: event };
    this.estimateDetail = data;
  }
  onInputChangeNumber(value: any) {
    this.estimateDetail.TimeEstimate = parseFloat(value.value);
}

  onInputChangeNumber1(value: any) {
    this.estimateDetail.HumanResourceEstimate = parseFloat(value.value);
  }
  onInputChangeNumber2(value: any) {
    this.estimateDetail.OtherResourceEstimate = parseFloat(value.value);
  }
  actionCompleteEstimate(args: any) {
    if (
      (args as any).requestType === 'beginEdit' ||
      (args as any).requestType === 'add'
    ) {
      const dialog = (args as any).dialog;
      dialog.width = 500;
      dialog.header =
        (args as any).requestType === 'beginEdit'
          ? 'Chỉnh sửa'
          : 'Thêm dự toán';
    }
  }
}
