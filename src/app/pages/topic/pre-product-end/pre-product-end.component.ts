import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EditSettingsModel, PageSettingsModel, SaveEventArgs, ToolbarItems } from '@syncfusion/ej2-angular-grids';
import { PreproductionPlaning } from 'src/app/core/models/database/db.model';
import { PrePlanService } from 'src/app/core/services/pre-plan.service';
import { PlanStatus, RequestTypeAction } from 'src/app/core/utils/constant';

@Component({
  selector: 'app-pre-product-end',
  templateUrl: './pre-product-end.component.html',
  styleUrls: ['./pre-product-end.component.scss']
})
export class PreProductEndComponent implements OnInit {
  public listPlan : PreproductionPlaning;
  public planDetail : PreproductionPlaning;
  public editSettings?: EditSettingsModel;
  public pageSettings?: PageSettingsModel;
  public toolbarOptions: ToolbarItems[] = [ 'Edit'];
  ngOnInit(): void {
    this.loadPlan();
    this.editSettings ={
      allowEditing: true
    }
    this.pageSettings ={pageSize:10}
  }
  constructor( public service : PrePlanService,
    public readonly router: Router,
    private readonly route: ActivatedRoute,){}
    loadPlan(){
      this.service.getAllPlanWithEstimate().subscribe((data) =>{
        this.listPlan = data.value.filter((item: any) => item.Status === 3 || item.Status === 4 || item.Status === -4 || item.Status === 5 );
      });
    }


  actionBegin(args: SaveEventArgs) {
    if (args.requestType === RequestTypeAction.BEGINEDIT) {
      const Id = (args.rowData as any).Id;
      this.router.navigate(['./edit', Id], {
        relativeTo: this.route,
      });
    }

  }
  renderStatus(data: PreproductionPlaning) {
    const status = data.Status;
    switch (status) {
      case PlanStatus.APPROVEPREPRODUCTIONREJECT:
        return 'Sản xuất tiền kỳ bị từ chối';
      case PlanStatus.APPROVEPREPRODUCTION:
        return 'Sản xuất tiền kỳ được duyệt';
      case PlanStatus.APPROVE:
        return 'Đã duyệt và chờ duyệt sản xuất tiền kỳ';
      case PlanStatus.INPROCRESS:
        return 'Đang tiến hành';
      case PlanStatus.REJECT:
        return 'Từ chối';
      case PlanStatus.NOTPROCESS:
        return 'Chưa duyệt';
      default:
        return '';
    }
  }

}
