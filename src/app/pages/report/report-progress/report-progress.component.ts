import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from 'src/app/core/models/database/db.model';
import { UserService } from 'src/app/core/services/user.service';
import {
  Query,
  DataManager,
  ODataAdaptor,
  ODataV4Adaptor,
} from '@syncfusion/ej2-data';
import { environment } from 'src/environments/environment';
import { CustomService } from 'src/app/core/services/custom.service';
import { Router } from '@angular/router';
import {
  ExcelExportProperties,
  ExcelQueryCellInfoEventArgs,
  FilterSettingsModel,
  GridComponent,
  PageSettingsModel,
  ToolbarItems,
} from '@syncfusion/ej2-angular-grids';
import { PlanStatus } from 'src/app/core/utils/constant';
@Component({
  selector: 'app-report-progress',
  templateUrl: './report-progress.component.html',
  styleUrls: ['./report-progress.component.scss'],
})
export class ReportProgressComponent implements OnInit {
  public listUser: Array<any> = [];
  filterStartDate: any;
  filterEndDate: any;
  filterDirector: any;
  filterEstimatedStartDate: any;
  filterEstimatedEndDate: any;
  filterStatus : any;
  filterStatusFilm : any;
  query: Query;
  listData: any;
  public dropdownField = { text: 'UserName', value: 'UserName' };
  @ViewChild('grid') public grid: GridComponent;
  public field ={text :'text',value:'value'}
  public loadingIndicator: any = { indicatorType: 'Shimmer' };
  public toolbarOptions: ToolbarItems[] = ['ExcelExport'];
  public value: any;
  public value1: any;
  public value2: any;
  filterProgress : any;
  public filterOptions: FilterSettingsModel = {
    // mode: 'Immediate',
    // type: 'Menu',
    showFilterBarStatus: true,
    immediateModeDelay: 500,
  };
  listStatusFilm = [
    { text: 'Phim bị từ chối đóng', value: PlanStatus.APPROVEPREPRODUCTIONREJECT },
    { text: 'Phim đã đóng', value: PlanStatus.APPROVEPREPRODUCTION},
    { text: 'Phim đang chờ duyệt đóng', value: PlanStatus.WAITAPPROVE },
    { text: 'Phim đang chờ duyệt', value: PlanStatus.INPROCRESS },
    { text: 'Phim bị từ chối', value: PlanStatus.REJECT },
    { text: 'Phim chưa được duyệt', value: PlanStatus.NOTPROCESS },
  ]
  listStatus = [
    { text: 'Đề cương chưa duyệt', value: 0 },
    { text: 'Đề cương đang chờ duyệt', value: 1},
    { text: 'Đề cương bị từ chối', value: 2 },
    { text: 'Đề cương đã được duyệt', value: 3 },
  ]
  fields = {text :'text',value:'value'}
  public listProgress = [
    {text :'Dưới 50%',value:-1},
    {text :'Từ 50% - 80%',value:2},
    {text :'Trên 80%',value:1},
  ]
  public pageSettings?: PageSettingsModel = {
    pageSize: 10,
    pageCount: 4,
    pageSizes: [10, 20, 50, 100],
  };
  public filterSetting: FilterSettingsModel = {
    // mode: 'Immediate',
    // type: 'Menu',
    showFilterBarStatus: false,
    immediateModeDelay: 500,
  };
  constructor(private readonly service: UserService, private router: Router) {}
  ngOnInit(): void {
    this.loadUser();
  }
  onChangeProgress(args : any){
    this.filterProgress = args.value;
  }
  onChangeStatus(event: any) {
    this.filterStatus = event.value;
  }
  onChangeStatusFilm(event: any) {
    this.filterStatusFilm = event.value;
  }

