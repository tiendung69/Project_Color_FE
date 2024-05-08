import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Column,
  EditSettings,
  EditSettingsModel,
  FilterSettingsModel,
  GridComponent,
  IFilter,
  PageSettingsModel,
  SaveEventArgs,
  ToolbarItems,
} from '@syncfusion/ej2-angular-grids';
import { EmitType } from '@syncfusion/ej2-base';
import {
  Approved,
  Notify,
  Topic,
  TopicMember,
  User,
} from 'src/app/core/models/database/db.model';
import { createElement } from '@syncfusion/ej2-base';
import { ApprovedService } from 'src/app/core/services/approve.service';
import { RolePermissionService } from 'src/app/core/services/role-permission.service';
import { TopicDocumentService } from 'src/app/core/services/topic-document.service';
import { TopicMemberService } from 'src/app/core/services/topic-member.service';
import { TopicService } from 'src/app/core/services/topic.service';
import { L10n } from '@syncfusion/ej2-base';
import {
  AppRoles,
  NotifyActionType,
  NotifyObjectType,
  NotifyStatus,
  PlanStatus,
  RequestTypeAction,
  TopicStatus,
} from 'src/app/core/utils/constant';
import { ToastrService } from 'ngx-toastr';
import { MaskedDateTimeService } from '@syncfusion/ej2-angular-calendars';
import { UserService } from 'src/app/core/services/user.service';
import { NotifyService } from 'src/app/core/services/notify.service';
import { UserRoleService } from 'src/app/core/services/user-role.service';
import { UserLogged } from 'src/app/core/utils/userLogged';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';

L10n.load({
  'en-US': {
    grid: {
      FilterButton: 'Lọc',
      ClearButton: 'Xóa',
      EnterValue: 'Nhập giá trị',
      ChooseDate: 'Chọn ngày',
    },
    datepicker: { day: 'Ngày', month: 'Tháng', year: 'Năm' },
    // pager:{
    //   currentPageInfo: '{0} trong tổng số {1} trang',
    //   totalItemsInfo: '({0} trang)',
    //   firstPageTooltip: 'Trang đầu',
    //   lastPageTooltip: 'Trang cuối',
    //   nextPageTooltip: 'Trang tiếp theo',
    //   previousPageTooltip:'Trang sau',
    //   nextPagerTooltip: 'Trang tiếp theo',
    //   previousPagerTooltip: 'Trang sau',
    // }
  },
});

@Component({
  selector: 'app-outline',
  templateUrl: './outline.component.html',
  styleUrls: ['./outline.component.scss'],
  providers: [MaskedDateTimeService],
})
export class OutlineComponent implements OnInit {
  public listOutLine: Topic;
  nameDelete: any;
  public targetElement: HTMLElement;
  public hideDialog: EmitType<object> = () => {
    this.dialog.hide();
  };
  
  public initilaizeTarget: EmitType<object> = () => {
    this.targetElement = this.container.nativeElement.parentElement;
  };
  @ViewChild('ejDialog') public dialog: DialogComponent;
  // Create element reference for dialog target element.
  @ViewChild('container', { read: ElementRef, static: true }) container:
    | ElementRef
    | any;
  public listStatus: any[] = [
    { text: 'Tất cả', value: 10 },
    { text: 'Chưa duyệt', value: TopicStatus.NOTPROCESS },
    { text: 'Đã duyệt', value: TopicStatus.APPROVE },
    { text: 'Từ chối', value: TopicStatus.REJECT },
  ];
  public filterOptions: FilterSettingsModel = {
    ignoreAccent: true,
    showFilterBarStatus: false,
  };
  public fieldsTopic: Object = { text: 'Name', value: 'Id' };
  public enableMaskSupport: boolean = true;
  public fields: Object = { text: 'text', value: 'value' };
  public filterSettings?: Object;

