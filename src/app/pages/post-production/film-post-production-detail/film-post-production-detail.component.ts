import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Approved,
  Notify,
  PostproductionPlaning,
  PostproductionProgress,
  PreproductionPlaning,
  User,
  Video,
} from 'src/app/core/models/database/db.model';
import { PostProPlanService } from 'src/app/core/services/post-pro-plan.service';
import { EmitType } from '@syncfusion/ej2-base';
import { PrePlanService } from 'src/app/core/services/pre-plan.service';
import { L10n } from '@syncfusion/ej2-base';
import {
  AppRoles,
  ApprovedObjectType,
  ApprovedResultStatus,
  CommonCategoriesType,
  DBType,
  NotifyActionType,
  NotifyObjectType,
  NotifyStatus,
  PlanStatus,
  RequestTypeAction,
  TopicStatus,
  VideoType,
} from 'src/app/core/utils/constant';
import { ApprovedService } from 'src/app/core/services/approve.service';
import { UserLogged } from 'src/app/core/utils/userLogged';
import { UserService } from 'src/app/core/services/user.service';
import { ToastrService } from 'ngx-toastr';
import { PostProductProgressService } from 'src/app/core/services/post-product-progress.service';
import {
  CommandModel,
  EditSettingsModel,
  GridComponent,
  PageSettingsModel,
  SaveEventArgs,
  ToolbarItems,
} from '@syncfusion/ej2-angular-grids';
import { RolePermissionService } from 'src/app/core/services/role-permission.service';
import { MovieApprovalService } from 'src/app/core/services/movie-approval.service';
import { VideoService } from 'src/app/core/services/video.service';
import { SpinnerService } from 'src/app/theme/components/spinner/spinner.service';
import { environment } from 'src/environments/environment';
import { UploadService } from 'src/app/core/services/file-upload.service';
import { UserRoleService } from 'src/app/core/services/user-role.service';
import { NotifyService } from 'src/app/core/services/notify.service';
import { CommoncategoryService } from 'src/app/core/services/commoncategory.service';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';
import { FormGroup } from '@angular/forms';
L10n.load({
  'en-US': {
    grid: {
      SaveButton: 'Lưu',
      CancelButton: 'Hủy',
      Edit: 'Sửa',
      Add: 'Thêm',
      Delete: 'Xóa',
      EditOperationAlert: 'Hãy chọn một mục để sửa.',
      DeleteOperationAlert: 'Hãy chọn một mục để xóa',
      EmptyRecord: 'Không có dữ để hiển thị.',
      requiredMessage: 'Vui lòng nhập giá trị.',
    },
    dropdowns: {
      noRecordsTemplate: 'Không có dữ liệu.',
    },
    listbox: {
      noRecordsTemplate: 'Your Custom Text', // provide your own text here
    },
  },
});
@Component({
  selector: 'app-film-post-production-detail',
  templateUrl: './film-post-production-detail.component.html',
  styleUrls: ['./film-post-production-detail.component.scss'],
})
export class FilmPostProductionDetailComponent implements OnInit {
  public listPostProduction: PostproductionPlaning;
  public listApproved: Approved[];
  public count =0;
  isCommentVisible: boolean = false;
  selectedCommentIndex: number = -1;
  isCommentVisible1: boolean = false;
  selectedCommentIndex1: number = -1;
  query: any;
  private userLogged = new UserLogged();
  public listValue: Array<any> = [];
  public listProduct: Array<any> = [];
  public listPostProgress: PostproductionProgress;
  public postProgressDetail: PostproductionProgress;
  public PostProductionDetail: PostproductionPlaning;
  public videoDetail: Video = new Video();
  public idPostPlan: any;
  public editMode: boolean;
  public listStatus: any[] = [
    { Name: 'Chưa hoàn thành', Id: false },
    { Name: 'Hoàn thành', Id: true },
  ];
  isCollasped = false;
  public listVideoOrigin: Video[] = [];
  isCollasped2 = true;
  isCollasped5 = true;
  isCollasped3 = true;
  isCollasped4 = true;
  public fileUpload: any = undefined;
  messageFile = false;
  public enableForm: boolean = false;
  public enableApprove: boolean = false;
  closeRejectApproved = false;

  public status = {
    APPROVE: ApprovedResultStatus.APPROVED,
    REJECT: ApprovedResultStatus.REJECT,
  };
  @ViewChild('gridVideo') public gridVideo: GridComponent;
  @ViewChild('gridProgress') public gridProgress: GridComponent;
  public approvedDetail = new Approved();
  public approvedClose = new Approved();
  public aprovedTimes: number;
  private readonly canGoBack: boolean;
  public aprovedTimes1: number;
  listUser: Array<any> = [];
  showApprove = false;
  isCollasped6 = true;
  isCollasped7 = true;
  public fieldDropdown: Object ;
  public listRoleUser: Array<any> = [];
  public editSettings: EditSettingsModel;
  public editSettings2: EditSettingsModel;
  public toolbarOptions: ToolbarItems[];
  public listVideo: Video[] = [];
  public pageSettings: PageSettingsModel;
  messagePlan: boolean = false;
  public film: Video;
  public listPlan: Array<any> = [];
  public dropdownList: Object;
  public checks: boolean = false;
  listApprovedClose: Approved[];
  public file: any = undefined;
  checkApproved = false;
  public listCate: Array<any> = [];
  private detailUser: User = new User();
  public idUpload: any;
  public uploadPartId: any;
  public dropEle?: HTMLElement;
  public open: boolean = false;
  public commands: CommandModel[];
  public targetElement: HTMLElement;
  public hideDialog: EmitType<object> = () => {
    this.dialog.hide();
    this.dialogVideo.hide();
    this.dialogProgress.hide();
  };