  getReportByFilter() {
    this.query = new Query();
    this.query.where('Type', 'equal', 1);
 //  this.query.where('TopicName', 'ne', null);
    if(this.filterStatus>=0) {
      this.query.where('TopicStatus', 'equal', this.filterStatus);
    }
    if(this.filterStatusFilm != undefined) {
      this.query.where('PreProductionPlanStatus', 'equal', this.filterStatusFilm);
    }
    if (this.filterDirector) {
      this.query.where('UserName', 'equal', this.filterDirector);
    }
    if (this.filterEstimatedStartDate) {
      this.query.where(
        'MinEstimatedBegin',
        'greaterthanorequal',
        this.filterEstimatedStartDate[0]
      );
      this.query.where(
        'MinEstimatedBegin',
        'lessthanorequal',
        this.filterEstimatedStartDate[1]
      );
    }
    if(this.filterProgress){
      if(this.filterProgress == -1){
      this.query.where('TotalProgress','greaterthanorequal', 0);
      this.query.where('TotalProgress','lessthanorequal', 50);
      }
      if(this.filterProgress == 2){
        this.query.where('TotalProgress','greaterthanorequal', 50);
        this.query.where('TotalProgress','lessthanorequal', 80);
      }
      if(this.filterProgress == 1){
        this.query.where('TotalProgress','greaterthanorequal', 80);
      }
    }
    if (this.filterEstimatedEndDate) {
      this.query.where(
        'EstimatedEnd',
        'greaterthanorequal',
        this.filterEstimatedEndDate[0]
      );
      this.query.where(
        'EstimatedEnd',
        'lessthanorequal',
        this.filterEstimatedEndDate[1]
      );
    }
    if (this.filterStartDate) {
      this.query.where(
        'PostProductionFromDate',
        'greaterthanorequal',
        this.filterStartDate[0]
      );
      this.query.where(
        'PostProductionFromDate',
        'lessthanorequal',
        this.filterStartDate[1]
      );
    }
    if (this.filterEndDate) {
      this.query.where(
        'PostProductionToDate',
        'greaterthanorequal',
        this.filterEndDate[0]
      );
      this.query.where(
        'PostProductionToDate',
        'lessthanorequal',
        this.filterEndDate[1]
      );
    }

    this.listData = new DataManager(
      { url: environment.apiUrl + '/ReportProgresses' },
      this.query,
      new CustomService(this.router)
    );
  }
  loadUser() {
    this.service.getAllUser().subscribe((data) => {
      this.listUser = data.value;
    });
  }
  calculateDayDifference(field: string, row: any, column: any) {
    if (row.PostProductionToDate && row.EstimatedEnd) {
      const postProductionDate = new Date(row.PostProductionToDate);
      const estimatedEndDate = new Date(row.EstimatedEnd);

      const timeDifference = postProductionDate.getTime() - estimatedEndDate.getTime();
      this.value1 = Math.abs(Math.floor(timeDifference / (1000 * 3600 * 24)));
      if(postProductionDate < estimatedEndDate){
        this.value1 = this.value1 * -1;
      }
      return this.value1 + " ngày";
    } else {
      return "0 ngày";
    }
  }

