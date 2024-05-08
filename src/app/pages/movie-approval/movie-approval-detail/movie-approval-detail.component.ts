import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  EditSettingsModel,
  GridComponent,
  PageSettingsModel,
  SaveEventArgs,
  ToolbarItems,
} from '@syncfusion/ej2-angular-grids';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';
import { ToastrService } from 'ngx-toastr';
import {
  Approved,
  Movieapproval,
  MovieapprovalDetail,
  Notify,
  User,
  Video,
} from 'src/app/core/models/database/db.model';
import { EmitType } from '@syncfusion/ej2-base';
import { ApprovedService } from 'src/app/core/services/approve.service';
import { MovieApprovalDetailService } from 'src/app/core/services/movie-approval-detail.service';
import { MovieApprovalService } from 'src/app/core/services/movie-approval.service';
import { NotifyService } from 'src/app/core/services/notify.service';
import { PostProPlanService } from 'src/app/core/services/post-pro-plan.service';
import { RolePermissionService } from 'src/app/core/services/role-permission.service';
import { UserService } from 'src/app/core/services/user.service';
import { VideoService } from 'src/app/core/services/video.service';
import {
  AppRoles,
  ApprovedObjectType,
  ApprovedResultStatus,
  NotifyActionType,
  NotifyObjectType,
  NotifyStatus,
  RequestTypeAction,
  TopicStatus,
} from 'src/app/core/utils/constant';
import { UserLogged } from 'src/app/core/utils/userLogged';

@Component({
  selector: 'app-movie-approval-detail',
  templateUrl: './movie-approval-detail.component.html',
  styleUrls: ['./movie-approval-detail.component.scss'],
})
export class MovieApprovalDetailComponent implements OnInit {
  public listMovieApproval: Movieapproval;
  selectedCommentIndex: number = -1;
  public movieApprovalDetail: Movieapproval;
  isCollapsed = false;
  isCollasped1 = true;
  isCollapsed5 = true;
  isCollapsed3 = true;
  public enableForm: boolean = false;
  public enableApprove = false;
  editSettings: EditSettingsModel;
  public status = {
    APPROVE: ApprovedResultStatus.APPROVED,
    REJECT: ApprovedResultStatus.REJECT,
  };
  private userLogged = new UserLogged();

  public aprovedTimes: number;
  public approvedDetail = new Approved();
  isCommentVisible: boolean = false;
  private readonly canGoBack: boolean;
  pageSettings: PageSettingsModel;
  public toolbarOptions: ToolbarItems[];
  public editMode: boolean;
  @ViewChild('gridMember') public gridMember: GridComponent;
  nameVideo: Video;
  public listUser: Array<any> = [];
  public listUser2 : Array<any>=[];
  public listStatus: any[] = [
    { Name: 'Chưa duyệt', Id: 0 },
    { Name: 'Từ chối', Id: -1 },
    { Name: 'Đã duyệt', Id: 1 },
  ];
  toggleCollapse4 = false;
  public listMovieDetail: MovieapprovalDetail[] = [];
  checkApproved: boolean = false;
  public movieDetail: MovieapprovalDetail;
  public dropdownFields: Object = { text: 'Name', value: 'Id' };
  public listMovieName: Array<any> = [];
  idMovieApproval: any;
  numberNo: any;
  public targetElement: HTMLElement;
  public hideDialog: EmitType<object> = () => {
    this.dialogMember.hide();
  };

  public initilaizeTarget: EmitType<object> = () => {
    this.targetElement = this.container.nativeElement.parentElement;
  };
  @ViewChild('ejDialogMember') public dialogMember: DialogComponent;
  // Create element reference for dialog target element.
  @ViewChild('container', { read: ElementRef, static: true }) container:
    | ElementRef
    | any;
  messageUser: boolean = false;
  public fieldDropdown: Object  = { text: 'Name', value: 'Id' };
  listApproved: Approved[] = [];
  private detailUser: User = new User();
  public dropdownUser: Object = { text: 'FirstName', value: 'Id' };
  constructor(
    public service: MovieApprovalService,
    public readonly router: Router,
    public serviceApproved: ApprovedService,
    public serviceUser: UserService,
    private cdr: ChangeDetectorRef,
    private videoService: VideoService,
    private readonly route: ActivatedRoute,
    public toastService: ToastrService,
    private serivcePostPlan: PostProPlanService,
    private serivceApprovalDetail: MovieApprovalDetailService,
    private notifyService: NotifyService,
    public roleRightService: RolePermissionService
  ) {
    this.idMovieApproval = this.route.snapshot.paramMap.get('id');
    {
      if (this.roleRightService.hasRole([AppRoles.DIRECTOR])) {
        this.enableForm = true;
        this.toolbarOptions = ['Add', 'Delete'];
        this.editSettings = {
          allowEditing: true,
          allowAdding: true,
          allowDeleting: true,
          mode: 'Dialog',
        };
      } else if (this.roleRightService.hasRole([AppRoles.LEADER])) {
        this.enableApprove = true;
        this.toolbarOptions = ['Add', 'Delete'];
        this.editSettings = {
          allowEditing: true,
          allowAdding: true,
          allowDeleting: true,
          mode: 'Dialog',
        };
      }
    }
    this.canGoBack = !!this.router.getCurrentNavigation()?.previousNavigation;
  }

