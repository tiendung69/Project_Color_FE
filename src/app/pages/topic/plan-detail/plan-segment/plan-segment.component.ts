import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EditSettingsModel, GridComponent, PageSettingsModel, SaveEventArgs, ToolbarItems } from '@syncfusion/ej2-angular-grids';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';
import { ToastrService } from 'ngx-toastr';
import { EmitType } from '@syncfusion/ej2-base';
import { PreproductionPlaning, PreproductionSegment, PreproductionsegmentMember } from 'src/app/core/models/database/db.model';
import { CommoncategoryService } from 'src/app/core/services/commoncategory.service';
import { PrePlanService } from 'src/app/core/services/pre-plan.service';
import { PreSegmentMemberService } from 'src/app/core/services/pre-segment-member.service';
import { PreSegmentService } from 'src/app/core/services/pre-segment.service';
import { RolePermissionService } from 'src/app/core/services/role-permission.service';
import { UserService } from 'src/app/core/services/user.service';
import { AppRoles, CommonCategoriesType, RequestTypeAction } from 'src/app/core/utils/constant';

@Component({
  selector: 'app-plan-segment',
  templateUrl: './plan-segment.component.html',
  styleUrls: ['./plan-segment.component.scss']
})
export class PlanSegmentComponent implements OnInit{
  public listSegment : PreproductionSegment;
  public listSegmentMember : PreproductionsegmentMember;
  public segmentMemberDetail : PreproductionsegmentMember;
  public segmentDetail : PreproductionSegment;
  public idSegment: number;
  listUser: Array<any> = [];
  public IdDistrict: any;
  public addressDetail: Array<any> = [];
  public dropdownField: Object = { text: 'Name', value: 'Id' };
  public addressCommune: Array<any> = [];
  public addressDistrict: Array<any> = [];
  public addressCommune1: Array<any> = [];
  public pageSettings : PageSettingsModel;
  public editSettings : EditSettingsModel;
  public toolbarOptions : ToolbarItems[];
  public dropdownUser : Object = { text: 'FirstName', value: 'Id' };
  public addressDistrict1: Array<any> = [];
  public isCollapsed = false;
  public checks = false;
  public idProvince: any;
  public enableForm: boolean = false;
  public enableApprove: boolean = false;
  checkSegmentName= false;
  public listPlan : PreproductionPlaning;
  public isCollapsed1 = true;
  private planId: any;
  public targetElement: HTMLElement;
  public hideDialog: EmitType<object> = () => {
    this.dialog.hide();
  };
  @ViewChild('parentGrid') grid: GridComponent;
  public initilaizeTarget: EmitType<object> = () => {
    this.targetElement = this.container.nativeElement.parentElement;
  };
  @ViewChild('ejDialog') public dialog: DialogComponent;
  // Create element reference for dialog target element.
  @ViewChild('container', { read: ElementRef, static: true }) container:
    | ElementRef
    | any;
  listMember: Array<any> = [];
  constructor(
    public service : PreSegmentService,
    private router: Router,
    private serviceMember : PreSegmentMemberService,
    private route: ActivatedRoute,
    private readonly toastService : ToastrService,
    public serviceUser: UserService,
    public servicePlan : PrePlanService,
    public serviceAddress: CommoncategoryService,
    private readonly cdr : ChangeDetectorRef,
    public roleRightService: RolePermissionService
  ) {
    this.idSegment = route.snapshot.params['segmentId'];
    this.planId = route.snapshot.params['id'];
    if (this.roleRightService.hasRole([AppRoles.DIRECTOR])) {
      this.toolbarOptions = ['Add', 'Edit', 'Delete'];
      this.enableForm = true;
      this.editSettings = {
        allowEditing: true,
        allowAdding: true,
        allowDeleting: true,
        mode: 'Dialog',
      };

    } else if (this.roleRightService.hasRole([AppRoles.LEADER])) {
      this.enableApprove = true;
      this.editSettings = {
        allowEditing: true,
        allowAdding: false,
        allowDeleting: false,
        mode: 'Dialog',
      };

    }
  }
  ngOnInit(): void {
 //  this.listSegment = new PreproductionSegment();
    this.loadSegment();
    this.loadUser();
    this.loadAddress();
    this.loadAddressCommune();
    this.loadAddressDistrict();
  }
  loadSegment(){
   if(this.idSegment){
    this.service.getAddSegmentbyId(this.idSegment).subscribe((res)=>{
      this.listSegment = res.value[0];
      console.log(this.listSegment);
    });
    this.serviceAddress
    .getCateByType(CommonCategoriesType.PROVINCE)
    .subscribe((data: any) => {
      this.addressDetail = data.value;
    });
    this.serviceMember.getSegmentMemberByPreSegmentId(this.idSegment).subscribe((res)=>{
      this.listSegmentMember = res.value;
    })
    this.servicePlan.getPlanById(this.planId).subscribe((res)=>{
      this.listPlan= res.value[0];
      if(this.listPlan.Status == 3 || this.listPlan.Status == 4 || this.listPlan.Status == 5 || this.listPlan.Status == -5){
        this.checks = true;
        this.editSettings = {
          allowEditing: false,
          allowAdding: false,
          allowDeleting: false,

        }
      }
      // else{
      //   this.editSettings = {
      //     allowEditing: false,
      //     allowAdding: false,
      //     allowDeleting: false,

      //   }
      // }


    })
   }else{
    //this.listSegment = new PreproductionSegment();
   }

  }
  toggleForm() {
    this.isCollapsed = !this.isCollapsed;
  }
  toggleForm1() {
    this.isCollapsed1 = !this.isCollapsed1;
  }
  onCancelClick() {
    if (!this.idSegment) {
      this.router.navigate(['../'], { relativeTo: this.route });
    } else {
      this.router.navigate(['../../'], { relativeTo: this.route });
    }
  }
  onSubmit(){
    if(this.idSegment){
      if(this.segmentDetail.Status == undefined || this.segmentDetail.Status == null){
        this.segmentDetail.Status =0;
      }
      this.service.UpdateSeg(this.segmentDetail,this.idSegment).subscribe((res)=>{
        this.segmentDetail = new PreproductionSegment();
        this.toastService.success('Cập nhật thành công!','Thành công');
      })
    }
    else{
      if(this.segmentDetail.Scenario == undefined || this.segmentDetail.Scenario == null){
        this.checkSegmentName = true;
      }
      else{
        this.checkSegmentName = false;
      }
     if(this.checkSegmentName == false){
      this.segmentDetail.PreProductionId = this.planId;
      if(this.segmentDetail.Status == undefined || this.segmentDetail.Status == null){
        this.segmentDetail.Status =0;
      }
      this.service.CreateSeg(this.segmentDetail).subscribe((res)=>{
        this.segmentDetail = new PreproductionSegment();
        this.toastService.success('Thêm mới thành công!','Thành công');
        this.router.navigate(['../edit-segment', res.Id], {
          relativeTo: this.route,
        });
      })
     }
     }
  }
  onInputChangeSegmentMember(value: any) {
    const key = value.key;
    const event = value.value;
    const data = { ...this.segmentMemberDetail, [key]: event };
    this.segmentMemberDetail = data;
  }
  actionCompleteSegmentMember(args: any) {
    if (
      (args as any).requestType === 'beginEdit' ||
      (args as any).requestType === 'add'
    ) {
      const dialog = (args as any).dialog;
      dialog.width = 500;
      dialog.header =
        (args as any).requestType === 'beginEdit'
          ? 'Chỉnh sửa'
          : 'Thêm thành viên';
    }
  }
  onActionBeginSegmentMember(args: SaveEventArgs) {
    if (args.action == RequestTypeAction.ADD) {
      if (this.segmentMemberDetail.UserId == undefined) {
        if (args.requestType == 'save') {

          args.cancel = true;
        } else {
          args.cancel = false;
        }
      } else {
        this.cdr.markForCheck();
        this.segmentMemberDetail.PreProductionSegmentId = this.idSegment;
        this.serviceMember
          .CreateSegmentMember(this.segmentMemberDetail)
          .subscribe(() => {
            this.refreshSegmentMember();
          });
      }
    }
    if (args.action == RequestTypeAction.EDIT) {
      const x = (args.data as any).Id;
      this.serviceMember
        .UpdateSegmentMember(this.segmentMemberDetail, x)
        .subscribe(() => {
          this.refreshSegmentMember();
        });
    }
    if (args.requestType === 'delete') {
      const dataRow = (args.data as PreproductionsegmentMember[])[0];
      args.cancel = true;
      this.dialog.show();
      this.dialog.header = 'Xác nhận xóa thành viên';
      this.dialog.content = 'Bạn có chắc chắn muốn tiếp tục không?';
      this.dialog.animationSettings = {
        effect: 'Fade',
        duration: 100,
        delay: 0,
      };
      this.dialog.buttons = [
        {
          click: this.onConfirmDeleteMember.bind(this, dataRow),
          buttonModel: { content: 'OK', isPrimary: true },
        },
        {
          click: this.hideDialog.bind(this),
          buttonModel: { content: 'Hủy' },
        },
      ];
    }
  } 
  onConfirmDeleteMember(dataRow: any) {
    this.dialog.hide();
    
        this.serviceMember.DeleteSegmentMember(dataRow.Id).subscribe(
          (data) => {
            this.refreshSegmentMember();
            this.toastService.success('Xóa thành công!');
          },
          () => {
            this.grid.dataSource = this.listMember;
            this.toastService.warning('Có lỗi xảy ra...');
          }
        );
      }
  refreshSegmentMember() {
    if (this.idSegment) {
      this.service.getbyIdPlan(this.planId).subscribe((data) => {
        if (data && data.value && data.value.length > 0 && data.value[0].Id) {
          const planId = data.value[0].Id;

          this.serviceMember
            .getSegmentMemberByPreSegmentId(planId)
            .subscribe((segmentData) => {
              if (segmentData && segmentData.value) {
                this.listSegmentMember = segmentData.value;
              } else {
              }
            });
        } else {
        }
      });
    }
  }