  onChangeEstimatedStartDate(args: any) {
    this.filterEstimatedStartDate = args.value;
  }
  onChangeDirector(args: any) {
    this.filterDirector = args.value;
  }
  onChangeEstimatedEndDate(args: any) {
    this.filterEstimatedEndDate = args.value;
  }
  onChangeStartDate(args: any) {
    this.filterStartDate = args.value;
  }
  onChangeEndDate(args: any) {
    this.filterEndDate = args.value;
  }
  queryCellInfo(args: ExcelQueryCellInfoEventArgs): void {

  }
  renderStatus(status: any, type: any) {
    if (type == 0) {
      switch (status) {
        case 0:
          return 'Đề tài chưa duyệt';
          break;
        case 1:
          return 'Đề tài đang chờ duyệt';
          break;
        case 2:
          return 'Đề tài bị từ chối';
          break;
        case 3:
          return 'Đề tài đã được duyệt';
          break;
        default:
          return '';
      }
    }
    if (type == 1) {
      switch (status) {
        case 0:
          return 'Đề cương chưa duyệt';
          break;
        case 1:
          return 'Đề cương đang chờ duyệt';
          break;
        case 2:
          return 'Đề cương bị từ chối';
          break;
        case 3:
          return 'Đề cương đã được duyệt';
          break;
        default:
          return '';
      }
    }
    return 0;
  }
  renderType(type: any) {
    if (type == 0) {
      return 'Đề tài';
    }
    if (type == 1) {
      return 'Đề cương';
    }
    return 0;
  }
  toolbarClick(args: any): void {
    if (args.item.id === 'DefaultExport_excelexport') {
      const excelExportProperties: ExcelExportProperties = {
        fileName: 'Báo cáo tiến độ sản xuất phim.xlsx',
        header: {
          headerRows: 3,
          rows: [
            {
              cells: [
                {
                  colSpan: 15,
                  value: 'Báo cáo tiến độ sản xuất phim',
                  style: {
                    fontColor: '#000000',
                    fontSize: 20,
                    hAlign: 'Center',
                    bold: true,
                  },
                },
              ],
            },
          ],
        },
      };
      (this.grid as GridComponent).excelExport(excelExportProperties);
    }
  }

  excelQueryCellInfo(args: ExcelQueryCellInfoEventArgs): void {}

  public valueAccessor(field: string, row: any, column: any) {
    switch (row[field]) {
      case 0:
        return 'Đề cương chưa duyệt';
        break;
      case 1:
        return 'Đề cương đang chờ duyệt';
        break;
      case 2:
        return 'Đề cương bị từ chối';
        break;
      case 3:
        return 'Đề cương đã được duyệt';
        break;
      default:
        return '';
    }
  }
  renderUser(id: any) {
    let userName: any = '';
    if (id) {
      const user = this.listUser.find((item) => item.Id === id);
      userName = `${user?.FirstName} ${user?.LastName}`;
    }
    return userName;
  }
  valueAccessorFilm(field: string, row: any, column: any) {
    switch (row[field]) {
      case PlanStatus.APPROVEPREPRODUCTIONREJECT:
        return 'Phim bị từ chối đóng ';
      case PlanStatus.APPROVEPREPRODUCTION:
        return 'Phim đã đóng';
      case PlanStatus.WAITAPPROVE:
        return 'Phim đang chờ duyệt đóng';
      case PlanStatus.APPROVE:
        return 'Phim đã được duyệt';
      case PlanStatus.INPROCRESS:
        return 'Phim đang chờ duyệt';
      case PlanStatus.REJECT:
        return 'Phim bị từ chối';
      case PlanStatus.NOTPROCESS:
        return 'Phim chưa được duyệt';
      default:
        return '';
    }
  }
  renderStatusFilm(status: any) {
    switch (status) {
      case PlanStatus.APPROVEPREPRODUCTIONREJECT:
        return 'Phim bị từ chối đóng ';
      case PlanStatus.APPROVEPREPRODUCTION:
        return 'Phim đã đóng';
      case PlanStatus.WAITAPPROVE:
        return 'Phim đang chờ duyệt đóng';
      case PlanStatus.APPROVE:
        return 'Phim đã được duyệt';
      case PlanStatus.INPROCRESS:
        return 'Phim đang chờ duyệt';
      case PlanStatus.REJECT:
        return 'Phim bị từ chối';
      case PlanStatus.NOTPROCESS:
        return 'Phim chưa được duyệt';
      default:
        return '';
    }
  }
  valueAccessorUser(field: string, row: any, column: any) {
    let userName: any = '';
    if (row[field] != undefined) {
      this.service.getAllUser().subscribe((data) => {
        this.listUser = data.value;
        this.listUser;

        const user = this.listUser.find((item) => item.Id === row[field]);
        userName = `${user?.FirstName} ${user?.LastName}`;
      });
    } else {
      userName = '';

      return userName;
    }
  }


}
