import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TopicService } from 'src/app/core/services/topic.service';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';
import {
  Approved,
  Commoncategory,
  Notify,
  Topic,
  TopicDocument,
  User,
} from 'src/app/core/models/database/db.model';
import { EmitType, L10n } from '@syncfusion/ej2-base';
import { Location } from '@angular/common';
import { UploadFileService } from 'src/app/core/services/upload-file.service';
import { finalize, forkJoin } from 'rxjs';
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
import { environment } from 'src/environments/environment';
import { TopicDocumentService } from 'src/app/core/services/topic-document.service';
import { CommoncategoryService } from 'src/app/core/services/commoncategory.service';
import { UserService } from 'src/app/core/services/user.service';
import { TopicMember } from 'src/app/core/models/database/db.model';
import {
  CommandModel,
  DialogEditEventArgs,
  EditSettingsModel,
  GridComponent,
  SaveEventArgs,
  ToolbarItems,
} from '@syncfusion/ej2-angular-grids';
import { FormGroup } from '@angular/forms';
import { TopicMemberService } from 'src/app/core/services/topic-member.service';
import { TextBoxComponent } from '@syncfusion/ej2-angular-inputs';
import { ApprovedService } from 'src/app/core/services/approve.service';
import { UploadService } from 'src/app/core/services/file-upload.service';
import { UserLogged } from 'src/app/core/utils/userLogged';
import { ToastrService } from 'ngx-toastr';
import { SpinnerService } from 'src/app/theme/components/spinner/spinner.service';
import { RolePermissionService } from 'src/app/core/services/role-permission.service';
import { NotifyService } from 'src/app/core/services/notify.service';
import { UserRoleService } from 'src/app/core/services/user-role.service';

@Component({
  selector: 'app-topic-detail',
  templateUrl: './topic-detail.component.html',
  styleUrls: ['./topic-detail.component.scss'],
})
export class TopicDetailComponent implements OnInit {
  public topicDetail: Topic;
  public idTopic: string | number | null;
  public dropEle?: HTMLElement;
  public status = {
    APPROVE: ApprovedResultStatus.APPROVED,
    REJECT: ApprovedResultStatus.REJECT,
  };
  listTopicCate: Array<any> = [];
  public approvedDetail: Approved = new Approved();
  public documentDetail: TopicDocument = new TopicDocument();
  public memberDetail: TopicMember = new TopicMember();
  public listDocument: TopicDocument[] = [];
  public listDocumentOriginal: TopicDocument[] = [];
  isCommentVisible: boolean = false;
  selectedCommentIndex: number = -1;
  public listMembers: TopicMember[] = [];
  public deleteDocument: TopicDocument[] = [];
  @ViewChild('ejDialogDocuments') ejDialogDocuments: DialogComponent;
  @ViewChild('ejDialogMembers') ejDialogMembers: DialogComponent;
  @ViewChild('gridDocument') gridDocument: GridComponent;

  public editMode: boolean = false;
  public toolbarOptions: ToolbarItems[];
  public editSettings?: EditSettingsModel = {
    allowEditing: false,
    allowAdding: false,
    allowDeleting: false,
    mode: 'Dialog',
  };
  public orderData?: object | any;
  public aprovedTimes: number;
  @ViewChild('orderForm') public orderForm?: FormGroup;
  public targetElement: HTMLElement;
  public hideDialog: EmitType<object> = () => {
    this.dialog.hide();
    this.dialogMember.hide();
  };

