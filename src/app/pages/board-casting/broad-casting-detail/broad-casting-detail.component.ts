import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  EditSettingsModel,
  GridComponent,
  PageSettingsModel,
  SaveEventArgs,
  ToolbarItems,
} from '@syncfusion/ej2-angular-grids';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';
import { ToastrService } from 'ngx-toastr';
import {
  Broadcasting,
  Broadcastingdocument,
  Commoncategory,
  PostproductionPlaning,
  PreproductionPlaning,
} from 'src/app/core/models/database/db.model';
import { EmitType } from '@syncfusion/ej2-base';
import { BroadCastingDocumentService } from 'src/app/core/services/broad-casting-document.service';
import { BroadCastingService } from 'src/app/core/services/broad-casting.service';
import { CommoncategoryService } from 'src/app/core/services/commoncategory.service';
import { UploadService } from 'src/app/core/services/file-upload.service';
import { PostProPlanService } from 'src/app/core/services/post-pro-plan.service';
import { PrePlanService } from 'src/app/core/services/pre-plan.service';
import { RolePermissionService } from 'src/app/core/services/role-permission.service';
import {
  AppRoles,
  CommonCategoriesType,
  RequestTypeAction,
} from 'src/app/core/utils/constant';
import { SpinnerService } from 'src/app/theme/components/spinner/spinner.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-broad-casting-detail',
  templateUrl: './broad-casting-detail.component.html',
  styleUrls: ['./broad-casting-detail.component.scss'],
})
export class BroadCastingDetailComponent implements OnInit {
  public listBroadCasting: Array<any> = [];
  public listDocument: Broadcastingdocument;
  public documentDetail: Broadcastingdocument;
  public broadCastingDetail: Broadcasting;
  public dropdownField: Object;
  public getPostPlan: PostproductionPlaning;
  public listPostProduction: PostproductionPlaning;
  public postProDetail: Array<any> = [];
  public listPreplan: PreproductionPlaning;
  public cateValue: Commoncategory;
  public targetElement: HTMLElement;
  public hideDialog: EmitType<object> = () => {
    this.dialog.hide();
  };

  public initilaizeTarget: EmitType<object> = () => {
    this.targetElement = this.container.nativeElement.parentElement;
  };
  @ViewChild('ejDialogBroadcasting') public dialog: DialogComponent;
  // Create element reference for dialog target element.
  @ViewChild('container', { read: ElementRef, static: true }) container:
    | ElementRef
    | any;
  public preplanDetail: PreproductionPlaning;
  public deleteDocument: Broadcastingdocument[] = [];
  public listCate: Array<any> = [];
  public listChannel: Array<any> = [];
  public check = false;
  public name: any;
  public listPlanDetail: PreproductionPlaning;
  public listPlan: PreproductionPlaning;
  file: any;
  public editSettings: EditSettingsModel = {
    allowDeleting: false,
    allowAdding: false,
    allowEditing: false,
  };
  public toolbarOptions: ToolbarItems[];
  public pageSettings: PageSettingsModel;
  public idPlan: any;
  public fileUpload: any;
  isCollapsed2 = false;
  isCollapsed = true;
  private readonly canGoBack: boolean;
  @ViewChild('gridBroadcasting') public gridBroadcasting: GridComponent;
  messageFile = false;
  constructor(
    public readonly router: Router,
    public toastService: ToastrService,
    private readonly cdr: ChangeDetectorRef,
    private readonly route: ActivatedRoute,
    public service: BroadCastingService,
    private spinnerService: SpinnerService,
    public servicePostPlan: PostProPlanService,
    public serviceCate: CommoncategoryService,
    public servicePlan: PrePlanService,
    public fileUploadService: UploadService,
    public servicePost: PostProPlanService,
    private readonly serviceDocument: BroadCastingDocumentService,
    private roleRightService: RolePermissionService
  ) {
    if (this.roleRightService.hasRole([AppRoles.DIRECTOR])) {
      this.toolbarOptions = ['Add', 'Edit', 'Delete'];

      if (this.editSettings) {
        this.editSettings.allowEditing = true;
        this.editSettings.allowAdding = true;
        this.editSettings.allowDeleting = true;
      }
    } else if (this.roleRightService.hasRole([AppRoles.LEADER])) {
      if (this.editSettings) {
        this.editSettings.allowEditing = true;
        this.editSettings.allowAdding = false;
        this.editSettings.allowDeleting = false;
      }
    }
    this.canGoBack = !!this.router.getCurrentNavigation()?.previousNavigation;
  }
  ngOnInit(): void {
    this.idPlan = this.route.snapshot.paramMap.get('id');
    this.loadBroadCasting();
    this.loadChannel();
    this.loadNameFilm();

    this.cateValue = new Commoncategory();
    this.listPreplan = new PreproductionPlaning();

    this.dropdownField = { text: 'Name', value: 'Id' };
  }
  loadBroadCasting() {
    if (this.idPlan) {
      this.serviceCate
        .getCateByType(CommonCategoriesType.TVSTATION)
        .subscribe((data) => {
          this.listChannel = data.value;
        });
      this.servicePostPlan.getAllPostPlanById(this.idPlan).subscribe((data) => {
        this.listPostProduction = data.value[0];
        this.listPlanDetail = this.listPostProduction.PreProduction;
        this.name = this.listPlanDetail.Name;
        this.service.getBroadCastingByIdPlan(this.idPlan).subscribe((data) => {
          this.listBroadCasting = data.value;
        });
      });
    } else {
      this.listPostProduction = new PostproductionPlaning();
      this.listPlanDetail = new PreproductionPlaning();
    }
  }
  loadNameFilm() {
    if (this.idPlan) {
      this.servicePostPlan.getAllPostPlan().subscribe((data) => {
        this.postProDetail = data.value
          .map((item: any) => item.PreProduction)
          .flat();
      });
    }
    if (!this.idPlan) {
      this.servicePlan.getPlanFlowbyStatus().subscribe((data) => {
        this.servicePost = data.value;
        this.servicePostPlan.getAllPostPlan().subscribe((parentData) => {
          for (let index = 0; index < this.postProDetail.length; index++) {
            const element = this.postProDetail[index].Id;
            let foundMatch = false;
            for (let j = 0; j < parentData.value.length; j++) {
              const element1 = parentData.value[j].PreProductionId;
              if (element === element1) {
                foundMatch = true;
                this.postProDetail.splice(index, 1);
                index--;
                break;
              }
            }
            if (!foundMatch) {
              const data = this.postProDetail.filter(
                (item) => item.Id == element
              );
            }
          }
        });
        this.cdr.detectChanges();
      });
    }
  }
  renderChannel(parentId: number): string {
    const channel = this.listChannel.find((item: any) => item.Id === parentId);
    return channel ? channel.Name : '';
  }