  @ViewChild('grid') grid: GridComponent;
  listDel: Array<any> = [];
  listDelMember: Array<any> = [];
  public listUser: User[];
  parentIdList: Array<any> = [];
  public filterParams?: object;
  listTopic: Array<any> = [];
  checkRole : boolean = false;
  public listUserRole: Array<any> = [];
  public headerTemplate = '<label class="label-custom">Đề Cương</label>';
  doValidation: boolean = false;
  public editSettings?: EditSettingsModel = {
    allowEditing: false,
    allowAdding: false,
    allowDeleting: false,
  };
  public pageSettings?: PageSettingsModel;
  public toolbarOptions: ToolbarItems[];
  ngOnInit(): void {
    this.loadOutLine();
    // this.listOutLine = new Topic();
    this.pageSettings = { pageSize: 10 };
  }
  constructor(
    public service: TopicService,
    public readonly router: Router,
    public toastService: ToastrService,
    private readonly route: ActivatedRoute,
    public changeDetectorRef: ChangeDetectorRef,
    public serviceDocument: TopicDocumentService,
    public serviceMember: TopicMemberService,
    public serviceApproved: ApprovedService,
    private readonly userService: UserService,
    private readonly notifyService: NotifyService,
    private serviceUserRole: UserRoleService,
    public roleRightService: RolePermissionService
  ) {
    if (this.roleRightService.hasRole([AppRoles.DIRECTOR])) {
      this.checkRole = false;
      this.toolbarOptions = ['Add', 'Edit', 'Delete'];
      this.editSettings = {
        allowEditing: true,
        allowAdding: true,
        allowDeleting: true,
      };
    } else if (this.roleRightService.hasRole([AppRoles.LEADER])) {
      this.checkRole=true;
      this.editSettings = {
        allowEditing: true,
        allowAdding: false,
        allowDeleting: false,
      };
    }
  }
  onChange(args: any): void {
    if (args.value == 10) {
      this.grid.clearFiltering();
    } else this.grid.filterByColumn('Status', 'equal', args.value);
  }
  onChange3(args: any): void {
    this.grid.filterByColumn('ParentId', 'equal', args.value);
  }
  onChange4(args: any): void {
    this.grid.filterByColumn('EstimatedBroadcasting', 'equal', args.value);
  }
  onChange5(args: any): void {
    this.grid.filterByColumn('Name', 'contains', args.value);
  }
  onChange6(args: any): void {
    this.grid.filterByColumn('EstimatedBudget', 'contains', args.value);
  }
  loadOutLine() {
    this.userService
      .getListUserByQuery(
        '$Select=Id, FirstName, LastName, UserName, Email, Tel&$Filter=Status eq 1'
      )
      .subscribe((data) => {
        this.listUser = data.value;
      });
    this.serviceUserRole.getAllRole().subscribe((data: any) => {
      this.listUserRole = data.value;
    });
    this.service.getAllTopicDangky().subscribe((data: any) => {
      this.listOutLine = data.value.filter((item: any) => item.Type == 1);
      this.parentIdList = data.value
        .filter((item: any) => item.Type === 0)
        .map((item: any) => ({
          Id: item.Id,
          Name: item.Name,
        }));
      this.listTopic = data.value.filter((item: any) => item.Type == 0);
    });
  }