  public initilaizeTarget: EmitType<object> = () => {
    this.targetElement = this.container.nativeElement.parentElement;
  };
  private oReq = new XMLHttpRequest();
  public percentComplete : number;
  @ViewChild('ejDialog') public dialog: DialogComponent;
  // Create element reference for dialog target element.
  @ViewChild('container', { read: ElementRef, static: true }) container:
    | ElementRef
    | any;

  @ViewChild('orderForm') public orderForm?: FormGroup;
  @ViewChild('ejDialogVideo')dialogVideo: DialogComponent;
  @ViewChild('ejDialogProgress') dialogProgress: DialogComponent;
  ngOnInit(): void {
    this.commands = [
      {
        buttonOption: {
          content: 'Nén file',
          
        },
      },
    ];
    this.listPostProduction = new PostproductionPlaning();
    this.loadPlan();
    this.idPostPlan = this.route.snapshot.paramMap.get('id');
    this.loadPostPlanDetail();
    this.editMode = false;
    this.loadUser();
    this.listApproved = new Array<Approved>();
    this.listApprovedClose = new Array<Approved>();
    this.PostProductionDetail = new PostproductionPlaning();
    this.dropdownList = { text: 'Name', value: 'Id' };
    this.fieldDropdown = { text: 'Name', value: 'Id' };
  }

