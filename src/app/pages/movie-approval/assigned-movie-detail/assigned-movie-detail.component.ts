import { NotifyService } from 'src/app/core/services/notify.service';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import {
  Approved,
  Movieapproval,
  MovieapprovalDetail,
  Notify,
  User,
  UserRole,
  Video,
} from 'src/app/core/models/database/db.model';
import { ApprovedService } from 'src/app/core/services/approve.service';
import { MovieApprovalDetailService } from 'src/app/core/services/movie-approval-detail.service';
import { MovieApprovalService } from 'src/app/core/services/movie-approval.service';
import { UserService } from 'src/app/core/services/user.service';
import { VideoService } from 'src/app/core/services/video.service';
import {
  ApprovedObjectType,
  ApprovedResultStatus,
  NotifyActionType,
  NotifyObjectType,
  NotifyStatus,
  TopicStatus,
  assignedStatus,
} from 'src/app/core/utils/constant';
import { UserLogged } from 'src/app/core/utils/userLogged';
import { UserRoleService } from 'src/app/core/services/user-role.service';

@Component({
  selector: 'app-assigned-movie-detail',
  templateUrl: './assigned-movie-detail.component.html',
  styleUrls: ['./assigned-movie-detail.component.scss'],
})
export class AssignedMovieDetailComponent implements OnInit {
  public status = {
    APPROVE: ApprovedResultStatus.APPROVED,
    REJECT: ApprovedResultStatus.REJECT,
  };

  public listMovieApprovalDt: Movieapproval;
  idAssigned: any;
  listUser: Array<any> = [];
  getIdMovieApproval: any;
  isCommentVisible: boolean = false;
  selectedCommentIndex: number = -1;
  public listMovieApprovalDetail: MovieapprovalDetail;
  public moveDetail: MovieapprovalDetail;
  public isCollapsed = false;
  checkStatus: boolean = false;
  isCollapsed2 = false;
  getName: any;
  listApproved: Approved;
  public nameVideo: Video;
  isCollapsed3 = true;
  public approvedHistory: Approved[] = [];
  public approvedDetail: Approved;
  public aprovedTimes: any;
  private userLogged = new UserLogged();
  private detailUser: User = new User();
  public listRoleUser: Array<any> = [];

  constructor(
    public readonly router: Router,
    private serviceUser: UserService,
    private videoService: VideoService,
    private roleUserService: UserRoleService,
    private toastService: ToastrService,
    private readonly route: ActivatedRoute,
    private serviceApproved: ApprovedService,
    private cdr: ChangeDetectorRef,
    private serviceMovieApprovalDetail: MovieApprovalDetailService,
    private notifyService: NotifyService,
    private service: MovieApprovalService
  ) {this.idAssigned = this.route.snapshot.paramMap.get('id');}
  ngOnInit(): void {
    this.loadUser();
    this.approvedDetail = new Approved();
    this.listMovieApprovalDt = new Movieapproval();
    this.loadAssigned();
  }
  loadAssigned() {
    if (this.idAssigned) {
      // console.log("aaaa",this.idAssigned)
      this.service.getMovieApprovalbyIdAndMember(this.userLogged.getCurrentUser().userId,this.idAssigned).subscribe((data) => {
        this.listMovieApprovalDt = data.value[0];
        this.videoService
          .getVideoByQuery(
            `$Filter=ObjectId eq ${this.listMovieApprovalDt.PostProductionPlaningId} and ObjectType eq 2`
          )
          .subscribe((data) => {
            this.nameVideo = data.value[0];
          });
        this.getName =
          this.listMovieApprovalDt.PostProductionPlaning.PreProduction.Name;
        if (this.listMovieApprovalDt.Status == 3) {
          this.checkStatus = false;
        } else {
          this.checkStatus = true;
        }
      });
      this.serviceMovieApprovalDetail
        .getAllMovieApprovalDetailById(this.idAssigned)
        .subscribe((data) => {
          this.listMovieApprovalDetail = data.value[0];
          // console.log(this.listMovieApprovalDetail);
        });
    }
    let userLogged: UserLogged = new UserLogged();
    this.serviceApproved
      .getListApprovedByQuery(
        `$Filter=ObjectId eq ${this.idAssigned} and ObjectType eq ${
          ApprovedObjectType.MEMBERAPPROVALMOVIE
        } and ProcessedBy eq ${userLogged.getCurrentUser().userId}`
      )
      .subscribe((data) => {
        this.approvedHistory = data.value;
        this.aprovedTimes = data.value.length;
        const sortedList = data.value.sort((a: Approved, b: Approved) => {
          // @ts-ignore
          return new Date(b.ProcessedAt) - new Date(a.ProcessedAt);
        });
        this.cdr.detectChanges();
        this.approvedDetail = sortedList[0];
      });
  }