  renderStatus(data: Topic) {
    const status = data.Status;
    switch (status) {
      case TopicStatus.APPROVE:
        return 'Đã duyệt';
      case TopicStatus.INPROCRESS:
        return 'Chờ duyệt';
      case TopicStatus.REJECT:
        return 'Từ chối';
      case TopicStatus.NOTPROCESS:
        return 'Chưa duyệt';
      default:
        return '';
    }
  }
  onFileUrlClick(fileUrl: string) {
    if (fileUrl) {
      window.open(fileUrl, '_blank');
    }
  }
  onChange1(args: any): void {
    this.grid.filterByColumn('EstimatedEnd', 'equal', args.value);
  }
  onChange2(args: any): void {
    this.grid.filterByColumn('EstimatedBegin', 'equal', args.value);
  }
  getFileName(fileUrl: string): string {
    if (fileUrl) {
      const fileName = fileUrl.substring(fileUrl.lastIndexOf('/') + 18);
      return fileName;
    }
    return '';
  }
  actionComplete(args: SaveEventArgs) {
    if (args.requestType === RequestTypeAction.BEGINEDIT) {
      const Id = (args.rowData as any).Id;
      this.router.navigate(['./edit', Id], {
        relativeTo: this.route,
      });
    }
    if (args.requestType === RequestTypeAction.ADD) {
      this.router.navigate(['./add'], {
        relativeTo: this.route,
      });
    }
  }
  getNameByParentId(parentId: number): string {
    const name: any = this.parentIdList.find((item) => item.Id === parentId);

    return name ? name.Name : '';
  }
  actionBegin(args: SaveEventArgs) {
    this.doValidation = false;
  if (args.requestType === 'delete') {
    const dataRow = (args.data as Topic[])[0];
    args.cancel = true;
    this.dialog.show();
    this.dialog.header = 'Xác nhận xóa quyền';
    this.dialog.content = 'Bạn có chắc chắn muốn tiếp tục không?';
    this.dialog.animationSettings = {
      effect: 'Fade',
      duration: 100,
      delay: 0,
    };
    this.dialog.buttons = [
      {
        click: this.onConfirmDelete.bind(this, dataRow),
        buttonModel: { content: 'OK', isPrimary: true },
      },
      {
        click: this.hideDialog.bind(this),
        buttonModel: { content: 'Hủy' },
      },
    ];
  }
}
onConfirmDelete(dataRow: any) {
  this.dialog.hide();
  if (dataRow.Status != TopicStatus.APPROVE) {
            const x = dataRow.Id;
            this.serviceDocument
              .getTopicDocumentByIdTopic(x)
              .subscribe((data: any) => {
                this.listDel = data.value;
                console.log(this.listDel.length);
                for (let index = 0; index < this.listDel.length; index++) {
                  const element = this.listDel[index].Id;
                  this.serviceDocument
                    .DeleteTopicDocument(element)
                    .subscribe(() => {});
                }
              });
            this.serviceMember
              .getTopicMemberByIdTopic(x)
              .subscribe((data: any) => {
                this.listDelMember = data.value;
                for (let index = 0; index < this.listDelMember.length; index++) {
                  const element = this.listDelMember[index].Id;
                  this.serviceMember.DeleteTopicMember(element).subscribe(() => {
                    this.service.DeleteTopic(x).subscribe(() => {});
                  });
                }
                this.service.DeleteTopic(x).subscribe(
                  () => {
                    this.loadOutLine();
                    this.toastService.success(
                      'Xóa đề cương thành công!',
                      'Thành công'
                    );
                    for (
                      let index = 0;
                      index < this.listUserRole.length;
                      index++
                    ) {
                      const element = this.listUserRole[index].UserId;
                      const Title = `Đề cương đã bị xóa`;
                      const Detail = `Đạo diễn <strong>${this.handleRenderMember(
                        dataRow.CreatedBy
                      )}</strong> đã xóa đề cương: <strong>${
                        dataRow.Name
                      }</strong>. Vui lòng xem xét lại hoặc liên hệ để biết thêm thông tin.`;
  
                      this.notifyService
                        .CreateNotify(
                          element,
                          NotifyActionType.DELETE,
                          NotifyObjectType.OUTLINE,
                          dataRow.Id,
                          Title,
                          Detail
                        )
                        .subscribe((data) => {})
                    }
                  },
                  (error) => {
                    this.toastService.error(
                      'Xóa thất bại, đề cương đã được duyệt!',
                      'Thất bại'
                    );
                  }
                );
              });
          } else {
            
            this.toastService.error(
              'Xóa thất bại, đề cương đã được duyệt!',
              'Thất bại'
            );
          }
    () => {
      this.grid.dataSource = this.listOutLine;
      this.toastService.warning('Có lỗi xảy ra...');
    }

}
  handleRenderMember(MemberId: number) {
    let userName: any = '';
    if (MemberId) {
      const user = this.listUser.find((item) => item.Id === MemberId);
      userName = `${user?.FirstName} ${user?.LastName}`;
    }
    return userName;
  }
}