  onInputChange(value: any) {
    this.servicePost.getAllPostPlanByIdPrePlan(value).subscribe((data) => {});
  }
  actionBegin(args: SaveEventArgs) {
    if (args.requestType === 'beginEdit') {
      const Id = (args.rowData as any).Id;
      this.router.navigate(['./edit-document', Id], {
        relativeTo: this.route,
      });
    }
    if (args.requestType === 'add') {
      this.router.navigate(['./add-document'], {
        relativeTo: this.route,
      });
    }
    if (args.requestType === 'delete') {
      const dataRow = (args.data as Broadcasting[])[0];
      args.cancel = true;
      this.dialog.show();
      this.dialog.header = 'Xác nhận xóa lịch phát sóng';
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
    this.serviceDocument.getAllBoardDocumentByIdBroadCasting(dataRow.Id)
              .subscribe((data) => {
  
                for (let index = 0; index < data.value.length; index++) {
                  const element = data.value[index];
                  this.serviceDocument
                    .DeleteTopicDocument(element.Id)
                    .subscribe((data) => {
                    
                      this.service.DeleteBroadCasting(dataRow.Id).subscribe(() => {
                        this.loadBroadCasting();
                        this.toastService.success('Xóa thành công', 'Thành công');
                      }, () => {
                        this.gridBroadcasting.dataSource = this.listDocument;
                        this.toastService.warning('Có lỗi xảy ra...');
                      }
                    );
                    });
                }
                this.service.DeleteBroadCasting(dataRow.Id).subscribe(() => {
                  this.toastService.success('Xóa thành công', 'Thành công');
                 this.loadBroadCasting();
                }
              );
              });
  
         
      }
  //   if (args.requestType === 'delete') {
  //     const deletedValue = (args.data as any)[0];
  //     const x = deletedValue.Id;
  //     const isConfirmed = confirm('Bạn có muốn xóa không?');
  //     if (isConfirmed) {
  //       const id = (args.data as any)[0].Id;

  //         this.serviceDocument
  //           .getAllBoardDocumentByIdBroadCasting(id)
  //           .subscribe((data) => {

  //             for (let index = 0; index < data.value.length; index++) {
  //               const element = data.value[index];
  //               this.serviceDocument
  //                 .DeleteTopicDocument(element.Id)
  //                 .subscribe((data) => {
  //                   this.service.DeleteBroadCasting(id).subscribe(() => {
  //                     this.toastService.success('Xóa thành công', 'Thành công');
  //                   });
  //                 });
  //             }
  //             this.service.DeleteBroadCasting(id).subscribe(() => {
  //               this.toastService.success('Xóa thành công', 'Thành công');
  //             });
  //           });


  //     }
  //     else{
  //       args.cancel = true;
  //       this.loadBroadCasting();
  //     }
  //   }
  // }
  loadChannel() {}
  toggleCollapse2() {
    this.isCollapsed2 = !this.isCollapsed2;
  }
  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
  }

  onSubmit() {
    if (!this.idPlan) {
      let data = new Broadcasting();
      data.Id = undefined as any;
      data.PostProductionPlaningId =
        this.broadCastingDetail.PostProductionPlaningId;
      this.service
        .CreateBroadCasting(this.broadCastingDetail)
        .subscribe((data: any) => {
          this.toastService.success('Thêm mới thành công', 'Thành công');
          this.idPlan = data.Id;
          this.router.navigate(['../edit', this.idPlan], {
            relativeTo: this.route,
          });
        });
    }
  }

  onInputChange1(value: any) {
    const key = value.key;
    const event = value.value;
    const data = { ...this.listBroadCasting, [key]: event };
    this.listBroadCasting = data;
  }
  onCancelClick() {
    if (!this.idPlan) {
      this.router.navigate(['../'], { relativeTo: this.route });
    } else {
      this.router.navigate(['../../'], { relativeTo: this.route });
    }
  }
}
