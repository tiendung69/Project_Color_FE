import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MaskedDateTimeService } from '@syncfusion/ej2-angular-calendars';
import { EditSettingsModel, GridComponent, PageSettingsModel, SaveEventArgs, ToolbarItems } from '@syncfusion/ej2-angular-grids';
import { Movieapproval, MovieapprovalDetail } from 'src/app/core/models/database/db.model';
import { MovieApprovalService } from 'src/app/core/services/movie-approval.service';
import { RequestTypeAction, TopicStatus } from 'src/app/core/utils/constant';
import { UserLogged } from 'src/app/core/utils/userLogged';
import { L10n } from '@syncfusion/ej2-base';
// L10n.load({
//   'en-US': {
//     grid: {
//       Edit: 'Xem',
//     },
//   }
// });

@Component({
  selector: 'app-result-approval',
  templateUrl: './result-approval.component.html',
  styleUrls: ['./result-approval.component.scss'],
  providers: [MaskedDateTimeService],
})
export class ResultApprovalComponent implements OnInit{
  public listFilmApproval : Array<any>=[];
  private userLogged = new UserLogged();
  public toobarOptions : ToolbarItems[] = [];
  public enableMaskSupport: boolean = true;
  public fields : Object = {text:'text', value:'value'}; 
  @ViewChild('grid') public grid :GridComponent;
  public listStatus: any[] = [
    {text:'Tất cả', value:10},
    {text:'Chưa duyệt', value:TopicStatus.NOTPROCESS},
    {text:'Đã duyệt', value:TopicStatus.APPROVE},
    {text:'Từ chối', value:TopicStatus.REJECT},
  ]
  public editSettings : EditSettingsModel = {
    allowEditing : true,
  }
  public pagingSettings : PageSettingsModel;
  ngOnInit(): void {
  this.loadApprovedFilm();
  }
constructor(private readonly service : MovieApprovalService, 
     public readonly router: Router,
  private readonly route: ActivatedRoute,) {}
loadApprovedFilm(){
  this.service.getMovieApprovalbyIdUser(this.userLogged.getCurrentUser().userId).subscribe((data) =>{
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
    this.listFilmApproval = transformedData;
    console.log(this.listFilmApproval)
  })
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
onChange(args: any): void{
  if(args.value== 10){
    this.grid.clearFiltering();
  }
  else this.grid.filterByColumn('Status','equal',args.value);
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
}
