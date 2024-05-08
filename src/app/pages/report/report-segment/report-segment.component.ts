import { Component, OnInit, ViewChild } from '@angular/core';
import {
  ExcelQueryCellInfoEventArgs,
  SaveEventArgs,
  FilterSettingsModel,
  GridComponent,
  PageSettingsModel,
  ToolbarItems,
  ExcelExportProperties,
} from '@syncfusion/ej2-angular-grids';
import { CommoncategoryConverter, PreproductionSegment } from 'src/app/core/models/database/db.model';
import { PreSegmentService } from 'src/app/core/services/pre-segment.service';
import { environment } from 'src/environments/environment';
import { L10n } from '@syncfusion/ej2-base';
import {
  Query,
  DataManager,
  ODataAdaptor,
  ODataV4Adaptor,
} from '@syncfusion/ej2-data';
import { CustomService } from 'src/app/core/services/custom.service';
import { Router } from '@angular/router';
import { CommoncategoryService } from 'src/app/core/services/commoncategory.service';
import { CommonCategoriesType } from 'src/app/core/utils/constant';
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
  },
});
@Component({
  selector: 'app-report-segment',
  templateUrl: './report-segment.component.html',
  styleUrls: ['./report-segment.component.scss'],
})
export class ReportSegmentComponent implements OnInit {
  public filterStartDate: any;
  public filterEndDate: any;
  public listData: any;
  public urls: any;
  public query: Query;
  public listSegment: any;
  filterRealStartDate: any;
  public listCommnue: Array<any>=[];
  public listDistrict : Array<any>=[];
  public listProvince :Array<any>=[];
  public listValue : Array<any>=[];
  filterRealEndDate: any;
  public filterProvince : any;
  public filterDistrict : any;
  public filterCommune:any;
  public filterStatus : any;
  field : Object ={text :'Name',value:'Name'}
  @ViewChild('grid') public grid: GridComponent;
  public loadingIndicator: any = { indicatorType: 'Shimmer' };
  
