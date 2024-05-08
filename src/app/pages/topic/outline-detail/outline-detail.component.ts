import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Approved,
  Notify,
  Topic,
  TopicDocument,
  TopicMember,
  User,
  UserRole,
} from 'src/app/core/models/database/db.model';
import { TopicService } from 'src/app/core/services/topic.service';
import { UserService } from 'src/app/core/services/user.service';
import {
  NotifyActionType,
  AppRoles,
  ApprovedObjectType,
  ApprovedResultStatus,
  CommonCategoriesType,
  NotifyStatus,
  RequestTypeAction,
  TopicStatus,
  TopicType,
  NotifyObjectType,
  DBType,
} from 'src/app/core/utils/constant';
import { Location } from '@angular/common';
import { ApprovedService } from 'src/app/core/services/approve.service';
import { TopicMemberService } from 'src/app/core/services/topic-member.service';
import {
  CommandModel,
  EditSettingsModel,
  GridComponent,
  PageSettingsModel,
  SaveEventArgs,
  ToolbarItems,
  isChildColumn,
} from '@syncfusion/ej2-angular-grids';
import { EmitType } from '@syncfusion/ej2-base';
import { TopicDocumentService } from 'src/app/core/services/topic-document.service';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';
import { UploadFileService } from 'src/app/core/services/upload-file.service';
import { finalize, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserLogged } from 'src/app/core/utils/userLogged';
import { UploadService } from 'src/app/core/services/file-upload.service';
import { SpinnerService } from 'src/app/theme/components/spinner/spinner.service';
import { ToastrService } from 'ngx-toastr';
import { RolePermissionService } from 'src/app/core/services/role-permission.service';
import { MaskedDateTimeService } from '@syncfusion/ej2-angular-calendars';
import { NotifyService } from 'src/app/core/services/notify.service';
import { UserRoleService } from 'src/app/core/services/user-role.service';
import { CommoncategoryService } from 'src/app/core/services/commoncategory.service';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-outline-detail',
  templateUrl: './outline-detail.component.html',
  styleUrls: ['./outline-detail.component.scss'],
  providers: [MaskedDateTimeService],
})
export class OutlineDetailComponent implements OnInit {
  private readonly canGoBack: boolean;
  public status = {
    APPROVE: ApprovedResultStatus.APPROVED,
    REJECT: ApprovedResultStatus.REJECT,
  };

  public aprovedTimes: number;
  listUser: Array<any> = [];
  public dialogVisibility: boolean = false;
  @ViewChild('grid', { static: false }) public grid: GridComponent;
  isCommentVisible: boolean = false;
  selectedCommentIndex: number = -1;
  public approvedDetail = new Approved();
  public documentDetail: TopicDocument = new TopicDocument();
  public enableMaskSupport: boolean = true;
  public listApproved: Approved[];
  listFile: any[];
  queryListPlan: any;
  messageFile: boolean = false;
  messageNameNotification: boolean = false;
  messageParentNotification: boolean = false;
  messageMember: boolean = false;
  public fileUpload: any;
  listMembers: TopicMember[] = [];
  listDocument: TopicDocument[] = [];
  public pageSettings: PageSettingsModel = { pageSize: 10 };
  public toolbarOptions: ToolbarItems[];
  public percentComplete: number;
  public editSettings: EditSettingsModel = {
    allowDeleting: false,
    allowAdding: false,
    allowEditing: false,
    mode: 'Dialog',
  };
  listName: Array<any> = [];
  listTopicType: Array<any> = [];
  public memberDetail: TopicMember = new TopicMember();
  public dropdownField = { text: 'Name', value: 'Id' };
  public dropdownFields = { text: 'UserName', value: 'Id' };
  public dropdownUser = { text: 'FirstName', value: 'Id' };
  file: any;
  isCollapsed = true;
  isCollapsed2 = false;
  isCollapsed3 = true;
  isCollapsed1 = true;
  isCollapsed4 = true;
  isCollapsed5 = true;
  public commands: CommandModel[];
  messageOutlineType: boolean = false;
  public listCate: Array<any> = [];
  public enableForm: boolean = false;
  public enableApprove: boolean = false;
  query: any;
  public deleteDocument: TopicDocument[] = [];
  public userLogged = new UserLogged();
  private detailUser: User = new User();
  public listRole: Array<UserRole> = [];
  public idUpload: any;
  public uploadPartId: any;
  public dropEle?: HTMLElement;
  public open: boolean = false;
  public targetElement: HTMLElement;
  private oReq = new XMLHttpRequest();
  public hideDialog: EmitType<object> = () => {
    this.dialog.hide();
    this.dialogMember.hide();
  };
  
