import { Component,OnInit, ViewChild } from '@angular/core';
import { User } from 'src/app/core/models/database/db.model';
import { UserService } from 'src/app/core/services/user.service';
import { Query, DataManager,   ODataAdaptor,
  ODataV4Adaptor} from '@syncfusion/ej2-data';
import { environment } from 'src/environments/environment';
import { CustomService } from 'src/app/core/services/custom.service';
import { Router } from '@angular/router';
import { ExcelExportProperties, ExcelQueryCellInfoEventArgs, FilterSettingsModel, GridComponent, PageSettingsModel, ToolbarItems } from '@syncfusion/ej2-angular-grids';
@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit{
  public listUser : User;
  dropdownBudget =[
    {text:'Dưới 1 tỷ' ,value: -1},
    {text: 'Từ 1 đến 3 tỷ' ,value: 2},
    {text: 'Trên 3 tỷ' ,value: 1},

  ]
  filterStartDate : any;
  filterEndDate : any;
  filterDirector : any;
  filterEstimatedStartDate : any;
  filterEstimatedEndDate : any;
  filterCost : any;
  query : Query;
  filterCost2: any
  listData : any;
  filterDifferenceBudget : any;
  filterPercentDifferenceBudget : any;
  public field= { text: 'text', value: 'value' };
  public dropdownField = { text: 'UserName', value: 'UserName' };
  @ViewChild('grid') public grid: GridComponent;
  public loadingIndicator: any = { indicatorType: 'Shimmer' };
  public toolbarOptions: ToolbarItems[] = ['ExcelExport'];
  public filterOptions: FilterSettingsModel = {
    // mode: 'Immediate',
    // type: 'Menu',
    showFilterBarStatus: true,
    immediateModeDelay: 500,

};
public listProgress = [
  {text :'Dưới 50%',value:-1},
  {text :'Từ 50% - 80%',value:2},
  {text :'Trên 80%',value:1},
]
public listPercentDifference = [
  {text :'Dưới 200 triệu',value:-1},
  {text :'Từ 200 triệu - 500 triệu',value:2},
  {text :'Trên 500 triệu',value:1},
]
public pageSettings?: PageSettingsModel = {
  pageSize: 10,
  pageCount: 4,
  pageSizes: [10, 20, 50, 100],
};
  constructor(private readonly service : UserService,
    private router: Router){}
  ngOnInit(): void {
    this.loadUser();
  }
  loadUser(){
    this.service.getAllUser().subscribe(data =>{
      this.listUser = data.value;
    })
  }
  onChangeDifferenceBudget(args : any){
    this.filterDifferenceBudget = args.value;
  }
  onChangePercentDifferenceBudget(args : any){
    this.filterPercentDifferenceBudget = args.value;
  }
  getReportByFilter(){
    this.query = new Query();
    //this.query.where('TopicName', '!=', null);
   this.query.where('Type', 'equal', 1);
    if(this.filterDirector){
      this.query.where('UserName', 'equal', this.filterDirector);
    }
    if(this.filterEstimatedStartDate){
      this.query.where('MinEstimatedBegin', 'greaterthanorequal', this.filterEstimatedStartDate[0]);
      this.query.where('MinEstimatedBegin', 'lessthanorequal', this.filterEstimatedStartDate[1]);
    }
    if(this.filterEstimatedEndDate){
      this.query.where('EstimatedEnd', 'greaterthanorequal', this.filterEstimatedEndDate[0]);
      this.query.where('EstimatedEnd', 'lessthanorequal', this.filterEstimatedEndDate[1]);
    }
    if(this.filterStartDate){
      this.query.where('PostProductionFromDate', 'greaterthanorequal', this.filterStartDate[0]);
      this.query.where('PostProductionFromDate', 'lessthanorequal', this.filterStartDate[1]);
    }
    if(this.filterEndDate){
      this.query.where('PostProductionToDate', 'greaterthanorequal', this.filterEndDate[0]);
      this.query.where('PostProductionToDate', 'lessthanorequal', this.filterEndDate[1]);
    }
    if(this.filterCost){
      if(this.filterCost == -1){
      this.query.where('EstimatedBudget', 'greaterthanorequal', 0);
      this.query.where('EstimatedBudget', 'lessthanorequal', 1000000000);
      }
      if(this.filterCost == 2){
        this.query.where('EstimatedBudget', 'greaterthanorequal', 1000000000);
        this.query.where('EstimatedBudget', 'lessthanorequal', 3000000000);
        }
        if(this.filterCost == 1){
          this.query.where('EstimatedBudget', 'greaterthanorequal', 3000000000);

          }
    }
    if(this.filterPercentDifferenceBudget){
      if(this.filterPercentDifferenceBudget == -1){
      this.query.where('ExpenseDifference','lessthanorequal', 200000000);
      }
      if(this.filterPercentDifferenceBudget == 2){
        this.query.where('ExpenseDifference','greaterthanorequal', 200000000);
        this.query.where('ExpenseDifference','lessthanorequal', 500000000);
      }
      if(this.filterPercentDifferenceBudget == 1){
        this.query.where('ExpenseDifference','greaterthanorequal', 500000000);
      }
    }
    if(this.filterDifferenceBudget){
      if(this.filterDifferenceBudget == -1){
      this.query.where('PercentageDifference','greaterthanorequal', -100);
      this.query.where('PercentageDifference','lessthanorequal', 50);
      }
      if(this.filterDifferenceBudget == 2){
        this.query.where('PercentageDifference','greaterthanorequal', 50);
        this.query.where('PercentageDifference','lessthanorequal', 80);
      }
      if(this.filterDifferenceBudget == 1){
        this.query.where('PercentageDifference','greaterthanorequal', 80);
      }
    }
    if(this.filterCost2){
      if(this.filterCost2 == -1){
      this.query.where('SumExpense', 'greaterthanorequal', 0);
      this.query.where('SumExpense', 'lessthanorequal', 1000000000);
      }
      if(this.filterCost2 == 2){
        this.query.where('SumExpense', 'greaterthanorequal', 1000000000);
        this.query.where('SumExpense', 'lessthanorequal', 3000000000);
        }
        if(this.filterCost2 == 1){
          this.query.where('SumExpense', 'greaterthanorequal', 3000000000);

          }
    }
    this.listData = new DataManager(
      {url : environment.apiUrl + '/ReportCosts'},
      this.query, new CustomService(this.router)
    );
  }
  onChangeEstimatedStartDate(args: any) {
    this.filterEstimatedStartDate = args.value;
  }
  onChangeDirector(args : any){
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
  onChangeCost(args: any){
   this.filterCost = args.value;
  }
  onChangeCost2(args: any){
   this.filterCost2 = args.value;
  }
  queryCellInfo(args: ExcelQueryCellInfoEventArgs): void {
  }
  excelQueryCellInfo(args: ExcelQueryCellInfoEventArgs): void {}
  toolbarClick(args: any): void {
    if (args.item.id === 'DefaultExport_excelexport') {
      const excelExportProperties: ExcelExportProperties = {
        fileName: 'Báo cáo chi phí sản xuất phim.xlsx',
        header: {
          headerRows: 3,
          rows: [
            {
              cells: [
                {
                  colSpan: 15,
                  value: 'Báo cáo chi phí sản xuất phim',
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

}

