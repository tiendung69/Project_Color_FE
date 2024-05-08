import { ActivatedRoute, Router } from '@angular/router';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { L10n } from '@syncfusion/ej2-base';
import {
  EditSettingsModel,
  FilterSettingsModel,
  GridComponent,
  SaveEventArgs,
  ToolbarItems,
} from '@syncfusion/ej2-angular-grids';
import { TopicDocumentService } from 'src/app/core/services/topic-document.service';
import { TopicMemberService } from 'src/app/core/services/topic-member.service';
import { TopicService } from 'src/app/core/services/topic.service';
import { UploadFileService } from 'src/app/core/services/upload-file.service';
import { Notify, PreproductionPlaning, Topic, User } from 'src/app/core/models/database/db.model';
import { EmitType } from '@syncfusion/ej2-base';
import {
  AppRoles,
  NotifyActionType,
  NotifyObjectType,
  NotifyStatus,
  PlanStatus,
  TopicStatus,
} from 'src/app/core/utils/constant';
import { RolePermissionService } from 'src/app/core/services/role-permission.service';
import { ToastrService } from 'ngx-toastr';
import { MaskedDateTimeService } from '@syncfusion/ej2-angular-calendars';
import { CommoncategoryService } from 'src/app/core/services/commoncategory.service';
import { UserRoleService } from 'src/app/core/services/user-role.service';
import { UserLogged } from 'src/app/core/utils/userLogged';
import { NotifyService } from 'src/app/core/services/notify.service';
import { UserService } from 'src/app/core/services/user.service';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';

L10n.load({
  'en-US': {
    grid: {
      SaveButton: 'Lưu',
      CancelButton: 'Hủy',
      AddButton: 'Thêm',
      Edit: 'Sửa',
      Add: 'Thêm',
      Delete: 'Xóa',
      Update: 'Cập nhật',
      Cancel: 'Hủy',
      EditOperationAlert: 'Hãy chọn một mục để sửa.',
      DeleteOperationAlert: 'Hãy chọn một mục để xóa',
      EmptyRecord: 'Không có dữ liệu để hiển thị.',
    },
    dropdowns: {
      noRecordsTemplate: 'Không có dữ liệu.',
    },
  },
});
@Component({
  selector: 'app-register-topic',
  templateUrl: './register-topic.component.html',
  styleUrls: ['./register-topic.component.scss'],
  providers: [MaskedDateTimeService],
})
export class RegisterTopicComponent implements OnInit {
  listDelMember: Array<any> = [];
  listDel: Array<any> = [];
  public editSettings?: EditSettingsModel = {
    allowEditing: false,
    allowAdding: false,
    allowDeleting: false,
    template: false,
    // mode: 'Dialog',
  };
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
  public toolbarOptions: ToolbarItems[];
  public filterSettings?: Object;
  public listUser: User[];
  public enableMaskSupport: boolean = true;
  public NameValidationRules: Object;
  public DescriptionValidationRules: Object;
  public ScenarioValidationRules: Object;
  public CreateByValidationRules: Object;
  public Description2ValidationRules: Object;
  public StatusValidationRules: Object;
  public TypeValidationRule: Object;
  public listStatus: any[] = [
    { text: 'Tất cả', value: 10 },
    { text: 'Chưa duyệt', value: PlanStatus.NOTPROCESS },
    { text: 'Đã duyệt', value: PlanStatus.APPROVE },
    { text: 'Từ chối', value: PlanStatus.REJECT },
  ];
  public ParentIdValidationRules: Object;
  public dropdownFields = { text: 'text', value: 'value' };
  public dropdownField = { text: 'text' };
  @ViewChild('grid') grid: GridComponent;
  public listTopic: Array<any> = [];
  public classExpression: any;
  nameDelete: any;
  checkRole : boolean=  false;
  public doValidation: boolean = false;
  uploadedFiles: any;
  public listUserRole: Array<any> = [];
  public fields: Object = { text: 'text', value: 'value' };
  public filterOptions: FilterSettingsModel = {
    ignoreAccent: false,
    showFilterBarStatus: false,
  };
  fileUpload: any;
  ngOnInit(): void {
    this.loadTopic1();
    this.classExpression = 'urlClass';
    this.NameValidationRules = {};
    this.DescriptionValidationRules = {};
    this.ScenarioValidationRules = {};
    this.CreateByValidationRules = {};
    this.StatusValidationRules = {};
    this.TypeValidationRule = {};
    this.ParentIdValidationRules = {};
  }

