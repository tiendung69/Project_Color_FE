import { Component, OnInit, ViewChild } from '@angular/core';
import {
  Column,
  EditSettingsModel,
  FilterSettingsModel,
  GridComponent,
  PageSettingsModel,
  SaveEventArgs,
  ToolbarItems,
} from '@syncfusion/ej2-angular-grids';
import {
  Broadcasting,
  PostproductionPlaning,
  PreproductionPlaning,
} from 'src/app/core/models/database/db.model';
import { BroadCastingService } from 'src/app/core/services/broad-casting.service';
import { RolePermissionService } from 'src/app/core/services/role-permission.service';
import { AppRoles, CommonCategoriesType, RequestTypeAction } from 'src/app/core/utils/constant';
import { L10n } from '@syncfusion/ej2-base';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PostProPlanService } from 'src/app/core/services/post-pro-plan.service';
import { PrePlanService } from 'src/app/core/services/pre-plan.service';
import { NgFor } from '@angular/common';
import { MaskedDateTimeService } from '@syncfusion/ej2-angular-calendars';
import { CommoncategoryService } from 'src/app/core/services/commoncategory.service';
import { UserLogged } from 'src/app/core/utils/userLogged';

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
    listbox: {
      noRecordsTemplate: 'Your Custom Text', // provide your own text here
    },
  },
});
@Component({
  selector: 'app-board-casting',
  templateUrl: './board-casting.component.html',
  styleUrls: ['./board-casting.component.scss'],
    providers: [MaskedDateTimeService],

})
export class BoardCastingComponent implements OnInit {
  public listPlan: Array<any> = [];
  public userlogged = new UserLogged();
  public customAttributes?: Object;
  public enableMaskSupport: boolean = true;
  public listBoardCasting: PostproductionPlaning;
  public editSettings: EditSettingsModel;
  public pageSettings: PageSettingsModel;
  parentIdList : Array<any>=[];
  public toolbarOptions: ToolbarItems[] = [];
  @ViewChild('grid', { static: false }) public grid: GridComponent;
  constructor(
    private readonly service: BroadCastingService,
    public readonly router: Router,
    public toastService: ToastrService,
    private serviceCate : CommoncategoryService,
    private readonly route: ActivatedRoute,
    private readonly servicePrePlan: PrePlanService,
    private readonly servicePlan: PostProPlanService,
    public roleRightService: RolePermissionService
  ) {
    if (this.roleRightService.hasRole([AppRoles.DIRECTOR])) {
      this.toolbarOptions = [ 'Edit'];
      this.editSettings = {
        allowEditing: true,
      };
    } else if (this.roleRightService.hasRole([AppRoles.LEADER])) {
      this.editSettings = {
        allowEditing: true,
        allowAdding: false,
      };
    }
  }
  public filterOptions : FilterSettingsModel ={
    ignoreAccent: true,
    showFilterBarStatus: false,
  }
  ngOnInit(): void {
    this.loadBroadCasting();
    this.customAttributes = {class: 'customcss'};
  }
  loadBroadCasting() {
    if (this.roleRightService.hasRole([AppRoles.LEADER])) {
      this.servicePlan.getPostAndBroadCasting().subscribe((data) => {
        const transformedData = data.value.map((postProductionPlaning: PostproductionPlaning) => ({
          Id: postProductionPlaning.Id,
          Preproduction: postProductionPlaning.PreProduction.Name,
          Broadcastings: postProductionPlaning.Broadcastings.map((broadcasting: Broadcasting) => ({
            Duration: broadcasting.Duration,
            Reciever: broadcasting.Reciever,
            BroadCastingTime : broadcasting.BroadcastingTime,
            SubmissionTime : broadcasting.SubmissionTime,
            Channel: broadcasting.Channel ? broadcasting.Channel.Name : 'N/A',
            ParentId : broadcasting.Channel ? broadcasting.Channel.ParentId : 'N/A',
          }))
        }));
        this.listBoardCasting = transformedData;
      });
    }

    if (this.roleRightService.hasRole([AppRoles.DIRECTOR])) {
    this.servicePlan.getPostAndBroadCastingUserId(this.userlogged.getCurrentUser().userId).subscribe((data) => {
      const transformedData = data.value.map((postProductionPlaning: PostproductionPlaning) => ({
        Id: postProductionPlaning.Id,
        Preproduction: postProductionPlaning.PreProduction.Name,
        Broadcastings: postProductionPlaning.Broadcastings.map((broadcasting: Broadcasting) => ({
          Duration: broadcasting.Duration,
          Reciever: broadcasting.Reciever,
          BroadCastingTime : broadcasting.BroadcastingTime,
          SubmissionTime : broadcasting.SubmissionTime,
          Channel: broadcasting.Channel ? broadcasting.Channel.Name : 'N/A',
          ParentId : broadcasting.Channel ? broadcasting.Channel.ParentId : 'N/A',
        }))
      }));
      this.listBoardCasting = transformedData;
    });
  }
    this.serviceCate.getCateByType(CommonCategoriesType.TVSTATION).subscribe((data) =>{
      this.parentIdList = data.value;
    })
  }

  renderVTVT(parentId: number): string {
      const topic: any = this.parentIdList.find((item) => item.Id === parentId);
      return topic ? topic.Name : '';
}
  actionBegin(args: SaveEventArgs) {
    if((args.rowData as any)?.parentItem && args.type === 'edit'){
      const x = (args.rowData as any).parentItem.Id;
      this.router.navigate(['./edit', x], {
        relativeTo: this.route,
      });
    }
    else
    if (args.type === 'edit') {
      const Id = (args.rowData as any).Id;
      this.router.navigate(['./edit', Id], {
        relativeTo: this.route,
      });
    }


  }
  onChange5(args: any): void{
    this.grid.filterByColumn('SubmissionTime','equal',args.value);
  }

  renderName(Id: number): string {
    const name: any = this.listPlan.find((item) => item.Id === Id);

    return name ? name.Name || '' : '';
  }
  onChange4(args: any): void{
    this.grid.filterByColumn('BroadCastingTime','equal',args.value);
  }
  queryCellInfo(args: any): void {
    if (args.column.field == 'Preproduction') {

        args.cell.style.color = 'black';
        args.cell.style.fontWeight = 'bold';
      }
    }
  }