  public initilaizeTarget: EmitType<object> = () => {
    this.targetElement = this.container.nativeElement.parentElement;
  };
  @ViewChild('gridFile') gridFile: GridComponent;
  @ViewChild('gridMember') gridMember: GridComponent;
  @ViewChild('ejDialog') public dialog: DialogComponent;
  @ViewChild('ejDialogMember') public dialogMember: DialogComponent;
  // Create element reference for dialog target element.
  @ViewChild('container', { read: ElementRef, static: true }) container:
    | ElementRef
    | any;
  @ViewChild('orderForm') public orderForm?: FormGroup;
  @ViewChild('ejDialogMembers') ejDialogMembers: DialogComponent;
  @ViewChild('ejDialogDocuments') ejDialogDocuments: DialogComponent;
  @ViewChild('gridDocuments') gridDocuments: GridComponent;
  public listDocumentOriginal: TopicDocument[] = [];
  ngOnInit(): void {
    this.commands = [
      {
        buttonOption: {
          content: 'Nén file',
          cssClass: 'btn-video-compressor e-custombtn',
        },
      },
    ];
    this.approvedDetail = new Approved();
    this.listApproved = new Array<Approved>();
    this.refreshMemberList();
    this.loadUser();
    this.loadOutline();
    this.dropEle = document.getElementById('droparea') as HTMLElement;
    
  }
  constructor(
    public service: TopicService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly userRoleService: UserRoleService,
    private readonly notifyService: NotifyService,
    public fileUploadService: UploadService,
    public serviceUser: UserService,
    private readonly serviceCate: CommoncategoryService,
    private readonly toastService: ToastrService,
    private readonly cdr: ChangeDetectorRef,
    public serviceApproved: ApprovedService,
    public memberService: TopicMemberService,
    public documentService: TopicDocumentService,
    private spinnerService: SpinnerService,
    private serviceFile: UploadFileService,
    private roleRightService: RolePermissionService
  ) {
    if (this.roleRightService.hasRole([AppRoles.DIRECTOR])) {
      this.toolbarOptions = ['Add', 'Edit', 'Delete'];
      this.enableForm = true;
      if (this.editSettings) {
        this.editSettings.allowEditing = true;
        this.editSettings.allowAdding = true;
        this.editSettings.allowDeleting = true;
      }
    } else if (this.roleRightService.hasRole([AppRoles.LEADER])) {
      this.enableApprove = true;
      if (this.editSettings) {
        this.editSettings.allowEditing = false;
        this.editSettings.allowAdding = false;
        this.editSettings.allowDeleting = false;
      }
    }
    this.idOutline = this.route.snapshot.paramMap.get('id');
    this.canGoBack = !!this.router.getCurrentNavigation()?.previousNavigation;
  }
  public outlineDetails = new Topic();
  public idOutline: any | null;
  editMode: boolean;

  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
  }
  toggleCommentVisibility(index: number) {
    this.isCommentVisible = !this.isCommentVisible;
    this.selectedCommentIndex = this.isCommentVisible ? index : -1;
  }
  toggleCollapse2() {
    this.isCollapsed2 = !this.isCollapsed2;
  }
  toggleCollapse1() {
    this.isCollapsed1 = !this.isCollapsed1;
  }
  toggleCollapse3() {
    this.isCollapsed3 = !this.isCollapsed3;
  }

  toggleCollapse4() {
    this.isCollapsed4 = !this.isCollapsed4;
  }
  toggleCollapse5() {
    this.isCollapsed5 = !this.isCollapsed5;
  }
  onChangeOutLineType(args: any) {
    this.outlineDetails.CategoryId = args.value;
  }
  loadOutline() {
    console.log('aaaaaa');
    this.serviceUser
      .getUserByIds(this.userLogged.getCurrentUser().userId)
      .subscribe((data) => {
        this.detailUser = data.value[0];
      });
    this.userRoleService.getAllRole().subscribe((data) => {
      this.listRole = data.value;
    });
    this.serviceCate
      .getCateByType(CommonCategoriesType.OUTLINE)
      .subscribe((data) => {
        this.listCate = data.value;
      });
    if (this.idOutline) {
      this.service.getTopicById(this.idOutline).subscribe((data) => {
        this.outlineDetails = data.value[0];
        if (this.outlineDetails.Status == TopicStatus.APPROVE) {
          this.editSettings = {
            allowDeleting: false,
            allowAdding: false,
            allowEditing: false,
            mode: 'Dialog',
          };
        }
      });
      if (this.outlineDetails.Status !== TopicStatus.NOTPROCESS) {
        this.serviceApproved
          .getListApprovedByQuery(`$Filter=ObjectId eq ${this.idOutline}`)
          .subscribe((data) => {
            this.listApproved = data.value;

            this.aprovedTimes = data.value.length;
            const sortedList = data.value.sort((a: Approved, b: Approved) => {
              // @ts-ignore
              return new Date(b.ProcessedAt) - new Date(a.ProcessedAt);
            });
            this.cdr.detectChanges();
            this.approvedDetail = sortedList[0];
          });
      }
      this.memberService
        .getTopicMemberByTopicId(this.idOutline)
        .subscribe((data) => {
          this.listMembers = data.value;
        });
      this.documentService
        .getTopicDocumentByQuery(`$Filter=TopicId eq ${this.idOutline}&$Expand=UploadPart`)
        .subscribe((data) => {
          this.listDocument = data.value;
        });
      this.service.getTopicByQuery(``).subscribe((data: any) => {
        this.listName = data.value;
      });
    } else {
      if (this.roleRightService.hasRole([AppRoles.DIRECTOR])) {
        this.query = `and CreatedBy eq ${
          this.userLogged.getCurrentUser().userId
        }`;
      }
      if (
        this.roleRightService.hasRole([AppRoles.LEADER]) &&
        this.outlineDetails.CreatedBy != this.userLogged.getCurrentUser().userId
      ) {
        this.query = '';
      }
      this.service
        .getTopicByQuery(`$Filter=Status eq 3 and Type eq 0 ${this.query}`)
        .subscribe((data: any) => {
          this.listName = data.value;
          this.service
            .getTopicByQuery(`$Filter=Type eq 1`)
            .subscribe((parentData) => {
              this.listName = data.value;
              for (let index = 0; index < this.listName.length; index++) {
                const element = this.listName[index].Id;
                let foundMatch = false;
                for (let j = 0; j < parentData.value.length; j++) {
                  const element1 = parentData.value[j].ParentId;
                  if (element === element1) {
                    foundMatch = true;
                    this.listName.splice(index, 1);
                    index--;
                    break;
                  }
                }
                if (!foundMatch) {
                  const data = this.listName.filter(
                    (item) => item.Id == element
                  );
                }
              }
            });
        });
    }
  }
  onInputChangeMem(value: any) {
    let key = value.key;
    let event = value.value;
    if (key === 'Role' && event) {
      event = event.toString();
    }
    const data = { ...this.memberDetail, [key]: event };
    this.memberDetail = data;
  }
  onInputChange(value: any) {
    const key = value.key;
    const event = value.value;
    const data = { ...this.outlineDetails, [key]: event };
    this.outlineDetails = data;
  }
  onChange(event: any) {
    this.outlineDetails.ParentId = event.value;
    if (!this.idOutline === true) {
      this.service.getTopicById(event.value).subscribe((data: any) => {
        this.outlineDetails.EstimatedBegin = data.value[0].EstimatedBegin;
        this.outlineDetails.EstimatedEnd = data.value[0].EstimatedEnd;
        this.outlineDetails.EstimatedBroadcasting =
          data.value[0].EstimatedBroadcasting;

        for (let index = 0; index < data.TopicMembers?.length; index++) {
          this.memberDetail.Description = data.TopicMembers[index].Description;
          this.memberDetail.MemberId = data.TopicMembers[index].MemberId;
          this.memberDetail.Role = data.TopicMembers[index].Role;
        }
      });
    }
  }
  onChange5(event: any) {
    this.outlineDetails.EstimatedBudget = parseFloat(event.value);
    if (
      this.outlineDetails.EstimatedBudget == undefined ||
      this.outlineDetails.EstimatedBudget == null
    ) {
      this.outlineDetails.EstimatedBudget = 0;
    }
  }
  loadName() {
    this.service
      .getTopicByQuery(`$Filter=Status eq 3 and Type eq 0`)
      .subscribe((data: any) => {
        this.listName = data.value;
        this.service
          .getTopicByQuery(`$Filter=Type eq 1`)
          .subscribe((parentData) => {
            for (let index = 0; index < this.listName.length; index++) {
              const element = this.listName[index].Id;
              let foundMatch = false;
              for (let j = 0; j < parentData.value.length; j++) {
                const element1 = parentData.value[j].ParentId;
                if (element === element1) {
                  foundMatch = true;
                  this.listName.splice(index, 1);
                  index--;
                  break;
                }
              }
              if (!foundMatch) {
                const data = this.listName.filter((item) => item.Id == element);
              }
            }
          });
      });
  }

  onSubmit() {
    if (!this.idOutline) {
      if (this.outlineDetails.Name == null) {
        this.messageNameNotification = true;
      } else {
        this.messageNameNotification = false;
      }
      if (this.outlineDetails.ParentId == null) {
        this.messageParentNotification = true;
      } else {
        this.messageParentNotification = false;
      }
      if (this.outlineDetails.CategoryId == undefined) {
        this.messageOutlineType = true;
      } else {
        this.messageOutlineType = false;
      }
      if (
        this.outlineDetails.Name != null &&
        this.outlineDetails.ParentId != null &&
        this.messageOutlineType == false
      ) {
        if (
          this.outlineDetails.EstimatedBudget == undefined ||
          this.outlineDetails.EstimatedBudget == null
        ) {
          this.outlineDetails.EstimatedBudget = 0;
        }

        this.outlineDetails.Type = TopicType.OUTLINE;
        this.outlineDetails.CreatedBy = this.userLogged.getCurrentUser().userId;
        this.outlineDetails.CreatedAt = new Date();
        this.outlineDetails.Status = TopicStatus.NOTPROCESS;
        this.service.CreateTopic(this.outlineDetails).subscribe(
          (data1) => {
            const x = data1.Id;
            this.service.getTopicById(data1.ParentId).subscribe((data: any) => {
              const x = data.value.find((item: any) => item.Id);
              for (let index = 0; index < x.TopicDocuments?.length; index++) {
                this.documentDetail.TopicId = data1.Id;
                this.documentDetail.Description =
                  x.TopicDocuments[index].Description;
                this.documentDetail.FileUrl = x.TopicDocuments[index].FileUrl;
                console.log(this.documentDetail);
                this.documentService
                  .CreateTopicDocument(this.documentDetail)
                  .subscribe((res) => {
                    this.loadOutline();
                  });
              }

              this.memberDetail.TopicId = x;
              this.memberService
                .CreateTopicMember(this.memberDetail)
                .subscribe(() => {
                  this.refreshMemberList();
                });
            });
            this.cdr.markForCheck();
            // @ts-ignore
            this.idOutline = data1.Id;
            this.editSettings = {
              allowDeleting: true,
              allowAdding: true,
              allowEditing: true,
              mode: 'Dialog',
            };
            this.router.navigate(['../edit', this.idOutline], {
              relativeTo: this.route,
            });
            this.toastService.success(
              'Đăng ký đề cương thành công!',
              'Thành công'
            );
            this.documentService
              .getTopicDocumentByIdTopic(this.outlineDetails.ParentId)
              .subscribe((data) => {
                for (let index = 0; index < this.listFile.length; index++) {
                  const element = this.listFile[index];
                  this.documentDetail.FileUrl = element.FileUrl;
                  this.documentDetail.TopicId = x;
                  this.documentDetail.Description = element.Description;
                  this.documentService
                    .CreateTopicDocument(this.documentDetail)
                    .subscribe((res) => {});
                }
              });
            this.memberService
              .getTopicMemberByIdTopic(this.outlineDetails.ParentId)
              .subscribe((data) => {
                for (let index = 0; index < data.value.length; index++) {
                  const element = data.value[index];
                  this.memberDetail.MemberId = element.MemberId;
                  this.memberDetail.TopicId = x;
                  this.memberDetail.Role = element.Role;
                  this.memberDetail.Description = element.Description;
                  this.memberService
                    .CreateTopicMember(this.memberDetail)
                    .subscribe(() => {});
                }
              });

            this.listRole.forEach((element) => {
              const Title = `Đề cương mới cần duyệt`;
              const Detail = `Đạo diễn <strong>${this.handleRenderMember(
                data1.CreatedBy
              )}</strong> đã gửi một đề cương mới tên là <strong>${
                data1.Name
              }</strong> cần bạn duyệt. Vui lòng kiểm tra và xử lý.`;
              this.notifyService
                .CreateNotify(
                  element.UserId,
                  NotifyActionType.ADD,
                  NotifyObjectType.OUTLINE,
                  data1.Id,
                  Title,
                  Detail
                )
                .subscribe((data) => {});
            });
          },
          (error) => {
            console.error('Create Error:', error);
          }
        );
      }
    }
    if (this.idOutline) {
      if (this.outlineDetails.Name == '') {
        this.messageNameNotification = true;
      } else {
        this.messageNameNotification = false;
      }

      if (this.outlineDetails.Name != '') {
        if (this.outlineDetails.Status == TopicStatus.REJECT) {
          this.outlineDetails.Status = TopicStatus.INPROCRESS;
        }
        this.service.UpdateTopic(this.outlineDetails, this.idOutline).subscribe(
          () => {
            this.cdr.markForCheck();

            this.toastService.success(
              'Cập nhật đề cương thành công!',
              'Thành công'
            );

            this.listRole.forEach((element) => {
              const Title = `Đề cương đã được cập nhật`;
              const Detail = `Đạo diễn <strong>${this.handleRenderMember(
                this.outlineDetails.CreatedBy
              )}</strong> đã cập nhật thông tin đề cương: <strong>${
                this.outlineDetails.Name
              }</strong>. Vui lòng kiểm tra và duyệt lại.`;
              this.notifyService
                .CreateNotify(
                  element.UserId,
                  NotifyActionType.EDIT,
                  NotifyObjectType.OUTLINE,
                  this.outlineDetails.Id,
                  Title,
                  Detail
                )
                .subscribe((data) => {});
            });
          },
          (error) => {}
        );
      }
    }
  }

  actionCompleteMem(args: any) {
    if (
      (args as any).requestType === 'beginEdit' ||
      (args as any).requestType === 'add'
    ) {
      const dialog = (args as any).dialog;
      dialog.width = 600;
      dialog.header =
        (args as any).requestType === 'beginEdit'
          ? 'Chỉnh sửa'
          : 'Thêm nhân lực';
    }
  }
  loadUser() {
    this.serviceUser.getAllUserCheckStatus().subscribe((data: any) => {
      this.listUser = data.value.filter(
        (item: any) => item.UserName !== undefined
      );
    });
  }
  onSubmitApprove(result: ApprovedResultStatus) {
    if (this.idOutline) {
      let detail = new Approved();
      let userLogged: UserLogged = new UserLogged();
      detail.ObjectId = this.idOutline as number;
      detail.ObjectType = ApprovedObjectType.OUTLINE;
      detail.Result = result;
      detail.ProcessedBy = userLogged.getCurrentUser().userId;
      detail.ProcessedAt = new Date();
      if (this.approvedDetail.Comment !== undefined) {
        detail.Comment = this.approvedDetail.Comment;
      }
      if (result == 1) {
        detail.Comment = this.approvedDetail.Comment;
      }

      this.approvedDetail = detail;
      let Title = '';
      let Detail = '';
      if (result === ApprovedResultStatus.APPROVED) {
        this.outlineDetails.Status = TopicStatus.APPROVE;
        this.editSettings = {
          allowDeleting: false,
          allowAdding: false,
          allowEditing: false,
          mode: 'Dialog',
        };
        Title = `Đề cương đã được duyệt`;
        Detail = `Đề cương <strong>${
          this.outlineDetails.Name
        }</strong> đã được duyệt bởi <strong>${
          this.detailUser.FirstName + ' ' + this.detailUser.LastName
        }</strong>. Bạn có thể bắt đầu bước tiếp theo ngay bây giờ.`;
      }

      if (result === ApprovedResultStatus.REJECT) {
        this.outlineDetails.Status = TopicStatus.REJECT;
        this.editSettings = {
          allowDeleting: false,
          allowAdding: false,
          allowEditing: false,
          mode: 'Dialog',
        };
        Title = `Đề cương không được duyệt`;
        Detail = `Đề cương "<strong>${this.outlineDetails.Name}</strong>" của bạn đã không được duyệt lần này. Cần có một số điều chỉnh hoặc bổ sung để đảm bảo tính đầy đủ và phù hợp.`;
      }

      this.service
        .UpdateTopic(this.outlineDetails, this.idOutline)
        .subscribe((data) => {
          this.serviceApproved
            .CreateApprove(this.approvedDetail)
            .subscribe((data) => {
              this.aprovedTimes = this.aprovedTimes + 1;

              this.toastService.success(`${this.handleRenderResult(result)}`);
              this.notifyService
                .CreateNotify(
                  this.outlineDetails.CreatedBy,
                  result === ApprovedResultStatus.APPROVED
                    ? NotifyActionType.APPROVE
                    : NotifyActionType.REJECT,
                  NotifyObjectType.OUTLINE,
                  this.idOutline as number,
                  Title,
                  Detail
                )
                .subscribe();
              this.loadOutline();
            });
        });
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
  handleRenderDate(date: Date) {
    const timeString = date.toTimeString().slice(0, 5);
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric' as const,
    };

    const dateFormatter = new Intl.DateTimeFormat('en-US', options);
    const formattedDate = dateFormatter.format(date);

    const [month, day, year] = formattedDate.split('/');

    return `${day}/${month}/${year}  ${timeString}`;
  }
  handleRenderResult(result: number) {
    switch (result) {
      case ApprovedResultStatus.APPROVED:
        return 'Đã duyệt';
      case ApprovedResultStatus.REJECT:
        return 'Đã từ chối';
      default:
        return '';
    }
  }
  onInputComment(value: any) {
    const key = value.key;
    const event = value.value;
    const data = { ...this.approvedDetail, [key]: event };
    this.approvedDetail = data;
  }
  onCancelClick() {
    if (!this.idOutline) {
      this.router.navigate(['../'], { relativeTo: this.route });
    } else {
      this.router.navigate(['../../'], { relativeTo: this.route });
    }
  }
  refreshMemberList() {
    if (this.idOutline) {
      this.memberService
        .getTopicMemberByTopicId(this.idOutline)
        .subscribe((data) => {
          this.listMembers = data.value;
        });
    }
  }
  actionBeginMember(args: SaveEventArgs): void {
    if (args.action === RequestTypeAction.ADD) {
      if (this.idOutline) {
        if (this.memberDetail.MemberId == undefined) {
          if (args.requestType == 'save') {
            this.messageMember = true;
            args.cancel = true;
          } else {
            args.cancel = false;
          }
        } else {
          this.memberDetail.TopicId = parseInt(this.idOutline as string);
          this.memberService.CreateTopicMember(this.memberDetail).subscribe(
            (data) => {
              this.refreshMemberList();
            },
            () => {
              (args as any).cancel = true;
            }
          );
        }
      }
    }
    if ((args as any).requestType === RequestTypeAction.BEGINEDIT) {
      this.memberDetail = args.rowData as TopicMember;
    }
    if (args.action === RequestTypeAction.EDIT) {
      this.memberService
        .UpdateTopicMember(this.memberDetail, this.memberDetail.Id)
        .subscribe(
          (data) => {
            this.memberDetail = new TopicMember();
            this.refreshMemberList();
          },
          () => {
            (args as any).cancel = true;
          }
        );
    }
    if (args.requestType === 'delete') {
      const dataRow = (args.data as TopicMember[])[0];
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
        this.memberService.DeleteTopicMember(dataRow.Id).subscribe(
          (data) => {
            this.refreshMemberList();
            this.toastService.success('Xóa thành công!');
          },
          () => {
            this.grid.dataSource = this.listDocument;
            this.toastService.warning('Có lỗi xảy ra...');
          }
        );
      }
  onFileUrlClick(fileUrl: any) {
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
  onDeleteFile(idx: number) {
    let arr = [];
    const topicDocs = this.outlineDetails.TopicDocuments;
    arr = topicDocs.splice(idx, 1);
    this.deleteDocument.push(arr[0]);
    this.outlineDetails.TopicDocuments = topicDocs;
  }
  onUploading() {
    if (this.fileUpload && !this.documentDetail.Id) {
      const formData: FormData = new FormData();
      formData.append('formFile', this.fileUpload);
      this.serviceFile
        .upLoadFile(formData)
        .pipe(finalize(() => {}))
        .subscribe((res: any) => {
          const topDoc = new TopicDocument();
          const fileUrl =
            `${environment.apiUrl}/custom/GetFile?filename=` + res.filename;
          topDoc.FileUrl = fileUrl;
          topDoc.Description = this.documentDetail.Description;
          this.outlineDetails.TopicDocuments.push(topDoc);
          this.gridDocuments.refresh();
          this.file = '';
          this.fileUpload = undefined;
          this.ejDialogDocuments.hide();
        });
    } else if (this.documentDetail.Id) {
    } else {
      alert('File not found');
    }
  }
  createChunk(
    videoId: string,
    start: any,
    chunkEnd: number,
    chunkSize: number,
    chunkCounter: number,
    fileName: string,
    numberOfChunks: number
  ) {
    chunkCounter++;
    chunkEnd = Math.min(start + chunkSize, this.fileUpload.size);
    const chunk = this.fileUpload.slice(start, chunkEnd);
    const chunkForm: FormData = new FormData();
    if (videoId) {
      chunkForm.append('videoId', videoId);
      chunkForm.append('file', chunk, fileName);
    }
    this.uploadChunk(
      videoId,
      chunkForm,
      start,
      chunkEnd,
      chunkSize,
      chunkCounter,
      numberOfChunks
    );
  }
  uploadChunk(
    videoId: string,
    chunkForm: FormData,
    start: any,
    chunkEnd: any,
    chunkSize: any,
    chunkCounter: any,
    numberOfChunks: number
  ) {
    this.oReq.timeout = 300000;
    var self = this;
    this.oReq.upload.onprogress = function (oEvent) {
      if (oEvent.lengthComputable) {
        // self.percentComplete = Math.round((oEvent.loaded / oEvent.total) * 100);
        // console.log('self', self.percentComplete);

        var percentComplete = Math.round((oEvent.loaded / oEvent.total) * 100);
        var totalPercentComplete = Math.round(
          ((chunkCounter - 1) / numberOfChunks) * 100 +
            percentComplete / numberOfChunks
        );
        self.percentComplete = totalPercentComplete;
        self.spinnerService.progressChange(totalPercentComplete);
        // console.log('totalPercentComplete', self.percentComplete);
      } else {
        // console.log('not computable');
        // Unable to compute progress information since the total size is unknown
      }
    };

    this.oReq.open('POST', environment.uploadUrl + '/custom/Upload', true);

    var blobEnd = chunkEnd - 1;
    var contentRange = 'bytes ' + start + '-' + blobEnd + '/' + this.file.size;
    this.oReq.setRequestHeader('Content-Range', contentRange);

    this.oReq.onload = (event: any) => {
      var resp = JSON.parse(this.oReq.response);
      start += chunkSize;
      if (start < this.fileUpload.size) {
        this.createChunk(
          videoId,
          start,
          chunkEnd,
          chunkSize,
          chunkCounter,
          this.fileUpload.name,
          numberOfChunks
        );
      } else {
        this.fileUploadService
          .FinishUpload(
            videoId,
            this.fileUpload.name,
            this.fileUpload.size,
            numberOfChunks,
            this.fileUpload.name,
            this.fileUpload.name,
            DBType.THNDFILM,
            this.userLogged.getCurrentUser().userId
          )
          .subscribe(
            (data) => {
              this.spinnerService.hide();
              const topDoc = new TopicDocument();
              topDoc.FileUrl = data.url;
              topDoc.Description = this.documentDetail.Description;
              topDoc.TopicId = this.idOutline as number;
              topDoc.UploadPartId = data.entityId;
              this.documentService
                .CreateTopicDocument(topDoc)
                .subscribe((res) => {
                  this.loadOutline();
                });
              this.file = '';
              this.fileUpload = undefined;
            },
            () => {
              this.spinnerService.enableCloseBtn();
            }
          );
      }
    };
    this.oReq.onerror = (event: any) => {
      this.spinnerService.enableCloseBtn();
      this.loadOutline();
      this.toastService.warning('Tải lên thất bại. Vui lòng thử lại...');
    };
    this.oReq.send(chunkForm);
  }

  actionBeginDocuments(args: SaveEventArgs): void {
    if (
      args.requestType === 'beginEdit' ||
      args.requestType === 'add' ||
      args.requestType === 'delete'
    ) {
      // Store the original data in case we need to revert
      this.listDocumentOriginal = [
        ...this.gridFile.getCurrentViewRecords(),
      ] as TopicDocument[];
    }
    if (args.action === RequestTypeAction.ADD) {
      this.messageFile = false;
      if (this.idOutline) {
        if (this.fileUpload == undefined) {
          if (args.requestType == 'save') {
            this.messageFile = true;
            args.cancel = true;
          } else {
            args.cancel = false;
          }
        } else {
          this.messageFile = false;
          if (this.fileUpload && !this.documentDetail.Id) {
            const chunkSize = 104857600;
            const fileName = this.fileUpload.name;
            const numberOfChunks = Math.ceil(this.fileUpload.size / chunkSize);
            let start = 0;
            let chunkEnd = start + chunkSize;
            this.spinnerService.show();
            let chunkCounter = 0;

            this.fileUploadService.StartUpload(DBType.THNDFILM).subscribe(
              (data) => {
                this.createChunk(
                  data.videoId,
                  start,
                  chunkEnd,
                  chunkSize,
                  chunkCounter,
                  fileName,
                  numberOfChunks
                );
              },
              () => {}
            );
          }
        }
      }
    }
    if ((args as any).requestType === RequestTypeAction.BEGINEDIT) {
      this.documentDetail = args.rowData as TopicDocument;
    }
    if (args.action === RequestTypeAction.EDIT) {
      this.documentService
        .UpdateTopicDocument(this.documentDetail, this.documentDetail.Id)
        .subscribe(
          (data) => {
            this.documentDetail = new TopicDocument();
            this.loadOutline();
          },
          () => {
            (args as any).cancel = true;
          }
        );
    }
    if (args.requestType === 'delete') {
      const dataRow = (args.data as TopicDocument[])[0];
      args.cancel = true;
      this.dialog.show();
      this.dialog.header = 'Xác nhận xóa thư mục';
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
    const data = dataRow as TopicDocument[];

        this.documentService.DeleteTopicDocument(dataRow.Id).subscribe(
          (data) => {
            this.loadOutline();
            this.toastService.success('Xóa thành công!');
          },
          () => {
            this.gridFile.dataSource = this.listDocument;
            this.toastService.warning('Có lỗi xảy ra...');
          }
        );
      }
  actionCompleteDoc(args: any) {
    if (
      (args as any).requestType === 'beginEdit' ||
      (args as any).requestType === 'add'
    ) {
      const dialog = (args as any).dialog;
      dialog.width = 600;
      dialog.header =
        (args as any).requestType === 'beginEdit'
          ? 'Chỉnh sửa'
          : 'Thêm mới tài liệu';
    }
  }
  fileChange(event: any) {
    const reader = new FileReader();
    if (event.files.length) {
      this.file = event.files[0].name;
      this.fileUpload = event.files[0];
      this.documentDetail.FileUrl = this.fileUpload.name;
    }
  }
  removeFile(): void {
    this.file = '';
    this.fileUpload = undefined;
  }
  onInputChangeDoc(value: any) {
    const key = value.key;
    const event = value.value;
    const data = { ...this.documentDetail, [key]: event };
    this.documentDetail = data;
  }
  rowDataBound = (args: any) => {
    console.log('args.', args);

    if (args.row) {
      if (args.data?.UploadPart?.FileType !== 2) {
        args.row.querySelector('.e-custombtn').style.display = 'none';
        
      }
    }
  };
  commandClick(args: any) {
    this.open = true;
    setTimeout(() => {
      jQuery('#videoCompressorModal').modal('show');
    }, 100);
    this.uploadPartId = args.rowData.UploadPartId;
  }
  onSuccessUploadPart(event: any) {}
  onHideModal() {
    this.open = false;
  }
}