  public initilaizeTarget: EmitType<object> = () => {
    this.targetElement = this.container.nativeElement.parentElement;
  };
  @ViewChild('gridMember') gridMember: GridComponent;
  @ViewChild('ejDialog') public dialog: DialogComponent;
  @ViewChild('ejDialogMember') public dialogMember: DialogComponent;
  // Create element reference for dialog target element.
  @ViewChild('container', { read: ElementRef, static: true }) container:
    | ElementRef
    | any;
  public dialogVisibility: boolean = false;
  public listUser: User[];
  public preLoadFiles: Object[] = [];
  public listRole: Array<any> = [];
  public file: any;
  public fileUpload: any;
  public dropdownRole: Object;
  public dropdownUser: Object;
  isButtonDisabled = false;
  isCollapsed = true;
  isCollapsed2 = false;
  isCollapsed3 = true;
  isCollapsed1 = true;
  messageMember: boolean = false;
  public message: boolean = false;
  messageFile: boolean = false;
  private readonly canGoBack: boolean;
  isCollapsed4 = true;
  messageTopicType: boolean = false;
  public listApproved: Approved[];
  public enableForm: boolean = false;
  public enableApprove: boolean = false;
  private userLogged: UserLogged = new UserLogged();
  private detailUser: User = new User();
  private oReq = new XMLHttpRequest();
  public percentComplete: number;
  public commands: CommandModel[];
  public idUpload: any;
  public uploadPartId: any;
  public open: boolean = false;
  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly location: Location,
    private readonly topicService: TopicService,
    private readonly toastService: ToastrService,
    private readonly notifyService: NotifyService,
    private readonly categoryService: CommoncategoryService,
    private readonly fileUploadService: UploadService,
    private readonly roleService: UserRoleService,
    private readonly topicDocservice: TopicDocumentService,
    private readonly topicMemberService: TopicMemberService,
    private readonly userDocService: UserService,
    private readonly approveService: ApprovedService,
    public changeDetectorRef: ChangeDetectorRef,
    private serviceFile: UploadFileService,
    private spinnerService: SpinnerService,
    public roleRightService: RolePermissionService
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
    this.canGoBack = !!this.router.getCurrentNavigation()?.previousNavigation;
  }

  ngOnInit(): void {
    this.idTopic = this.route.snapshot.paramMap.get('id');
    this.commands = [
      {
        buttonOption: {
          content: 'Nén file',
          cssClass: 'btn-video-compressor e-custombtn',
        },
      },
    ];
    this.topicDetail = new Topic();
    this.listApproved = new Array<Approved>();
    this.loadTopicDetail();
    this.dropEle = document.getElementById('droparea') as HTMLElement;
    this.dropdownRole = { text: 'Name', value: 'Id' };
    this.dropdownUser = { text: 'FirstName', value: 'Id' };
    this.changeDetectorRef.detectChanges();
  }

  onFileUrlClick(fileUrl: any) {
    if (fileUrl) {
      window.open(fileUrl, '_blank');
    }
  }
  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
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
  getFileName(fileUrl: string): string {
    if (fileUrl) {
      const fileName = fileUrl.substring(fileUrl.lastIndexOf('/') + 1);
      return fileName;
    }
    return '';
  }
  toggleCommentVisibility(index: number) {
    this.isCommentVisible = !this.isCommentVisible;
    this.selectedCommentIndex = this.isCommentVisible ? index : -1;
  }
  onDeleteFile(idx: number) {
    let arr = [];
    const topicDocs = this.topicDetail.TopicDocuments;
    arr = topicDocs.splice(idx, 1);
    this.deleteDocument.push(arr[0]);
    this.topicDetail.TopicDocuments = topicDocs;
  }
  submitAndDisable() {
    if (this.idTopic) {
    } else {
      this.onSubmit();
      if (this.message == false) {
        this.isButtonDisabled = true;
      }
    }
  }
  // Unused
  parseIntM(value: any) {
    return parseInt(value);
  }
  handleRenderMember(MemberId: number) {
    let userName: any = '';
    if (MemberId) {
      const user = this.listUser.find((item) => item.Id === MemberId);
      userName = `${user?.FirstName} ${user?.LastName}`;
    }
    return userName;
  }
  handleRenderResult(result: number) {
    switch (result) {
      case ApprovedResultStatus.APPROVED:
        return 'Đã phê duyệt';
      case ApprovedResultStatus.REJECT:
        return 'Đã từ chối';

      default:
        return '';
    }
  }
  handleRenderDate(date: Date) {
    const timeString = date.toTimeString().slice(0, 5);
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric' as const, // Set '2-digit' for a two-digit year
    };

    const dateFormatter = new Intl.DateTimeFormat('en-US', options);
    const formattedDate = dateFormatter.format(date);

    const [month, day, year] = formattedDate.split('/'); // Split the formatted date

    return `${day}/${month}/${year}  ${timeString}`;
  }
  actionBeginMember(args: SaveEventArgs): void {
    if (args.action === RequestTypeAction.ADD) {
      this.messageMember = false;
      if (this.idTopic) {
        if (this.memberDetail.MemberId == undefined) {
          if (args.requestType == 'save') {
            this.messageMember = true;
            args.cancel = true;
          } else {
            args.cancel = false;
          }
        } else {
          this.memberDetail.TopicId = parseInt(this.idTopic as string);

          this.topicMemberService
            .CreateTopicMember(this.memberDetail)
            .subscribe(
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
      this.topicMemberService
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
        this.topicMemberService.DeleteTopicMember(dataRow.Id).subscribe(
          (data) => {
            this.refreshMemberList();
            this.toastService.success('Xóa thành công!');
          },
          () => {
            this.gridDocument.dataSource = this.listDocument;
            this.toastService.warning('Có lỗi xảy ra...');
          }
        );
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
              topDoc.TopicId = this.idTopic as number;
              topDoc.UploadPartId = data.entityId;
              this.topicDocservice
                .CreateTopicDocument(topDoc)
                .subscribe((res) => {
                  this.refreshDocumentList();
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
      this.refreshDocumentList();
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
        ...this.gridDocument.getCurrentViewRecords(),
      ] as TopicDocument[];
    }
    if (args.action === RequestTypeAction.ADD) {
      this.messageFile = false;
      if (this.idTopic) {
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
      this.topicDocservice
        .UpdateTopicDocument(this.documentDetail, this.documentDetail.Id)
        .subscribe(
          (data) => {
            this.documentDetail = new TopicDocument();
            this.refreshDocumentList();
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

        this.topicDocservice.DeleteTopicDocument(dataRow.Id).subscribe(
          (data) => {
            this.refreshDocumentList();
            this.toastService.success('Xóa thành công!');
          },
          () => {
            this.gridDocument.dataSource = this.listDocumentOriginal;
            this.toastService.warning('Có lỗi xảy ra...');
          }
        );
      }
    // this.service.DeleteCate(dataRow.Id).subscribe(
    //   (data: Commoncategory) => {
    //     this.loadTopicDetail();
    //     this.toastService.success('Xóa thành công!');
    //   },
    //   () => {
    //     this.grid.dataSource = this.listDocument;
    //     this.toastService.warning('Có lỗi xảy ra...');
    //   }
    // );

    // if (args.requestType === RequestTypeAction.DELETE) {
    //   const data = args.data as TopicDocument[];
    //   data.forEach((item) => {
    //     this.topicDocservice.DeleteTopicDocument(item.Id).subscribe(
    //       (data) => {
    //         this.refreshDocumentList();
    //       },
    //       () => {
    //         (args as any).cancel = true;
    //       }
    //     );
    //   });
    // }


  actionCompleteMem(args: any) {
    if (
      (args as any).requestType === 'beginEdit' ||
      (args as any).requestType === 'add'
    ) {
      const dialog = (args as any).dialog;

      dialog.width = 600;
      // change the header of the dialog
      dialog.header =
        (args as any).requestType === 'beginEdit'
          ? 'Chỉnh sửa'
          : 'Thêm nhân lực';
    }
  }
  actionCompleteDoc(args: any) {
    if (
      (args as any).requestType === 'beginEdit' ||
      (args as any).requestType === 'add'
    ) {
      const dialog = (args as any).dialog;

      dialog.width = 600;
      // change the header of the dialog
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
    }
  }
  removeFile(): void {
    this.file = '';
    this.fileUpload = undefined;
  }
  loadTopicDetail() {
    this.userDocService
      .getUserByIds(this.userLogged.getCurrentUser().userId)
      .subscribe((data) => {
        this.detailUser = data.value[0];
      });
    this.roleService.getAllRole().subscribe((data) => {
      this.listRole = data.value;
    });
    this.categoryService
      .getCateByType(CommonCategoriesType.TOPIC)
      .subscribe((data) => {
        this.listTopicCate = data.value;
      });
    if (this.idTopic) {
      this.topicService.getTopicById(this.idTopic).subscribe((data) => {
        this.topicDetail = data.value[0];

        if (this.topicDetail.Status === TopicStatus.APPROVE) {
          this.editSettings = {
            allowDeleting: false,
            allowAdding: false,
            allowEditing: false,
            mode: 'Dialog',
          };
        }
        if (this.topicDetail.Status !== TopicStatus.NOTPROCESS) {
          this.approveService
            .getListApprovedByQuery(
              `$Filter=ObjectId eq ${this.idTopic} and ObjectType eq 0`
            )
            .subscribe((data) => {
              this.listApproved = data.value;
              this.aprovedTimes = data.value.length;
              const sortedList = data.value.sort((a: Approved, b: Approved) => {
                // @ts-ignore
                return new Date(b.ProcessedAt) - new Date(a.ProcessedAt);
              });
              this.changeDetectorRef.detectChanges();

              this.approvedDetail = sortedList[0];
            });
        }
      });
      this.topicMemberService
        .getTopicMemberByTopicId(this.idTopic)
        .subscribe((data) => {
          this.listMembers = data.value;
        });
      this.topicDocservice
        .getTopicDocumentByQuery(
          `$Filter=TopicId eq ${this.idTopic}&$Expand=UploadPart`
        )
        .subscribe((data) => {
          this.listDocument = data.value;
        });
    }
    this.userDocService
      .getListUserByQuery(
        '$Select=Id, FirstName, LastName, UserName, Email, Tel&$Filter=Status eq 1'
      )
      .subscribe((data) => {
        this.listUser = data.value;
      });
    // this.categoryService
    //   .getCateByType(CommonCategoriesType.ROLE)
    //   .subscribe((data) => {
    //     this.listRole = data.value;
    //   });
    // this.categoryService
    //   .getCateByType(CommonCategoriesType.TOPIC)
    //   .subscribe((data) => {
    //     this.listTopic = data.value;
    //   });
  }
  refreshMemberList() {
    if (this.idTopic) {
      this.topicMemberService
        .getTopicMemberByTopicId(this.idTopic)
        .subscribe((data) => {
          this.listMembers = data.value;
        });
    }
  }
  refreshDocumentList() {
    if (this.idTopic) {
      this.topicDocservice
        .getTopicDocumentByQuery(`$Filter=TopicId eq ${this.idTopic}`)
        .subscribe(
          (data) => {
            this.listDocument = data.value;
          },
          () => {
            if (
              this.listDocumentOriginal &&
              this.listDocumentOriginal.length > 0
            ) {
              this.listDocument = this.listDocumentOriginal;
            }
          }
        );
    }
  }

  onClickRow(data: any) {}
  onSubmit() {
    if (this.idTopic) {
      if (this.approvedDetail.Result == ApprovedResultStatus.REJECT) {
        if (this.topicDetail.Name == '') {
          this.message = true;
        } else {
          this.message = false;
          this.topicDetail.Status = TopicStatus.INPROCRESS;
          this.topicService
            .UpdateTopic(this.topicDetail, this.idTopic)
            .subscribe(
              () => {
                this.topicDetail.TopicDocuments.forEach((e) => {
                  if (!e.TopicId) {
                    e.TopicId = this.idTopic as number;
                    this.topicDocservice.CreateTopicDocument(e).subscribe();
                  }
                });

                this.deleteDocument.forEach((e) => {
                  if (e.TopicId) {
                    this.topicDocservice.DeleteTopicDocument(e.Id).subscribe();
                  }
                });
                this.toastService.success(
                  'Cập nhật đề tài thành công!',
                  'Thành công'
                );
                for (let index = 0; index < this.listRole.length; index++) {
                  const element = this.listRole[index].UserId;
                  // let formData = new Notify();

                  // formData.UserId = element;
                  // formData.SenderId = loggser.getCurrentUser().userId;
                  // formData.ObjectType = NotifyObjectType.TOPIC;
                  // formData.ObjectId = this.topicDetail.Id;
                  // formData.Status = NotifyStatus.NEW;
                  // formData.CreatedAt = new Date();
                  // formData.ActionType = NotifyActionType.EDIT;
                  const Title = `Đề tài đã được cập nhật `;
                  const Detail = `Đạo diễn <strong>${this.handleRenderMember(
                    this.topicDetail.CreatedBy
                  )}</strong> đã cập nhật đề tài: <strong>${
                    this.topicDetail.Name
                  }</strong>. Vui lòng kiểm tra và xử lý.`;

                  this.notifyService
                    .CreateNotify(
                      element,
                      NotifyActionType.EDIT,
                      NotifyObjectType.TOPIC,
                      this.topicDetail.Id,
                      Title,
                      Detail
                    )
                    .subscribe();
                }
              },
              (error) => {
                // alert(error);
              }
            );
        }
      } else {
        if (this.topicDetail.Name == '') {
          this.message = true;
        } else {
          this.message = false;
          this.topicService
            .UpdateTopic(this.topicDetail, this.idTopic)
            .subscribe(
              () => {
                this.toastService.success(
                  'Cập nhật đề tài thành công!',
                  'Thành công'
                );
                for (let index = 0; index < this.listRole.length; index++) {
                  const element = this.listRole[index].UserId;
                  // let formData = new Notify();

                  // formData.UserId = element;
                  // formData.SenderId = loggser.getCurrentUser().userId;
                  // formData.ObjectType = NotifyObjectType.TOPIC;
                  // formData.ObjectId = this.topicDetail.Id;
                  // formData.Status = NotifyStatus.NEW;
                  // formData.CreatedAt = new Date();
                  // formData.ActionType = NotifyActionType.EDIT;
                  const Title = `Đề tài đã được cập nhật`;
                  const Detail = `Đạo diễn <strong>${this.handleRenderMember(
                    this.topicDetail.CreatedBy
                  )}</strong> đã cập nhật đề tài: <strong>${
                    this.topicDetail.Name
                  }</strong>. Vui lòng kiểm tra và xử lý.`;

                  this.notifyService
                    .CreateNotify(
                      element,
                      NotifyActionType.EDIT,
                      NotifyObjectType.TOPIC,
                      this.topicDetail.Id,
                      Title,
                      Detail
                    )
                    .subscribe();
                }
                this.topicDetail.TopicDocuments.forEach((e) => {
                  if (!e.TopicId) {
                    e.TopicId = this.idTopic as number;
                    this.topicDocservice.CreateTopicDocument(e).subscribe();
                  }
                });

                this.deleteDocument.forEach((e) => {
                  if (e.TopicId) {
                    this.topicDocservice.DeleteTopicDocument(e.Id).subscribe();
                  }
                });
                // alert('Cập nhật thành công');
                if (this.canGoBack) {
                  // We can safely go back to the previous location as
                  // we know it's within our app.
                  this.location.back();
                } else {
                  // There's no previous navigation.
                  // Here we decide where to go. For example, let's say the
                  // upper level is the index page, so we go up one level.
                  this.router.navigate(['../../'], { relativeTo: this.route });
                }
              },
              (error) => {
                // alert(error);
              }
            );
        }
      }
    } else {
      this.topicDetail.Status = TopicStatus.NOTPROCESS;
      this.topicDetail.Type = TopicType.TOPIC;
      // this.topicDetail.TopicDocuments = this.listDocument;

      if (this.topicDetail.Name == undefined) {
        this.message = true;
      } else {
        this.message = false;
      }
      if (this.topicDetail.CategoryId == undefined) {
        this.messageTopicType = true;
      } else {
        this.messageTopicType = false;
      }
      if (this.messageTopicType == false && this.message == false) {
        const loggser = new UserLogged();
        this.topicDetail.CreatedBy = loggser.getCurrentUser().userId;
        this.topicDetail.CreatedAt = new Date();
        this.topicService.CreateTopic(this.topicDetail).subscribe(
          (res) => {
            // @ts-ignore
            this.idTopic = res.Id;
            this.editSettings = {
              allowDeleting: true,
              allowAdding: true,
              allowEditing: true,
              mode: 'Dialog',
            };
            this.router.navigate(['../edit', this.idTopic], {
              relativeTo: this.route,
            });

            this.toastService.success(
              'Đăng ký đề tài thành công!',
              'Thành công'
            );
            for (let index = 0; index < this.listRole.length; index++) {
              const element = this.listRole[index].UserId;
              // let formData = new Notify();

              // formData.UserId = element;
              // formData.SenderId = loggser.getCurrentUser().userId;
              // formData.ObjectType = NotifyObjectType.TOPIC;
              // formData.ObjectId = res.Id;
              // formData.Status = NotifyStatus.NEW;
              // formData.CreatedAt = new Date();
              // formData.ActionType = NotifyActionType.ADD;
              const title = `Đề tài mới cần duyệt`;
              const detail = `Đạo diễn <strong>${this.handleRenderMember(
                res.CreatedBy
              )}</strong> đã gửi một đề tài mới tên là <strong>${
                res.Name
              }</strong> cần bạn duyệt. Vui lòng kiểm tra và xử lý.`;

              this.notifyService
                .CreateNotify(
                  element,
                  NotifyActionType.ADD,
                  NotifyObjectType.TOPIC,
                  res.Id,
                  title,
                  detail
                )
                .subscribe();
            }
          },
          (error) => {
            console.error('', error);
          }
        );
      }
    }
  }

  onSubmitApprove(result: ApprovedResultStatus) {
    if (this.idTopic) {
      let userLogged: UserLogged = new UserLogged();
      // @ts-ignore
      this.approvedDetail.Id = undefined;
      this.approvedDetail.ObjectId = this.idTopic as number;
      this.approvedDetail.ObjectType = ApprovedObjectType.TOPIC;
      this.approvedDetail.Result = result;
      this.approvedDetail.ProcessedBy = userLogged.getCurrentUser().userId;
      this.approvedDetail.ProcessedAt = new Date(Date.now());
      let Title = '';
      let Detail = '';
      if (result === ApprovedResultStatus.APPROVED) {
        this.topicDetail.Status = TopicStatus.APPROVE;
        this.editSettings = {
          allowDeleting: false,
          allowAdding: false,
          allowEditing: false,
          mode: 'Dialog',
        };
        Title = `Đề tài đã được duyệt`;
        Detail = `<strong>${
          this.topicDetail.Name
        }</strong> đã được duyệt bởi <strong>${
          this.detailUser.FirstName + ' ' + this.detailUser.LastName
        }</strong>. Bạn có thể bắt đầu bước tiếp theo ngay bây giờ.`;
      }
      if (result === ApprovedResultStatus.REJECT) {
        this.topicDetail.Status = TopicStatus.REJECT;
        this.editSettings = {
          allowDeleting: false,
          allowAdding: false,
          allowEditing: false,
          mode: 'Dialog',
        };
        Title = `Đề tài không được duyệt`;
        Detail = `Đề tài "<strong>${this.topicDetail.Name}</strong>" của bạn đã không được duyệt lần này. Hãy tiếp tục cải thiện và phát triển ý tưởng của bạn để tạo ra một đề tài tốt hơn.`;
      }

      this.topicService
        .UpdateTopic(this.topicDetail, this.idTopic)
        .subscribe((data) => {
          this.approveService
            .CreateApprove(this.approvedDetail)
            .subscribe((data) => {
              this.aprovedTimes = this.aprovedTimes + 1;
              this.toastService.success(`${this.handleRenderResult(result)}`);
              this.notifyService
                .CreateNotify(
                  this.topicDetail.CreatedBy,
                  NotifyActionType.APPROVE,
                  NotifyObjectType.TOPIC,
                  this.idTopic as number,
                  Title,
                  Detail
                )
                .subscribe();
              this.loadTopicDetail();
            });
        });
    }
  }
  onInputChange(value: any) {
    const key = value.key;
    const event = value.value;
    const data = { ...this.topicDetail, [key]: event };
    this.topicDetail = data;
  }
  onInputComment(value: any) {
    const key = value.key;
    const event = value.value;
    const data = { ...this.approvedDetail, [key]: event };
    this.approvedDetail = data;
  }
  onChangeTopicType(args: any) {
    this.topicDetail.CategoryId = args.value;
  }
  onInputChangeDoc(value: any) {
    const key = value.key;
    const event = value.value;
    const data = { ...this.documentDetail, [key]: event };
    this.documentDetail = data;
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
  onCancelClick() {
    if (!this.idTopic) {
      this.router.navigate(['../'], { relativeTo: this.route });
    } else {
      this.router.navigate(['../../'], { relativeTo: this.route });
    }
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
    console.log('commandClick', args);
  }
  onSuccessUploadPart(event: any) {}
  onHideModal() {
    this.open = false;
  }
}