  constructor(
    public service: PostProPlanService,
    private fileUploadService: UploadService,
    public servicePlan: PrePlanService,
    private readonly toastService: ToastrService,
    public serviceApproved: ApprovedService,
    public readonly router: Router,
    private readonly roleUserService: UserRoleService,
    private readonly spinnerService: SpinnerService,
    public videoService: VideoService,
    private readonly notifyService: NotifyService,
    public serviceUser: UserService,
    private readonly cdr: ChangeDetectorRef,
    private readonly route: ActivatedRoute,
    private serviceApproval: MovieApprovalService,
    private readonly serviceCate: CommoncategoryService,
    public roleRightService: RolePermissionService,
    private serviceProgress: PostProductProgressService
  ) {
    {
      this.canGoBack = !!this.router.getCurrentNavigation()?.previousNavigation;
      if (this.roleRightService.hasRole([AppRoles.DIRECTOR])) {
        this.enableForm = true;
        this.toolbarOptions = ['Add', 'Edit', 'Delete'];
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
        };
      }
    }
  }
  toggleCommentVisibility(index: number) {
    this.isCommentVisible = !this.isCommentVisible;
    this.selectedCommentIndex = this.isCommentVisible ? index : -1;
  }
  toggleCommentVisibility1(index: number) {
    this.isCommentVisible1 = !this.isCommentVisible1;
    this.selectedCommentIndex1 = this.isCommentVisible1 ? index : -1;
  }

  loadPostPlanDetail() {
    this.serviceUser
      .getUserByIds(this.userLogged.getCurrentUser().userId)
      .subscribe((res) => {
        this.detailUser = res.value[0];
      });
    this.roleUserService.getAllRole().subscribe((res) => {
      this.listRoleUser = res.value;
    });
    this.serviceCate
      .getCateByType(CommonCategoriesType.COST)
      .subscribe((res) => {
        this.listCate = res.value;
      });
    this.closeRejectApproved = false;
    this.showApprove = false;
    if (this.idPostPlan) {
     
      this.service.getAllPostPlanById(this.idPostPlan).subscribe((res) => {
        this.listPostProduction = res.value[0];
        const transformedData = res.value.map(
          (postProductionPlaning: PostproductionPlaning) => ({
            Id: postProductionPlaning.Id,
            FromDate: postProductionPlaning.FromDate,
            ToDate: postProductionPlaning.ToDate,
            Budget: postProductionPlaning.Budget,
            WorkContent: postProductionPlaning.WorkContent,
            Status: postProductionPlaning.Status,
            PreProduction: postProductionPlaning.PreProduction.Id,
            Film: postProductionPlaning.PreProduction.Name,
          })
        );
        this.listProduct = transformedData[0];
        // console.log(this.listProduct);
        if (this.listPostProduction.Status == 5) {
          this.closeRejectApproved = true;
          this.editSettings = {
            allowEditing: false,
            allowAdding: false,
            allowDeleting: false,
            mode: 'Dialog',
          };
          this.editSettings2 = {
            allowEditing: true,
            allowAdding: false,
            allowDeleting: false,
          };
        }
        if (
          this.listPostProduction.Status === undefined ||
          this.listPostProduction.Status === PlanStatus.REJECT ||
          this.listPostProduction.Status === PlanStatus.NOTPROCESS || this.listPostProduction.Status === PlanStatus.INPROCRESS
        ) {
          this.showApprove = true;
        }
        if (
          this.listPostProduction.Status === PlanStatus.APPROVEPREPRODUCTION ||
          this.listPostProduction.Status ===
            PlanStatus.APPROVEPREPRODUCTIONREJECT ||
          this.listPostProduction.Status === PlanStatus.WAITAPPROVE
        ) {
          this.checkApproved = true;
        }
        if (this.listPostProduction.Status != 3) {
          this.checks = true;
        } else {
          this.checks = false;
        }
      });
      this.serviceProgress
        .getPostProgressByIdPlan(this.idPostPlan)
        .subscribe((res) => {
          this.listPostProgress = res.value;
        });

      this.serviceApproved
        .getListApprovedByQuery(
          `$Filter=ObjectType eq 5 and ObjectId eq ${this.idPostPlan}`
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
        });
      this.serviceApproved
        .getListApprovedByQuery(
          `$Filter=ObjectType eq 6 and ObjectId eq ${this.idPostPlan}`
        )
        .subscribe((data) => {
          this.listApprovedClose = data.value;
          this.aprovedTimes1 = data.value.length;
          const sortedList = data.value.sort((a: Approved, b: Approved) => {
            // @ts-ignore
            return new Date(b.ProcessedAt) - new Date(a.ProcessedAt);
          });
          this.cdr.detectChanges();
          this.approvedClose = sortedList[0];
        });
      this.videoService
        .getVideoByQuery(
          `$Filter=ObjectId eq ${this.idPostPlan} and ObjectType eq 2`
        )
        .subscribe((data) => {
          this.listVideo = data.value;
          if (this.listVideo.length > 0) {
            this.editSettings = {
              allowAdding: false,
              allowDeleting: true,
              allowEditing: true,
            };
          }
        });
      this.editMode = true;
    } else {
      this.checks = true;
      this.listPostProduction = new PostproductionPlaning();
      this.editMode = false;
    }
  }
  onChange(event: any) {
    this.PostProductionDetail.PreProductionId = event.value;
  }
  onCancelClick() {
    if (this.canGoBack) {
      this.router.navigate(['quan-ly-san-xuat-hau-ky/dung-hau-ky-phim/']);
    } else {
      this.router.navigate(['../../'], { relativeTo: this.route });
    }
  }
  loadUser() {
    this.serviceUser.getAllUser().subscribe((data: any) => {
      this.listUser = data.value.filter(
        (item: any) => item.UserName !== undefined
      );
    });
  }

  loadPlan() {
    // loadPlan() {
      this.servicePlan.getPlanFlowbyStatus().subscribe((data) => {
        this.listPlan = data.value;
        this.service.getAllPostPlan().subscribe((parentData) => {
          for (let index = 0; index < this.listPlan.length; index++) {
            const element = this.listPlan[index].Id;
            let foundMatch = false;
            for (let j = 0; j < parentData.value.length; j++) {
              const element1 = parentData.value[j].PreProductionId;
              if (element === element1) {
                foundMatch = true;
                this.listPlan.splice(index, 1);
                index--;
                break;
              }
            }
            if (!foundMatch) {
              const data = this.listPlan.filter((item) => item.Id == element);
            }
          }
        });
        this.cdr.detectChanges();
      });
    
  
    // if (this.roleRightService.hasRole([AppRoles.DIRECTOR])) {
    //   this.query = `and CreatedBy eq ${
    //     this.userLogged.getCurrentUser().userId
    //   }`;
    // }
    // if (
    //   this.roleRightService.hasRole([AppRoles.LEADER]) &&
    //   this.listPostProduction.PreProduction.CreatedBy !=
    //     this.userLogged.getCurrentUser().userId
    // ) {
    //   this.query = '';
    // }

    // this.servicePlan.getPlanQuery(this.query).subscribe((data) => {
    //   this.listPlan = data.value;
    //   this.service.getAllPostPlan().subscribe((parentData) => {
    //     for (let index = 0; index < this.listPlan.length; index++) {
    //       const element = this.listPlan[index].Id;
    //       let foundMatch = false;
    //       for (let j = 0; j < parentData.value.length; j++) {
    //         const element1 = parentData.value[j].PreProductionId;
    //         if (element === element1) {
    //           foundMatch = true;
    //           this.listPlan.splice(index, 1);
    //           index--;
    //           break;
    //         }
    //       }
    //       if (!foundMatch) {
    //         const data = this.listPlan.filter((item) => item.Id == element);
    //       }
    //     }
    //   });
    //   this.cdr.detectChanges();
    // });
  }
  toggleCollapse() {
    this.isCollasped = !this.isCollasped;
  }
  toggleCollapse2() {
    this.isCollasped2 = !this.isCollasped2;
  }
  toggleCollapse3() {
    this.isCollasped3 = !this.isCollasped3;
  }
  toggleCollapse4() {
    this.isCollasped4 = !this.isCollasped4;
  }
  toggleCollapse5() {
    this.isCollasped5 = !this.isCollasped5;
  }
  toggleCollapse6() {
    this.isCollasped6 = !this.isCollasped6;
  }
  toggleCollapse7() {
    this.isCollasped7 = !this.isCollasped7;
  }
  onChangeBudget(value: any) {
    this.PostProductionDetail.Budget = parseFloat(value);
  }
  onInputChange(value: any) {
    const key = value.key;
    const event = value.value;
    const data = { ...this.PostProductionDetail, [key]: event };
    this.PostProductionDetail = data;
  }
  onInputChangeProgress(value: any) {
    const key = value.key;
    const event = value.value;
    const data = { ...this.postProgressDetail, [key]: event };
    this.postProgressDetail = data;
  }
  onInputChangeProgressPercent(value: any) {
    if (this.postProgressDetail.TotalProgress == null) {
      this.postProgressDetail.TotalProgress = 0;
    } else {
      this.postProgressDetail.TotalProgress = parseFloat(value);
    }
  }
  onInputChangeProgressExpense(value: any) {
    this.postProgressDetail.Expense = parseFloat(value);
  }
  onSubmit() {
    if (this.idPostPlan) {
      if(this.listPostProduction.Status == PlanStatus.REJECT){
        this.PostProductionDetail.Status = PlanStatus.INPROCRESS
      }
      console.log("before update",this.PostProductionDetail)
      this.service
        .UpdatePostPlan(this.PostProductionDetail, this.idPostPlan)
        .subscribe((res) => {
          this.toastService.success('Cập nhật thành công!', 'Thành công');
          for (let index = 0; index < this.listRoleUser.length; index++) {
            const element = this.listRoleUser[index].UserId;
            const Title = `Kế hoạch sản xuất hậu kỳ được cập nhật`;
            const Detail = `Đạo diễn <strong>${this.handleRenderMember(
              parseInt(this.userLogged.getCurrentUser().userId)
            )}</strong>  đã cập nhật kế hoạch sản xuất hậu kì cho phim <strong>${
              this.listPostProduction.PreProduction.Name
            }</strong>. Vui lòng kiểm tra và xử lý.`;
            this.notifyService
              .CreateNotify(
                element,
                NotifyActionType.EDIT,
                NotifyObjectType.POSTPLANPROD,
                parseInt(this.idPostPlan),
                Title,
                Detail
              )
              .subscribe((data) => {});
          }
        });
    } else {
      if (this.PostProductionDetail.PreProductionId == undefined) {
        this.messagePlan = true;
      } else {
        if (
          this.PostProductionDetail.Budget == undefined ||
          this.PostProductionDetail.Budget == null
        ) {
          this.PostProductionDetail.Budget = 0;
        }
        this.messagePlan = false;
        this.PostProductionDetail.Status = 0;
        this.service
          .createPostPlan(this.PostProductionDetail)
          .subscribe((res) => {
            this.toastService.success('Thêm mới thành công!', 'Thành công');
            this.idPostPlan = res.Id;
            this.router.navigate(['../edit', this.idPostPlan], {
              relativeTo: this.route,
            });
            for (let index = 0; index < this.listRoleUser.length; index++) {
              const element = this.listRoleUser[index].UserId;
              const Title = `Kế hoạch sản xuất hậu kỳ cần duyệt`;
              const Detail = `Đạo diễn <strong>${this.handleRenderMember(
                parseInt(this.userLogged.getCurrentUser().userId)
              )}</strong> đã gửi kế hoạch sản xuất hậu kỳ cho phim <strong>
              ${this.getNameFilm(res.PreProductionId)}
              </strong> cần bạn duyệt. Vui lòng kiểm tra và xử lý.`;
              // console.log(formData);
              this.notifyService
                .CreateNotify(
                  element,
                  NotifyActionType.ADD,
                  NotifyObjectType.POSTPLANPROD,
                  res.Id,
                  Title,
                  Detail
                )
                .subscribe((data) => {});
            }
          });
      }
    }
  }
  getNameFilm(id: any) {
    // let userName: any = '';
    // if (MemberId) {
    //   const user = this.listUser.find((item) => item.Id === MemberId);
    //   userName = `${user?.FirstName} ${user?.LastName}`;
    // }
    // return userName;
    let nameFilm = '';
    if (id) {
      const film = this.listPlan.find((item) => item.Id === id);
      nameFilm = film?.Name;
    }
    return nameFilm;
  }
  onSubmitApproveClose(result: ApprovedResultStatus) {
    if (this.idPostPlan) {
      let detail = new Approved();

      let userLogged: UserLogged = new UserLogged();
      detail.ObjectId = this.idPostPlan as number;
      detail.ObjectType = ApprovedObjectType.ENDPOSTPLAN;
      detail.Result = result;
      detail.ProcessedBy = userLogged.getCurrentUser().userId;
      detail.ProcessedAt = new Date();
      detail.Comment = this.approvedClose.Comment;
      this.approvedClose = detail;
      let Title = '';
      let Detail = '';
      if (result === ApprovedResultStatus.APPROVED) {
        this.PostProductionDetail.Status = PlanStatus.APPROVEPREPRODUCTION;

        Title = 'Yêu cầu đóng sản xuất hậu kỳ đã được duyệt';
        Detail = `Yêu cầu đóng sản xuất hậu kỳ cho phim <strong>${
          this.listPostProduction.PreProduction.Name
        }</strong> của bạn đã được duyệt bởi <strong>${
          this.detailUser.FirstName + ' ' + this.detailUser.LastName
        }</strong>. Bạn có thể bắt đầu bước tiếp theo ngay bây giờ.`;
      }
      if (result === ApprovedResultStatus.REJECT) {
        this.PostProductionDetail.Status =
          PlanStatus.APPROVEPREPRODUCTIONREJECT;

        Title = 'Yêu cầu đóng sản xuất hậu kỳ không được duyệt';
        Detail = `Yêu cầu đóng sản xuất hậu kỳ cho phim <strong>${this.listPostProduction.PreProduction.Name}</strong> của bạn đã không được duyệt lần này. Cần có một số điều chỉnh hoặc bổ sung để đảm bảo tính đầy đủ và phù hợp.`;
      }
      if (
        this.listPostProduction.Status == PlanStatus.WAITAPPROVE ||
        this.listPostProduction.Status == PlanStatus.APPROVEPREPRODUCTIONREJECT
      ) {
        const formData = {
          Id: undefined,
          PostProductionPlaningId: this.idPostPlan,
          No: 1,
          Status: 0,
        };
        // this.serviceApproval.getApproval().subscribe((data) => {
        //   for (let index = 0; index < data.value.length; index++) {
        //     const element = data.value[index].Id;
        //     if(formData.PostProductionPlaningId == element){
        //       console.log("co roi");
        //     }
        //     else{
        //       console.log("chua co");
              this.serviceApproval.CreateMovieApproval(formData).subscribe((data) => {
                // console.log(data);
              });
        //    }
       //   }
       // })
      
      }
      this.service
        .UpdatePostPlan(this.PostProductionDetail, this.idPostPlan)
        .subscribe((data) => {
          this.serviceApproved
            .CreateApprove(this.approvedClose)
            .subscribe((data) => {
              this.aprovedTimes1 = this.aprovedTimes1 + 1;
              this.toastService.success(`${this.handleRenderResult(result)}`);
              this.notifyService
                .CreateNotify(
                  this.listPostProduction.PreProduction.CreatedBy,
                  result === ApprovedResultStatus.APPROVED
                    ? NotifyActionType.APPROVE
                    : NotifyActionType.REJECT,
                  NotifyObjectType.ENDPOSTPLAN,
                  this.idPostPlan,
                  Title,
                  Detail
                )
                .subscribe((data) => {});
              this.loadPostPlanDetail();
            });
        });
    }
  }

  onSubmitApprove(result: ApprovedResultStatus) {
   
   //   console.log(this.PostProductionDetail.PreProduction.Name);
      let detail = new Approved();
      let userLogged: UserLogged = new UserLogged();
      detail.ObjectId = this.idPostPlan as number;
      detail.ObjectType = ApprovedObjectType.POSTPLAN;
      detail.Result = result;
      detail.ProcessedBy = userLogged.getCurrentUser().userId;
      detail.ProcessedAt = new Date();
      detail.Comment = this.approvedDetail.Comment;
      this.approvedDetail = detail;
      let Title = '';
      let Detail = '';
      if (result === ApprovedResultStatus.APPROVED) {
        this.listPostProduction.Status = TopicStatus.APPROVE;
        Title = 'Kế hoạch sản xuất hậu kỳ đã được duyệt';
        Detail = `Kế hoạch sản xuất hậu kỳ cho phim <strong> ${
          this.listPostProduction.PreProduction.Name
        }</strong của bạn đã được duyệt bởi <strong>${
          this.detailUser.FirstName + ' ' + this.detailUser.LastName
        }</strong>. Bạn có thể bắt đầu bước tiếp theo ngay bây giờ.`;
      }
      if (result === ApprovedResultStatus.REJECT) {
        this.listPostProduction.Status = TopicStatus.REJECT;
        Title = 'Kế hoạch sản xuất hậu kỳ không được duyệt';
        Detail = `Kế hoạch sản xuất hậu kỳ cho phim <strong> ${this.listPostProduction.PreProduction.Name}</strong> của bạn đã không được duyệt lần này. Cần có một số điều chỉnh hoặc bổ sung để đảm bảo tính đầy đủ và phù hợp.`;
      }
      this.service
        .UpdatePostPlan(this.listPostProduction, this.idPostPlan)
        .subscribe((data) => {
          this.serviceApproved
            .CreateApprove(this.approvedDetail)
            .subscribe((data) => {
              this.aprovedTimes = this.aprovedTimes + 1;
              this.toastService.success(`${this.handleRenderResult(result)}`);
              this.loadPostPlanDetail();
              this.notifyService
                .CreateNotify(
                  this.listPostProduction.PreProduction.CreatedBy,
                  result === ApprovedResultStatus.APPROVED
                    ? NotifyActionType.APPROVE
                    : NotifyActionType.REJECT,
                  NotifyObjectType.POSTPLANPROD,
                  this.idPostPlan,
                  Title,
                  Detail
                )
                .subscribe((data) => {});
              this.loadPostPlanDetail();
            });
          })
    
  }
  handleRenderMember(MemberId: number) {
    let userName: any = '';
    if (MemberId) {
      const user = this.listUser.find((item) => item.Id === MemberId);
      userName = `${user?.FirstName} ${user?.LastName}`;
    }
    return userName;
  }
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
        return 'Đã duyệt';
      case ApprovedResultStatus.REJECT:
        return 'Đã từ chối';
      default:
        return '';
    }
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
    // console.log('Comment', this.approvedClose.Comment);
  }

  actionBegin(args: SaveEventArgs) {
    if (args.action == RequestTypeAction.ADD) {
      // console.log(this.postProgressDetail);
      this.postProgressDetail.PostProductionId = this.idPostPlan;
      this.serviceProgress
        .createPostProgresss(this.postProgressDetail)
        .subscribe(() => {
          this.loadPostPlanDetail();
          this.postProgressDetail = new PostproductionProgress();
        });
    }
    if (args.action == RequestTypeAction.EDIT) {
      const x = (args.data as any).Id;
      this.serviceProgress
        .UpdatePostProgress(this.postProgressDetail, x)
        .subscribe(() => {
          this.loadPostPlanDetail();
        });
    }
    if (args.requestType === 'delete') {
      const dataRow = (args.data as PostproductionProgress[])[0];
      args.cancel = true;
      this.dialogProgress.show();
      this.dialogProgress.header = 'Xác nhận xóa tiến độ';
      this.dialogProgress.content = 'Bạn có chắc chắn muốn tiếp tục không?';
      this.dialogProgress.animationSettings = {
        effect: 'Fade',
        duration: 100,
        delay: 0,
      };
      this.dialogProgress.buttons = [
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
    this.dialogProgress.hide();
    const data = dataRow as Video[];

        this.serviceProgress.DeletePostProgress(dataRow.Id).subscribe(
          (data) => {
            this.loadPostPlanDetail();
            this.toastService.success('Xóa thành công!');
          },
          () => {
            this.gridProgress.dataSource = this.listPostProgress;
            this.toastService.warning('Có lỗi xảy ra...');
          }
        );
      }

  actionComplete(args: any) {
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
  onInputChange2(value: any) {
    const key = value.key;
    const event = value.value;
    const data = { ...this.PostProductionDetail, [key]: event };
    this.PostProductionDetail = data;
  }
  onSubmit2() {
    this.PostProductionDetail.Status = PlanStatus.WAITAPPROVE;
    this.service
      .UpdatePostPlan(this.PostProductionDetail, this.idPostPlan)
      .subscribe(() => {
        this.toastService.success('Cập nhật thành công', 'Thành công!');

        this.loadPostPlanDetail();
        if (this.PostProductionDetail.Status === PlanStatus.WAITAPPROVE) {
          for (let index = 0; index < this.listRoleUser.length; index++) {
            const element = this.listRoleUser[index].UserId;
            const Title = `Yêu cầu đóng sản xuất hậu kỳ được sửa đổi`;
            const Detail = `Đạo diễn <strong>${this.handleRenderMember(
              this.listPostProduction.PreProduction.CreatedBy
            )}</strong> đã cập nhật yêu cầu đóng sản xuất hậu kỳ cho phim <strong>${
              this.listPostProduction.PreProduction.Name
            }</strong>. Vui lòng kiểm tra và xử lý.`;
            // console.log(formData);
            this.notifyService
              .CreateNotify(
                element,
                NotifyActionType.EDIT,
                NotifyObjectType.POSTPLANPROD,
                this.idPostPlan,
                Title,
                Detail
              )
              .subscribe((data) => {});
          }
        } else {
          for (let index = 0; index < this.listRoleUser.length; index++) {
            const element = this.listRoleUser[index].UserId;
            const Title = `Yêu cầu đóng sản xuất hậu kỳ`;
            const Detail = `Đạo diễn <strong>${this.handleRenderMember(
              this.listPostProduction.PreProduction.CreatedBy
            )}</strong> đã gửi yêu cầu đóng sản xuất hậu kỳ cho phim <strong>${
              this.listPostProduction.PreProduction.Name
            }</strong>. Vui lòng kiểm tra và xử lý.`;
            // console.log(formData);
            this.notifyService
              .CreateNotify(
                element,
                NotifyActionType.EDIT,
                NotifyObjectType.POSTPLANPROD,
                this.idPostPlan,
                Title,
                Detail
              )
              .subscribe((data) => {});
          }
        }
        if (
          this.PostProductionDetail.Status ===
            PlanStatus.APPROVEPREPRODUCTION ||
          this.PostProductionDetail.Status ===
            PlanStatus.APPROVEPREPRODUCTIONREJECT ||
          this.PostProductionDetail.Status === PlanStatus.WAITAPPROVE
        ) {
          this.checkApproved = true;
        }
      });
  }
  rederStatus(data: PostproductionProgress) {
    const status = data.IsFinished;
    switch (status) {
      case false:
        return 'Chưa hoàn thành';
      case true:
        return 'Hoàn thành';
      default:
        return '';
    }
  }
  actionBeginVideo(args: SaveEventArgs): void {
    if (
      args.requestType === 'beginEdit' ||
      args.requestType === 'add' ||
      args.requestType === 'delete'
    ) {
      // Store the original data in case we need to revert
      this.listVideoOrigin = [
        ...this.gridVideo.getCurrentViewRecords(),
      ] as Video[];
    }
    if (args.action === RequestTypeAction.ADD) {
      this.messageFile = false;
      if (this.idPostPlan) {
        if (this.fileUpload == undefined) {
          if (args.requestType == 'save') {
            this.messageFile = true;
            args.cancel = true;
          } else {
            args.cancel = false;
          }
        } else {
          this.messageFile = false;
          if (this.fileUpload && !this.videoDetail.Id) {
            const chunkSize = 104857600;
            const fileName = this.fileUpload.name;
            const numberOfChunks = Math.ceil(this.fileUpload.size / chunkSize);
            let start = 0;
            let chunkEnd = start + chunkSize;
            this.spinnerService.show();
            let chunkCounter = 0;

            this.fileUploadService.StartUpload(DBType.THNDFILM).subscribe(
              (data) => {
                this.createChunk(
                  data.videoId,
                  start,
                  chunkEnd,
                  chunkSize,
                  chunkCounter,
                  fileName,
                  numberOfChunks
                );
              },
              () => {}
            );
          }
        }
      }
    }
    if ((args as any).requestType === RequestTypeAction.BEGINEDIT) {
      this.videoDetail = args.rowData as Video;
    }
    if (args.action === RequestTypeAction.EDIT) {
      this.videoService
        .UpdateVideo(this.videoDetail, this.videoDetail.Id)
        .subscribe(
          (data) => {
            this.videoDetail = new Video();
            this.refreshVideoList();
          },
          () => {
            (args as any).cancel = true;
          }
        );
    }
    if (args.requestType === 'delete') {
      const dataRow = (args.data as Video[])[0];
      args.cancel = true;
      this.dialogVideo.show();
      this.dialogVideo.header = 'Xác nhận xóa thư mục';
      this.dialogVideo.content = 'Bạn có chắc chắn muốn tiếp tục không?';
      this.dialogVideo.animationSettings = {
        effect: 'Fade',
        duration: 100,
        delay: 0,
      };
      this.dialogVideo.buttons = [
        {
          click: this.onConfirmDeleteVideo.bind(this, dataRow),
          buttonModel: { content: 'OK', isPrimary: true },
        },
        {
          click: this.hideDialog.bind(this),
          buttonModel: { content: 'Hủy' },
        },
      ];
    }
  }
    
  onConfirmDeleteVideo(dataRow: any) {
    this.dialogVideo.hide();
    const data = dataRow as Video[];

        this.videoService.DeleteVideo(dataRow.Id).subscribe(
          (data) => {
            this.editSettings = {
              allowAdding: true,
              allowEditing : true,
              allowDeleting: true,
            }
            this.refreshVideoList();
            this.toastService.success('Xóa thành công!');
          },
          () => {
            this.gridVideo.dataSource = this.listVideo;
            this.toastService.warning('Có lỗi xảy ra...');
          }
        );
      }
  //   if (args.requestType === RequestTypeAction.DELETE) {
  //     const data = args.data as Video[];
  //     data.forEach((item) => {
  //       this.videoService.DeleteVideo(item.Id).subscribe(
  //         (data) => {
  //           this.editSettings = {
  //             allowAdding: true,
  //             allowDeleting: true,
  //             allowEditing: true,
  //           };
  //           this.refreshVideoList();
  //         },
  //         () => {
  //           this.gridVideo.dataSource = this.listVideoOrigin;
  //           // (args as any).cancel = true;
  //         }
  //       );
  //     });
  //   }
  // }

  // create chunk to upload
  createChunk(
    videoId: string,
    start: any,
    chunkEnd: number,
    chunkSize: number,
    chunkCounter: number,
    fileName: string,
    numberOfChunks: number
  ) {
    chunkCounter++;
    chunkEnd = Math.min(start + chunkSize, this.fileUpload.size);
    const chunk = this.fileUpload.slice(start, chunkEnd);
    const chunkForm: FormData = new FormData();
    if (videoId) {
      chunkForm.append('videoId', videoId);
      chunkForm.append('file', chunk, fileName);
    }
    this.uploadChunk(
      videoId,
      chunkForm,
      start,
      chunkEnd,
      chunkSize,
      chunkCounter,
      numberOfChunks
    );
  }
  uploadChunk(
    videoId: string,
    chunkForm: FormData,
    start: any,
    chunkEnd: any,
    chunkSize: any,
    chunkCounter: any,
    numberOfChunks: number
  ) {
    this.oReq.timeout = 300000;
    var self = this;
    this.oReq.upload.onprogress = function (oEvent) {
      if (oEvent.lengthComputable) {
        // self.percentComplete = Math.round((oEvent.loaded / oEvent.total) * 100);
        // console.log('self', self.percentComplete);

        var percentComplete = Math.round((oEvent.loaded / oEvent.total) * 100);
        var totalPercentComplete = Math.round(
          ((chunkCounter - 1) / numberOfChunks) * 100 +
            percentComplete / numberOfChunks
        );
        self.percentComplete = totalPercentComplete;
        self.spinnerService.progressChange(totalPercentComplete);
        // console.log('totalPercentComplete', self.percentComplete);
      } else {
        // console.log('not computable');
        // Unable to compute progress information since the total size is unknown
      }
    };
    this.oReq.open('POST', environment.uploadUrl + '/custom/Upload', true);

    var blobEnd = chunkEnd - 1;
    var contentRange = 'bytes ' + start + '-' + blobEnd + '/' + this.file.size;
    this.oReq.setRequestHeader('Content-Range', contentRange);

    this.oReq.onload = (event: any) => {
      var resp = JSON.parse(this.oReq.response);
      start += chunkSize;
      if (start < this.fileUpload.size) {
        this.createChunk(
          videoId,
          start,
          chunkEnd,
          chunkSize,
          chunkCounter,
          this.fileUpload.name,
          numberOfChunks
        );
      } else {
        this.fileUploadService
          .FinishUpload(
            videoId,
            this.fileUpload.name,
            this.fileUpload.size,
            numberOfChunks,
            this.fileUpload.name,
            this.fileUpload.name,
            DBType.THNDFILM,
            this.userLogged.getCurrentUser().userId
          )
          .subscribe(
            (data) => {
              this.spinnerService.hide();
              const topDoc = new Video();
              topDoc.VideoUrl = data.url;
              topDoc.ObjectId = this.idPostPlan as number;
              topDoc.ObjectType = VideoType.POSTPRODUCTION;
              topDoc.UploadPartId = data.entityId;
              this.videoService
                .CreateVideo(topDoc)
                .subscribe((res) => {
                  this.editSettings = {
                    allowAdding: false,
                    allowEditing : true,
                    allowDeleting: true,
                  }
                  this.videoDetail = new Video();
                  this.refreshVideoList();
                });
              this.file = '';
              this.fileUpload = undefined;
            },
            () => {
              this.spinnerService.enableCloseBtn();
            }
          );
      }
    };
    this.oReq.onerror = (event: any) => {
      this.spinnerService.enableCloseBtn();
      this.refreshVideoList();
      this.toastService.warning('Tải lên thất bại. Vui lòng thử lại...');
    };
    this.oReq.send(chunkForm);
  }
  onFileUrlClick(fileUrl: any) {
    if (fileUrl) {
      window.open(fileUrl, '_blank');
    }
  }
  onInputVideoChange(input: any) {
    const { key, value } = input;
    const data = { ...this.videoDetail, [key]: value };
    this.videoDetail = data;
    // console.log('this', this.videoDetail);
  }
  getFileName(fileUrl: string): string {
    if (fileUrl) {
      const fileName = fileUrl.substring(fileUrl.lastIndexOf('/') + 1);
      return fileName;
    }
    return '';
  }
  // get list video by progress id
  refreshVideoList() {
    if (this.idPostPlan) {
      this.videoService
        .getVideoByQuery(
          `$Filter=ObjectId eq ${this.idPostPlan} and ObjectType eq 2&$Expand=UploadPart`
        )
        .subscribe((data) => {
          this.listVideo = data.value;
          // console.log(this.listVideo);
        });
    }
  }
  fileChange(event: any) {
    if (event.files.length) {
      this.file = event.files[0].name;
      this.fileUpload = event.files[0];
    }
  }
  // Remove file
  removeFile(): void {
    this.file = '';
    this.fileUpload = undefined;
  }
  actionCompleteVideo(args: any) {
    if (
      (args as any).requestType === 'beginEdit' ||
      (args as any).requestType === 'add'
    ) {
      const dialog = (args as any).dialog;

      dialog.width = 600;
      dialog.header =
        (args as any).requestType === 'beginEdit'
          ? 'Chỉnh sửa'
          : 'Thêm mới video';
    }
  }
  rowDataBound = (args: any) => {
    console.log('args.', args);

    if (args.row) {
      if (args.data?.UploadPart?.FileType !== 2) {
        args.row.querySelector('.e-custombtn').style.display = 'none';
      }
    }
  };
  commandClick(args: any) {
    console.log("command click" , args);
    this.open = true;
    setTimeout(() => {
      jQuery('#videoCompressorModal').modal('show');
    }, 100);
    this.uploadPartId = args.rowData.UploadPartId;
    console.log("uploadpart Id" , this.uploadPartId);
  }
  onSuccessUploadPart(event: any) {}
  onHideModal() {
    this.open = false;
  }
}