  public toolbarOptions: ToolbarItems[] = ['ExcelExport'];
  public listStatus =[
    {text :'Đang tiến hành',value:1},
    {text :'Hoàn thành',value:3},
    {text :'Chưa tiến hành',value:0},
  ]
  fields = {text :'text',value:'value'}
  filterProgress : any;
  public listProgress = [
    {text :'Dưới 50%',value:-1},
    {text :'Từ 50% - 80%',value:2},
    {text :'Trên 80%',value:1},
  ]
  constructor(
    private readonly service: PreSegmentService,
    private readonly serviceCate : CommoncategoryService,
    private router: Router
  ) {}
  public filterOptions: FilterSettingsModel = {
    // mode: 'Immediate',
    // type: 'Menu',
    showFilterBarStatus: false,
    immediateModeDelay: 500,
  };
  public pageSettings?: PageSettingsModel = {
    pageSize: 10,
    pageCount: 4,
    pageSizes: [10, 20, 50, 100],
  };
  ngOnInit(): void {
    this.loadCate();
    // this.loadReport();
  }
  onActionBegin(args: any): void {
    if (args.requestType === 'excelExport') {
      args.dataCollections = this.grid.getCurrentViewRecords();
    }
  }
  // loadReport(){
  //   this.service.getAddSegment().subscribe(res =>{
  //     this.listSegment = res.value;
  //   })
  // }
  public exportQueryCellInfo(args: ExcelQueryCellInfoEventArgs): void {}
  getReportByFilter() {
    this.query = new Query();
    //this.query.expand('PreProduction,PreproductionProgresses');
    if (this.filterRealStartDate) {
    this.query.where('StartDate' ,'greaterthanorequal', this.filterRealStartDate[0]);
    this.query.where('StartDate','lessthanorequal',this.filterRealStartDate[1]);
    }
    if(this.filterRealEndDate){
      this.query.where('EndDate','greaterthanorequal',this.filterRealEndDate[0]);
      this.query.where('EndDate','lessthanorequal',this.filterRealEndDate[1]);
    }
    if (this.filterStartDate) {
      this.query.where('EstimatedStartDateSegment', 'greaterthanorequal', this.filterStartDate[0]);
      this.query.where('EstimatedStartDateSegment', 'lessthanorequal', this.filterStartDate[1]);
    }
    if (this.filterEndDate) {
      this.query.where('EstimatedEndDateSegment', 'greaterthanorequal', this.filterEndDate[0]);
      this.query.where('EstimatedEndDateSegment', 'lessthanorequal', this.filterEndDate[1]);
    }
    if(this.filterProvince){
      this.query.where('ProvinceId', 'equal', this.filterProvince);
    }
    if(this.filterDistrict){
      this.query.where('DistrictId','equal',this.filterDistrict);
    }
    if(this.filterCommune){
      this.query.where('CommuneId','equal',this.filterCommune);
    }
    if(this.filterStatus){  
      this.query.where('StatusProgress','equal',this.filterStatus);
    }
    if(this.filterProgress){
      if(this.filterProgress == -1){
      this.query.where('SegmentProgress','greaterthanorequal', 0);
      this.query.where('SegmentProgress','lessthanorequal', 50);
      }
      if(this.filterProgress == 2){
        this.query.where('SegmentProgress','greaterthanorequal', 50);
        this.query.where('SegmentProgress','lessthanorequal', 80);
      }
      if(this.filterProgress == 1){
        this.query.where('SegmentProgress','greaterthanorequal', 80);
      }
    }

    this.listSegment = new DataManager(
      { url: environment.apiUrl + '/ReportSegments' },
      this.query,
      new CustomService(this.router)
    );
    console.log(this.listSegment);
  }
  onChangeStartDate(args: any) {
    this.filterStartDate = args.value;
  }
  onChangeRealStartDate(args: any) {
    this.filterRealStartDate = args.value;
  }
  onChangeProgress(args : any){
    this.filterProgress = args.value;
  }
  onChangeStatus(args : any){
     this.filterStatus = args.value;
     console.log("status",this.filterStatus);
  }
  onChangeRealEndDate(args: any) {
    this.filterRealEndDate = args.value;
  }
  onChangeProvince(args: any ) {
    this.filterProvince = args.value;
    console.log(this.filterProvince);                                                             
  }
  onChangeDistrict(args :any ){ 
    this.filterDistrict = args.value;
  }
  onChangeCommune(args : any){
     this.filterCommune  = args.value;
  }
  renderStatus(args: any) {
    switch (args) {
      case '3':
        return 'Hoàn thành';
      case '1':
        return 'Đang tiến hành';
      case '0':
        return 'Chưa tiến hành';
        default:
          return '';
    }
  }
  onChangeEndDate(args: any) {
    this.filterEndDate = args.value;
  }
  toolbarClick(args: any): void {
    if (args.item.id === 'DefaultExport_excelexport') {
        const excelExportProperties: ExcelExportProperties = {
          fileName: 'Báo cáo phân đoạn.xlsx',
          header: {
            headerRows: 3,
            rows: [
              {
                cells: [
                  {
                    colSpan: 15,
                    value: 'Báo cáo phân đoạn sản xuất phim',
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
//  }
loadCate(){
  this.serviceCate.getCateByType(CommonCategoriesType.COMMUNE).subscribe(res =>{
    this.listCommnue =  res.value;
  })
   this.serviceCate.getCateByType(CommonCategoriesType.PROVINCE).subscribe(res =>{
     this.listProvince =  res.value;
   })
   this.serviceCate.getCateByType(CommonCategoriesType.DISTRICTS).subscribe(res =>{
     this.listDistrict =  res.value;
   })
}
valueAccessorStatus(field: string, row: any, column: any) {
  switch (row[field]) {
    case 3:
      return 'Hoàn thành';
    case 1:
      return 'Đang tiến hành';
    case 0:
      return 'Chưa tiến hành';
      default:
        return 'Chưa tiến hành';
  }
}
}