  loadUser() {
    this.serviceUser.getAllUserCheckStatus().subscribe((data: any) => {
      this.listUser = data.value;
      this.cdr.markForCheck();
    });
  }
  handleRenderMember(MemberId: number) {
    let userName: any = '';
    if (MemberId) {
      const user = this.listUser.find((item) => item.Id === MemberId);
      userName = `${user?.FirstName} ${user?.LastName}`;
    }
    return userName;
  }
  loadAddress() {
    this.serviceAddress
      .getCateByType(CommonCategoriesType.PROVINCE)
      .subscribe((data: any) => {
        this.addressDetail = data.value;
      });
  }
  onInputChangeSegment(value: any) {
    const key = value.key;
    const event = value.value;
    const updatedSegmentDetail = { ...this.segmentDetail, [key]: event };
    this.segmentDetail = updatedSegmentDetail;
    if (key === 'Budget') {
      this.segmentDetail.Budget = parseFloat(event);
    }
    if (this.segmentDetail.Budget == undefined || this.segmentDetail.Budget == null) {
      this.segmentDetail.Budget = 0;
    }
  }
  onChangeDistrict(event: any) {
    this.segmentDetail.DistrictId = event;
    this.loadAddressCommune(event);
  }
  onChangeProvince(event: any) {
    this.segmentDetail.ProvinceId = event;
    this.loadAddressDistrict(event);
  }
  onChangeCommune(event: any) {
    this.segmentDetail.CommuneId = event;
  }
  loadAddressDistrict(Id?: any) {
    this.serviceAddress
      .getCateByType(CommonCategoriesType.DISTRICTS)
      .subscribe((data: any) => {
        this.addressDistrict = data.value.filter(
          (item: any) => item.Name !== undefined && item.ParentId == Id
        );
      });
      this.cdr.markForCheck();
  }
  loadAddressCommune(Id?: any) {
    this.serviceAddress
      .getCateByType(CommonCategoriesType.COMMUNE)
      .subscribe((data: any) => {
        this.addressCommune = data.value.filter(
          (item: any) => item.Name !== undefined && item.ParentId == Id
        );
      });
      this.cdr.markForCheck();
  }

}
