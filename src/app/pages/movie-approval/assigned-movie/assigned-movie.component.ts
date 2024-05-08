import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MaskedDateTimeService } from '@syncfusion/ej2-angular-calendars';
import {
  EditSettingsModel,
  FilterSettingsModel,
  GridComponent,
  PageSettingsModel,
  SaveEventArgs,
  ToolbarItems,
} from '@syncfusion/ej2-angular-grids';
import {
  Broadcasting,
  Movieapproval,
  MovieapprovalDetail,
  User,
} from 'src/app/core/models/database/db.model';
import { MovieApprovalDetailService } from 'src/app/core/services/movie-approval-detail.service';
import { MovieApprovalService } from 'src/app/core/services/movie-approval.service';
import { UserService } from 'src/app/core/services/user.service';
import { RequestTypeAction, TopicStatus } from 'src/app/core/utils/constant';
import { UserLogged } from 'src/app/core/utils/userLogged';

@Component({
  selector: 'app-assigned-movie',
  templateUrl: './assigned-movie.component.html',
  styleUrls: ['./assigned-movie.component.scss'],
  providers: [MaskedDateTimeService],
})
export class AssignedMovieComponent implements OnInit {
  public listMovieApprovalDt: MovieapprovalDetail;
  public movieApprovalDtDetail: MovieapprovalDetail;
  public listMovieApproval: Array<any> = [];
  public pageSettings: PageSettingsModel;
  public toolbarOptions: ToolbarItems[];
  public listUser: User[];
  public enableMaskSupport: boolean = true;
  public fields : Object = {text:'text', value:'value'}; 
  @ViewChild('grid') public grid :GridComponent;
  public listStatus: any[] = [
    {text:'Tất cả', value:10},
    {text:'Chưa duyệt', value:TopicStatus.NOTPROCESS},
    {text:'Đã duyệt', value:TopicStatus.APPROVE},
    {text:'Từ chối', value:TopicStatus.REJECT},
  ]
  public editSettings: EditSettingsModel;
  public filterOptions : FilterSettingsModel ={
    ignoreAccent: true,
    showFilterBarStatus: false,
  }
  public movieApprovalDetail: Movieapproval;
  public userLogged = new UserLogged();
  constructor(
    public readonly router: Router,
    private readonly route: ActivatedRoute,
    public userService: UserService,
    public serivce: MovieApprovalDetailService,
    public serivceMovie: MovieApprovalService,
  ) {}

  ngOnInit(): void {
    this.loadMovieApproved();
    this.toolbarOptions = [];
    this.editSettings = {
      allowEditing: true,
      allowAdding: true,
      allowDeleting: true,
    };
  }
  onChange(args: any): void{
    if(args.value== 10){
      this.grid.clearFiltering();
    }
    else this.grid.filterByColumn('Status','equal',args.value);
  }
  loadMovieApproved() {
    this.userService
      .getListUserByQuery(
        '$Select=Id, FirstName, LastName, UserName, Email, Tel&$Filter=Status eq 1'
      )
      .subscribe((data) => {
        this.listUser = data.value;
      });
    this.serivceMovie
      .getMovieApprovalbyMember(this.userLogged.getCurrentUser().userId)
      .subscribe((data) => {
        const transformedData = data.value.map((movieApproval : Movieapproval) =>({
          Id : movieApproval.Id,
          StartAt : movieApproval.StartAt,
          EndAt : movieApproval.EndAt,
          Comment : movieApproval.Comment,
          Suggested: movieApproval.MovieapprovalDetails[0].Suggested,
          Status : movieApproval.Status,
          CreatedBy : movieApproval.PostProductionPlaning.PreProduction.CreatedBy,
          postProduction : movieApproval.PostProductionPlaning.PreProduction.Name

        }))
        this.listMovieApproval = transformedData;
      });
  }
  actionBegin(args: SaveEventArgs) {
    if (args.requestType === RequestTypeAction.BEGINEDIT) {
      const Id = (args.rowData as any).Id;
      this.router.navigate(['./edit', Id], {
        relativeTo: this.route,
      });
    }

    if (args.requestType === 'delete') {
    }
  }
  onChange4(args: any): void{
    this.grid.filterByColumn('EndAt','equal',args.value);
  }
  onChange5(args: any): void{
    this.grid.filterByColumn('StartAt','equal',args.value);
  }
  rederStatus(data: MovieapprovalDetail) {
    const status = data.Status;
    switch (status) {
      case 0:
        return 'Chưa duyệt';
      case 1:
        return 'Chờ duyệt';
      case 2:
        return 'Từ chối';
      case 3:
        return 'Đã duyệt';
      default:
        return '';
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
