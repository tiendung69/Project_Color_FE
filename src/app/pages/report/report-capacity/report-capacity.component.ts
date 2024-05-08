import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from 'src/app/core/models/database/db.model';
import { UserService } from 'src/app/core/services/user.service';
import * as XLSX from 'xlsx';
import { Query } from '@syncfusion/ej2-data';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { ToolbarItems, FilterSettingsModel, GridComponent, ExcelQueryCellInfoEventArgs } from '@syncfusion/ej2-angular-grids';
import { ReportRepacityService } from 'src/app/core/services/report-repacity.service';

@Component({
  selector: 'app-report-capacity',
  templateUrl: './report-capacity.component.html',
  styleUrls: ['./report-capacity.component.scss']
})
export class ReportCapacityComponent implements OnInit {
  query: Query;
  listData: any[] = [];
  filterStartDate: any;
  filterEndDate: Date | undefined;
  TotalSize:any;
  UseSize: any;
  AllUseSize: any;
  NumberFiles: any;
  NumberUsers: any;
  public toolbarOptions: ToolbarItems[] = ['ExcelExport'];
  public filterSetting: FilterSettingsModel = {
    showFilterBarStatus: false,
    immediateModeDelay: 500,
  };
  excelHeaders:string[] = ["Header ne"];
templateToExcel:string[][] = [this.excelHeaders,[]];
  public check = false;
  @ViewChild('grid') public grid: GridComponent;

  constructor(
    private readonly service: UserService,
    private router: Router,
    private serviceReport: ReportRepacityService
  ) {}

  ngOnInit(): void {}

  getReportByFilter(): void {
    this.check = true;
    if (this.filterStartDate) {
      const startDate = this.formatDate(this.filterStartDate[0]);
      const endDate = this.formatDate(this.filterStartDate[1]);
      this.serviceReport.getAll(startDate, endDate).subscribe(
        (res: any) => {
          this.TotalSize = res.TotalSize;
          this.AllUseSize = res.AllUseSize;
          this.UseSize = res.UseSize;
          this.NumberFiles = res.NumberFiles;
          this.NumberUsers = res.NumberUsers;
          this.listData = res;
        },
        (error: any) => {
          console.error('Error fetching report data:', error);
        }
      );
    } else {
      this.serviceReport.getAll('2023-01-01', '2025-01-01').subscribe(
        (res: any) => {
          this.TotalSize = res.TotalSize;
          this.AllUseSize = res.AllUseSize;
          this.UseSize = res.UseSize;
          this.NumberFiles = res.NumberFiles;
          this.NumberUsers = res.NumberUsers;
          this.listData = res;
        },
        (error: any) => {
          console.error('Error fetching report data:', error);
        }
      );
    }
  }

  excelQueryCellInfo(args: ExcelQueryCellInfoEventArgs): void {}

  formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  }

  onChangeStartDate(args: any): void {
    this.filterStartDate = args.value;
  }

  exportExcel(): void {
    const dataToExport = [
      {
      'Tổng dung lượng': this.formatData(this.TotalSize) || 0,
      'Dung lượng còn lại': this.formatData(this.TotalSize - this.AllUseSize) || 0,
      'Dung lượng đã upload':this.formatData(this.UseSize) || 0,
      'Số lượng file': this.formatData(this.NumberFiles) || 0,
      'Số lượng user upload': this.formatData(this.NumberUsers) || 0
    }];
  // const wss: XLSX.WorkSheet=XLSX.utils.aoa_to_sheet(this.templateToExcel);
    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    
    XLSX.writeFile(wb, 'Report-capacity.xlsx');
  }
  
  formatData(data:any){
    if (data && data < 1024 * 1024) {
      return (data/ 1024).toFixed(1) + 'Kb';
    } else if (data && data < 1024 * 1024 * 1024) {
      return (data / (1024 * 1024)).toFixed(1) + 'MB';
    } else if (data && data >= 1024 * 1024 * 1024) {
      return (data / (1024 * 1024 * 1024)).toFixed(1) + 'GB';
    } else {
      return '';
    }
  }
}
