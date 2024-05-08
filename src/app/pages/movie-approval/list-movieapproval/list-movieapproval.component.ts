import { Component, OnInit, ViewChild } from '@angular/core';
import {
  EditSettingsModel,
  FilterSettingsModel,
  GridComponent,
  PageSettingsModel,
  SaveEventArgs,
  ToolbarItems,
} from '@syncfusion/ej2-angular-grids';
import { Movieapproval, User } from 'src/app/core/models/database/db.model';
import { MovieApprovalService } from 'src/app/core/services/movie-approval.service';
import { L10n } from '@syncfusion/ej2-base';
import { RequestTypeAction, TopicStatus } from 'src/app/core/utils/constant';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/core/services/user.service';
import { MovieApprovalDetailService } from 'src/app/core/services/movie-approval-detail.service';
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
  },
});
@Component({
  selector: 'app-list-movieapproval',
  templateUrl: './list-movieapproval.component.html',
  styleUrls: ['./list-movieapproval.component.scss'],
})
export class ListMovieapprovalComponent implements OnInit {
  public listMovieApproval: Movieapproval;
  public listUser : User[] =[];
  public enableMaskSupport: boolean = true;
  public fields: Object = { text: 'text', value: 'value' };
  @ViewChild('grid') public grid: GridComponent;
  public listStatus: any[] = [
    { text: 'Tất cả', value:10 },
    { text: 'Chưa duyệt', value: TopicStatus.NOTPROCESS },
    { text: 'Đã duyệt', value: TopicStatus.APPROVE },
    { text: 'Từ chối', value: TopicStatus.REJECT },
  ];
  public movieApprovalDetail: Movieapproval;
  public editSettings: EditSettingsModel;
  public pageSettings: PageSettingsModel;
  public toolbarOptions: ToolbarItems[];
  public filterOptions: FilterSettingsModel = {
    ignoreAccent: true,
    showFilterBarStatus: false,
  };
  constructor(
    public service: MovieApprovalService,
    public readonly router: Router,
    private readonly serviceMovieApprovalDetail : MovieApprovalDetailService,
    private readonly userService : UserService,
    public toastService: ToastrService,
    private readonly route: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.listMovieApproval = new Movieapproval();
    this.loadMovieApproved();
    this.toolbarOptions = ['Edit'];
    this.editSettings = {
      allowEditing: true,
      allowAdding: true,
      allowDeleting: true,
    };
  }
  loadMovieApproved() {
    this.userService
    .getListUserByQuery(
      '$Select=Id, FirstName, LastName, UserName, Email, Tel&$Filter=Status eq 1'
    )
    .subscribe((data) => {
      this.listUser = data.value;
    });
    this.service.getApproval().subscribe((data) => {
      // console.log(this.listMovieApproval);
      const transformedData = data.value.map(
        (movieApproval: Movieapproval) => ({
          Id: movieApproval.Id,
          StartAt: movieApproval.StartAt,
          EndAt: movieApproval.EndAt,
          Comment: movieApproval.Comment,
          No: movieApproval.No,
          Suggested: movieApproval.Suggested,
          Status: movieApproval.Status,
          CreatedBy : movieApproval.PostProductionPlaning.PreProduction.CreatedBy,
          postProduction:
            movieApproval.PostProductionPlaning.PreProduction.Name,
        })
      );
      this.listMovieApproval = transformedData;
    });
  }
  onChangeTitle(args: any): void {
    this.grid.filterByColumn(
      'PostProductionPlaning.PreProduction.Name',
      'equal',
      args.value
    );
  }
  onChange4(args: any): void {
    this.grid.filterByColumn('EndAt', 'equal', args.value);
  }
  onChange5(args: any): void {
    this.grid.filterByColumn('StartAt', 'equal', args.value);
  }
  onChange(args: any): void {
    if(args.value == 10){
      this.grid.clearFiltering();
    }
    else this.grid.filterByColumn('Status', 'equal', args.value);
  }
  handleRenderMember(MemberId: number) {
    let userName: any = '';
    if (MemberId) {
      const user = this.listUser.find((item) => item.Id === MemberId);
      userName = `${user?.FirstName} ${user?.LastName}`;
    }
    return userName;
  }
  rederStatus(data: Movieapproval) {
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
  actionBegin(args: SaveEventArgs) {
    if (args.requestType === RequestTypeAction.BEGINEDIT) {
      const Id = (args.rowData as any).Id;
      this.router.navigate(['./edit', Id], {
        relativeTo: this.route,
      });
    }

    if (args.requestType === 'delete') {
      // const x = (args.data as any)[0].Id;
      // const isConfirmed = confirm(`Bạn có muốn xóa không?`);
      // if (isConfirmed) {
      //   if ((args.data as any)[0].Status == 3) {
      //     args.cancel = true;
      //     this.toastService.error('Đã duyệt, không thể xoá!', 'Thất bại');
      //   } else {
      //     this.service.DeleteMovieApproved(x).subscribe((data) => {
      //       this.serviceMovieApprovalDetail.getAllMovieApprovalDetailById(x).subscribe((data) => {
      //         console.log(data.value);
      //       })
      //       this.toastService.success('Xóa thàng công!', 'Thành công');
      //     });
      //   }
      // }
    }
  }
}
