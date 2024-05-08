import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Approved, Movieapproval, MovieapprovalDetail, User, Video } from 'src/app/core/models/database/db.model';
import { ApprovedService } from 'src/app/core/services/approve.service';
import { MovieApprovalDetailService } from 'src/app/core/services/movie-approval-detail.service';
import { MovieApprovalService } from 'src/app/core/services/movie-approval.service';
import { NotifyService } from 'src/app/core/services/notify.service';
import { UserRoleService } from 'src/app/core/services/user-role.service';
import { UserService } from 'src/app/core/services/user.service';
import { VideoService } from 'src/app/core/services/video.service';
import { ApprovedObjectType, ApprovedResultStatus } from 'src/app/core/utils/constant';
import { UserLogged } from 'src/app/core/utils/userLogged';

@Component({
  selector: 'app-result-approval-detail',
  templateUrl: './result-approval-detail.component.html',
  styleUrls: ['./result-approval-detail.component.scss']
})
export class ResultApprovalDetailComponent implements OnInit {
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
  isCollapsed2 = true;
  getName: any;
  idMovieApproval: any;
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
  ) {}
  ngOnInit(): void {
    this.loadUser();
    this.idAssigned = this.route.snapshot.paramMap.get('id');
    this.approvedDetail = new Approved();
    this.listMovieApprovalDt = new Movieapproval();
    this.loadAssigned();
  }
  loadAssigned() {
      this.service.getMovieApprovalbyId(this.idAssigned).subscribe((data) => {
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
         console.log(this.listMovieApprovalDetail);
        });
    
    let userLogged: UserLogged = new UserLogged();
    console.log("Id : ",this.idAssigned);
    this.serviceApproved
    .getListApprovedByQuery(
      `$Filter=ObjectType eq 7 and ObjectId eq ${this.idAssigned}`
    )
    .subscribe((data) => {
      this.listApproved = data.value;
      this.approvedHistory = data.value;
    //   console.log('aaaa', this.listApproved);
      this.aprovedTimes = data.value.length;
      const sortedList = data.value.sort((a: Approved, b: Approved) => {
        // @ts-ignore
        return new Date(b.ProcessedAt) - new Date(a.ProcessedAt);
      });
      this.cdr.detectChanges();

      this.approvedDetail = sortedList[0];
      console.log("details",this.approvedDetail)
    });

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

}