  onInputChangeMain(value: any) {
    const key = value.key;
    const event = value.value;
    const data = { ...this.listMovieApprovalDt, [key]: event };
    this.listMovieApprovalDt = data;
  }
  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
  }
  toggleCollapse2() {
    this.isCollapsed2 = !this.isCollapsed2;
  }
  toggleCollapse3() {
    this.isCollapsed3 = !this.isCollapsed3;
  }
  toggleCommentVisibility(index: number) {
    this.isCommentVisible = !this.isCommentVisible;
    this.selectedCommentIndex = this.isCommentVisible ? index : -1;
  }
  handleRenderMember(MemberId: number) {
    let userName: any = '';
    if (MemberId) {
      const user = this.listUser.find((item) => item.Id === MemberId);
      userName = `${user?.FirstName} ${user?.LastName}`;
    }
    return userName;
  }

  loadUser() {
    this.serviceUser.getAllUserCheckStatus().subscribe((data: any) => {
      this.listUser = data.value.filter(
        (item: any) => item.UserName !== undefined
      );
    });
    this.serviceUser
      .getUserByIds(this.userLogged.getCurrentUser().userId)
      .subscribe((data) => {
        this.detailUser = data.value[0] as User;
      });
    this.roleUserService.getAllRole().subscribe((data: any) => {
      this.listRoleUser = data.value;
    });
  }

  onInputComment(value: any) {
    const key = value.key;
    const event = value.value;
    const data = { ...this.approvedDetail, [key]: event };
    this.approvedDetail = data;
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
  onSubmitApprove(result: ApprovedResultStatus) {
    if (this.idAssigned) {
      let detail = new Approved();
      let userLogged: UserLogged = new UserLogged();
      detail.ObjectId = this.idAssigned as number;
      detail.ObjectType = ApprovedObjectType.MEMBERAPPROVALMOVIE;
      detail.Result = result;
      detail.ProcessedBy = userLogged.getCurrentUser().userId;
      detail.ProcessedAt = new Date();
      detail.Comment = this.approvedDetail.Comment;
      this.approvedDetail = detail;
      if (result === ApprovedResultStatus.APPROVED) {
        this.listMovieApprovalDetail.Status = assignedStatus.APPROVE;
      }
      if (result === ApprovedResultStatus.REJECT) {
        this.listMovieApprovalDetail.Status = assignedStatus.REJECT;
      }
      this.listMovieApprovalDetail.Comment = detail.Comment;
      this.service
        .UpdateMovieApproval(this.listMovieApprovalDt, this.idAssigned)
        .subscribe((data) => {});
      this.serviceMovieApprovalDetail
        .UpdateMovieApprovalDetail(
          this.listMovieApprovalDetail,
          this.listMovieApprovalDetail.Id
        )
        .subscribe((data) => {
          this.serviceApproved
            .CreateApprove(this.approvedDetail)
            .subscribe((data) => {
              this.aprovedTimes = this.aprovedTimes + 1;

              this.listRoleUser.forEach((element: UserRole) => {
                let Title = '';
                let Detail = '';

                if (result === ApprovedResultStatus.APPROVED) {
                  Title = `Thành viên trong hội đồng đã duyệt phim`;
                  Detail = `Thành viên <strong>${
                    this.detailUser.FirstName + ' ' + this.detailUser.LastName
                  }</strong> trong hội đồng đã phê duyệt bộ phim <strong>${
                    this.getName
                  }</strong>.`;
                }
                if (result === ApprovedResultStatus.REJECT) {
                  Title = `Thành viên trong hội đồng đã từ chối duyệt phim`;
                  Detail = `Thành viên <strong>${
                    this.detailUser.FirstName + ' ' + this.detailUser.LastName
                  }</strong> trong hội đồng đã từ chối duyệt bộ phim <strong>${
                    this.getName
                  }</strong>.`;
                }
                this.notifyService
                  .CreateNotify(
                    element.UserId,
                    result === ApprovedResultStatus.APPROVED
                      ? NotifyActionType.APPROVE
                      : NotifyActionType.REJECT,
                    NotifyObjectType.MOVIEAPPROVAL,
                    this.idAssigned,
                    Title,
                    Detail
                  )
                  .subscribe();
              });

              if (result === ApprovedResultStatus.APPROVED) {
                this.toastService.success(`${this.handleRenderResult(result)}`);
              }
              if (result === ApprovedResultStatus.REJECT) {
                this.toastService.error(`${this.handleRenderResult(result)}`);
              }
              this.loadAssigned();
            });
        });
    }
  }
}