  constructor(
    private service: TopicService,
    private service2: TopicDocumentService,
    public toastService: ToastrService,
    private serviceFile: UploadFileService,
    public changeDetectorRef: ChangeDetectorRef,
    private serviceMember: TopicMemberService,
    private readonly router: Router,
    private readonly userService: UserService,
    private readonly notifyService: NotifyService,
    private serviceUserRole: UserRoleService,
    private readonly route: ActivatedRoute,
    public serviceDocument: TopicDocumentService,
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
      this.checkRole = true;
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
    }
    this.grid.filterByColumn('Status', 'equal', args.value);
  }
  loadTopic1() {
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
      this.listTopic = data.value.filter(
        (item: any) => item.Type === 0 && item.Name !== undefined
      );
    });
  }

  onChange1(args: any): void {
    this.grid.filterByColumn('Name', 'contains', args.value);
  }
  onChange2(args: any): void {
    this.grid.filterByColumn('Description', 'contains', args.value);
  }

  onChange3(args: any): void {
    this.grid.filterByColumn('EstimatedBegin', 'equal', args.value);
  }
  onChange4(args: any): void {
    this.grid.filterByColumn('EstimatedEnd', 'equal', args.value);
  }
  onChange5(args: any): void {
    this.grid.filterByColumn('EstimatedBroadcasting', 'equal', args.value);
  }
  onFileUrlClick(fileUrl: string) {
    if (fileUrl) {
      window.open(fileUrl, '_blank');
    }
  }
  getFileName(fileUrl: string): string {
    if (fileUrl) {
      const fileName = fileUrl.substring(fileUrl.lastIndexOf('/') + 1);
      return fileName;
    }
    return '';
  }
  actionComplete(args: SaveEventArgs) {
    if (args.requestType === 'beginEdit') {
      const Id = (args.rowData as any).Id;
      this.router.navigate(['./edit', Id], {
        relativeTo: this.route,
      });
    }
    if (args.requestType === 'add') {
      this.router.navigate(['./add'], {
        relativeTo: this.route,
      });
    }
  }
  actionBegin(args: SaveEventArgs) {
    this.doValidation = false;
    const ref = this;
  
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
            });
          this.service.DeleteTopic(x).subscribe(() => {
            this.toastService.success('Xóa đề tài thành công!', 'Thành công');
            this.loadTopic1();
            const loggser = new UserLogged();
            for (let index = 0; index < this.listUserRole.length; index++) {
              const element = this.listUserRole[index]?.UserId;
              const Title = `Đề tài đã được xóa`;
              const Detail = `Đạo diễn <strong>${this.handleRenderMember(
                dataRow.CreatedBy
              )}</strong> đã xóa đề tài: <strong>${
                dataRow.Name
              }</strong>. Vui lòng xem xét lại hoặc liên hệ để biết thêm thông tin.`;

              this.notifyService
                .CreateNotify(
                  element,
                  NotifyActionType.DELETE,
                  NotifyObjectType.TOPIC,
                  dataRow.Id,
                  Title,
                  Detail
                )
                .subscribe((data) => {})
                .unsubscribe();
                }
              })
            }
            else{
              this.toastService.error('Đề tài đã duyệt, không thể xóa!', 'Thất bại');
            }
    () => {
      this.grid.dataSource = this.listTopic;
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
}