  ngOnInit(): void {
    this.loadUser();
    this.editMode = false;
    this.loadMovieName();
    this.approvedDetail = new Approved();
    this.listMovieApproval = new Movieapproval();
    this.loadMovieApproved();
  }
  onCancelClick() {
    if (this.idMovieApproval) {
      this.router.navigate(['../../'], { relativeTo: this.route });
    } else {
      this.router.navigate(['../../'], { relativeTo: this.route });
    }
  }
  loadMovieApproved() {
    if (this.idMovieApproval) {
      this.service
        .getMovieApprovalbyId(this.idMovieApproval)
        .subscribe((data) => {
          this.listMovieApproval = data.value[0];
          this.videoService
            .getVideoByQuery(
              `$Filter=ObjectId eq ${this.listMovieApproval.PostProductionPlaningId} and ObjectType eq 2`
            )
            .subscribe((data) => {
              this.nameVideo = data.value[0];
            });
          if (
            this.listMovieApproval.Status == 0 ||
            this.listMovieApproval.Status == -1 ||
            this.listMovieApproval.Status == 2
          ) {
            this.checkApproved = true;
            this.editSettings = {
              allowEditing: false,
              allowAdding: true,
              allowDeleting: true,
            };
          } else {
            this.checkApproved = false;
            this.editSettings = {
              allowEditing: false,
              allowAdding: false,
              allowDeleting: false,
            };
          }
        });

      this.serivceApprovalDetail
        .getAllMovieApprovalDetailById(this.idMovieApproval)
        .subscribe((data) => {
          this.listMovieDetail = data.value;
        });
      this.serviceApproved
        .getListApprovedByQuery(
          `$Filter=ObjectType eq 7 and ObjectId eq ${this.idMovieApproval}`
        )
        .subscribe((data) => {
          this.listApproved = data.value;
          // console.log('aaaa', this.listApproved);
          this.aprovedTimes = data.value.length;
          const sortedList = data.value.sort((a: Approved, b: Approved) => {
            // @ts-ignore
            return new Date(b.ProcessedAt) - new Date(a.ProcessedAt);
          });
          this.cdr.detectChanges();
          this.approvedDetail = sortedList[0];
        });

      // this.videoService.getVideoByQuery(``)
      this.editMode = true;
    } else {
      this.editMode = false;
    }
  }
  toggleCommentVisibility(index: number) {
    this.isCommentVisible = !this.isCommentVisible;
    this.selectedCommentIndex = this.isCommentVisible ? index : -1;
  }
  actionCompleteListMember(args: any) {
    if (
      (args as any).requestType === 'beginEdit' ||
      (args as any).requestType === 'add'
    ) {
      const dialog = (args as any).dialog;
      dialog.width = 600;
      dialog.header =
        (args as any).requestType === 'beginEdit'
          ? 'Chỉnh sửa'
          : 'Thêm thành viên cho hội đồng duyệt phim';
    }
  }
  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
  }
  toggleCollapse5() {
    this.isCollapsed5 = !this.isCollapsed5;
  }
  toggleCollapse1() {
    this.isCollasped1 = !this.isCollasped1;
  }
  toggleCollapse3() {
    this.isCollapsed3 = !this.isCollapsed3;
  }
  onSubmit() {
    if (this.idMovieApproval) {
      this.service
        .UpdateMovieApproval(this.movieApprovalDetail, this.idMovieApproval)
        .subscribe((data) => {
          this.toastService.success('Cập nhật thành công!', 'Thành công');
          if (this.listMovieDetail.length > 0) {
            this.listMovieDetail.forEach((element) => {
              // const newNotify = new Notify();
              const Title = `Thông tin hội đồng duyệt phim được cập nhật`;
              const Detail = `Lãnh đạo <strong>${
                this.detailUser.FirstName + ' ' + this.detailUser.LastName
              }</strong> vừa cập nhật thông tin hội đồng duyệt phim cho phim <strong>${
                this.listMovieApproval?.PostProductionPlaning?.PreProduction
                  ?.Name ?? ''
              }</strong>. Hãy vào xem thông tin chi tiết để nắm được thông tin mới nhất. `;
              this.notifyService
                .CreateNotify(
                  element.UserId,
                  NotifyActionType.EDIT,
                  NotifyObjectType.MOVIEAPPROVAL,
                  element.MovieApprovalId,
                  Title,
                  Detail
                )
                .subscribe();
            });
          }
        });
    }
  }
  handleRenderMember(MemberId: number) {
    let userName: any = '';
    if (MemberId) {
      const user = this.listUser2.find((item) => item.Id === MemberId);
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

  loadUser() {
    this.serviceUser.getAllUserCheckStatus().subscribe((data) => {
      this.listUser = data.value;
      // console.log('data listUser', this.listUser);
      // this.serivceApprovalDetail.getAllMovieApprovalDetail().subscribe((parentData: any) => {
      //   console.log('data parentId', parentData.value);
      //   for (let index = 0; index < this.listUser.length; index++) {
      //     const element = this.listUser[index].Id;
      //     let foundMatch = false;
      //     for (let j = 0; j < parentData.value.length; j++) {
      //       const element1 = parentData.value[j].UserId;
      //       if (element === element1) {
      //         foundMatch = true;
      //         this.listUser.splice(index, 1);
      //         index--;
      //         break;
      //       }
      //       if (!foundMatch) {
      //         const data = this.listUser.filter((item) => item.Id == element);
      //       }
      //     }
      //   }
      // });
    });
    this.serviceUser.getAllUser().subscribe((data) =>{
      this.listUser2 = data.value;
    })
    this.serviceUser
      .getUserByIds(this.userLogged.getCurrentUser().userId)
      .subscribe((data) => {
        this.detailUser = data.value[0] as User;
      });
  }

  loadMovieName() {
    this.serivcePostPlan.getAllPostPlan().subscribe((data) => {
      this.listMovieName = data.value;
    });
  }
  onInputComment(value: any) {
    const key = value.key;
    const event = value.value;
    const data = { ...this.approvedDetail, [key]: event };
    this.approvedDetail = data;
  }
  actionBeginListMember(args: SaveEventArgs) {
    this.serviceUser.getAllUserCheckStatus().subscribe((data) => {
      this.listUser = data.value;
      console.log('data listUser', this.listUser);
      this.serivceApprovalDetail.getAllMovieApprovalDetailById(this.idMovieApproval).subscribe((parentData: any) => {
        console.log('data parentId', parentData.value);
        for (let index = 0; index < this.listUser.length; index++) {
          const element = this.listUser[index].Id;
          let foundMatch = false;
          for (let j = 0; j < parentData.value.length; j++) {
            const element1 = parentData.value[j].UserId;
            if (element === element1) {
              foundMatch = true;
              this.listUser.splice(index, 1);
              index--;
              break;
            }
            if (!foundMatch) {
              const data = this.listUser.filter((item) => item.Id == element);
            }
          }
        }
      });
    });
    if (args.action === RequestTypeAction.ADD) {
      this.messageUser = false;
      if (this.movieDetail.UserId == undefined) {
        if (args.requestType == 'save') {
          args.cancel = true;
          this.messageUser = true;
          args.cancel = true;
        } else {
          this.movieDetail = new MovieapprovalDetail();
          args.cancel = false;
        }
      } else {
        this.messageUser = false;
        this.movieDetail.MovieApprovalId = this.idMovieApproval;
        this.movieDetail.Status = 0;
        this.serivceApprovalDetail
          .CreateMovieApprovalDetail(this.movieDetail)
          .subscribe((data) => {
            const Title = `Bạn đã được thêm vào Hội đồng Duyệt Phim`;
            const Detail = `Bạn đã được thêm vào Hội đồng Duyệt Phim của phim <strong>${
              this.listMovieApproval?.PostProductionPlaning?.PreProduction
                ?.Name ?? ''
            }</strong>. Hãy bắt đầu đóng góp ý kiến vào các quyết định quan trọng ngay bây giờ.`;
            this.notifyService
              .CreateNotify(
                data.UserId,
                NotifyActionType.ADD,
                NotifyObjectType.MOVIEAPPROVAL,
                data.MovieApprovalId,
                Title,
                Detail
              )
              .subscribe();
            this.loadMovieApproved();
          });
      }
    }
    if (args.action === RequestTypeAction.EDIT) {
      const x = (args.data as any).Id;
      this.serivceApprovalDetail
        .UpdateMovieApprovalDetail(this.movieDetail, x)
        .subscribe(() => {
          this.loadMovieApproved();
        });
    }
    if (args.requestType === 'delete') {
      const dataRow = (args.data as Video[])[0];
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
        this.serivceApprovalDetail.DeleteMovieApprovalDetail(dataRow.Id).subscribe(
          (data) => {
            this.loadMovieApproved();
            this.toastService.success('Xóa thành công!');
          },
          () => {
            this.gridMember.dataSource = this.listMovieDetail;
            this.toastService.warning('Có lỗi xảy ra...');
          }
        );
      }
  //   if (args.requestType === 'delete') {
  //     const x = (args.data as any)[0].Id;
  //     this.serivceApprovalDetail
  //       .DeleteMovieApprovalDetail(x)
  //       .subscribe(() => {});
  //   }
  // }

  onSubmitApprove(result: ApprovedResultStatus) {
    if (this.idMovieApproval) {
      let detail = new Approved();
      let userLogged: UserLogged = new UserLogged();
      detail.ObjectId = this.idMovieApproval as number;
      detail.ObjectType = ApprovedObjectType.MOVIEAPPROVAL;
      detail.Result = result;
      detail.ProcessedBy = userLogged.getCurrentUser().userId;
      detail.ProcessedAt = new Date();
      detail.Comment = this.approvedDetail.Comment;
      this.approvedDetail = detail;

      if (result === ApprovedResultStatus.APPROVED) {
        this.movieApprovalDetail.Status = TopicStatus.APPROVE;
      }
      if (result === ApprovedResultStatus.REJECT) {
        this.movieApprovalDetail.Status = TopicStatus.REJECT;
      }

      if (result === ApprovedResultStatus.REJECT) {
        this.movieApprovalDetail.Status == TopicStatus.INPROCRESS;
      }
      // console.log(this.movieApprovalDetail.Status);
      this.movieApprovalDetail.No = this.aprovedTimes + 1;
      this.movieApprovalDetail.ApprovalDate = detail.ProcessedAt;
      this.movieApprovalDetail.Comment = detail.Comment;
      this.service
        .UpdateMovieApproval(this.movieApprovalDetail, this.idMovieApproval)
        .subscribe((data) => {
          this.serviceApproved
            .CreateApprove(this.approvedDetail)
            .subscribe((data) => {
              this.aprovedTimes = this.aprovedTimes + 1;

              // const newNotify = new Notify();
              // newNotify.ActionType = NotifyActionType.APPROVE;
              // newNotify.UserId =
              //   this.listMovieApproval?.PostProductionPlaning?.PreProduction?.CreatedBy;
              // newNotify.ObjectId = this.idMovieApproval;
              // newNotify.ObjectType = NotifyObjectType.MOVIEAPPROVAL;
              // newNotify.SenderId = this.userLogged.getCurrentUser().userId;
              // newNotify.CreatedAt = new Date();
              // newNotify.Status = NotifyStatus.NEW;
              let Title = '';
              let Detail = '';
              if (result === ApprovedResultStatus.APPROVED) {
                Title = `Phim được phê duyệt`;
                Detail = `Chúc mừng! Bộ phim <strong>"${
                  this.listMovieApproval?.PostProductionPlaning?.PreProduction
                    ?.Name ?? ''
                }"</strong> của bạn đã được phê duyệt bởi hội đồng duyệt phim. Bạn có thể bắt đầu bước tiếp theo ngay bây giờ.
                `;
              }
              if (result === ApprovedResultStatus.REJECT) {
                Title = `Phim bị từ chối duyệt`;
                Detail = `Bộ phim <strong>${
                  this.listMovieApproval?.PostProductionPlaning?.PreProduction
                    ?.Name ?? ''
                }</strong> của bạn đã không được hội đồng duyệt phim duyệt lần này. Cần có một số điều chỉnh hoặc bổ sung để đảm bảo tính đầy đủ và phù hợp.`;
              }
              this.notifyService
                .CreateNotify(
                  this.listMovieApproval?.PostProductionPlaning?.PreProduction
                    ?.CreatedBy,
                  result === ApprovedResultStatus.APPROVED
                    ? NotifyActionType.APPROVE
                    : NotifyActionType.REJECT,
                  NotifyObjectType.MOVIEAPPROVAL,
                  this.idMovieApproval,
                  Title,
                  Detail
                )
                .subscribe((data) => {});

              this.toastService.success(`${this.handleRenderResult(result)}`);
              this.loadMovieApproved();
            });
        });
    }
  }
  onInputChange(value: any) {
    const key = value.key;
    const event = value.value;
    const data = { ...this.movieDetail, [key]: event };
    this.movieDetail = data;
  }
  onInputChangeMain(value: any) {
    const key = value.key;
    const event = value.value;
    const data = { ...this.movieApprovalDetail, [key]: event };
    this.movieApprovalDetail = data;
  }
  rederStatus(data: MovieapprovalDetail) {
    const status = data.Status;
    switch (status) {
      case 0:
        return 'Chưa duyệt';
      case -1:
        return 'Từ chối duyệt';
      case 1:
        return 'Đã duyệt';
      default:
        return '';
    }
  }
}
