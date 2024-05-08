import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  CommandModel,
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
} from 'src/app/core/models/database/db.model';
import { EmitType } from '@syncfusion/ej2-base';
import { BroadCastingDocumentService } from 'src/app/core/services/broad-casting-document.service';
import { BroadCastingService } from 'src/app/core/services/broad-casting.service';
import { CommoncategoryService } from 'src/app/core/services/commoncategory.service';
import { UploadService } from 'src/app/core/services/file-upload.service';
import { RolePermissionService } from 'src/app/core/services/role-permission.service';
import {
  AppRoles,
  CommonCategoriesType,
  DBType,
  RequestTypeAction,
} from 'src/app/core/utils/constant';
import { UserLogged } from 'src/app/core/utils/userLogged';
import { SpinnerService } from 'src/app/theme/components/spinner/spinner.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-broadcasting-document',
  templateUrl: './broadcasting-document.component.html',
  styleUrls: ['./broadcasting-document.component.scss'],
})
export class BroadcastingDocumentComponent implements OnInit {
  idBroadCasting: any;
  planId: any;
  public listBroadCastingDocument: Broadcastingdocument;
  public listBroadCasting: Broadcasting;
  public documentDetail: Broadcastingdocument;
  public broadCastingDetail: Broadcasting;
  public listVtv: Commoncategory;
  public listVtvDetail: Commoncategory; 
  public listDocumentOriginal: Broadcastingdocument[] = [];
  public listChannel: Commoncategory;
  public messageChannel = false;
  isCollapsed = false;
  messageFile = false;
  public deleteDocument: Broadcastingdocument[] = [];
  isCollapsed1 = false;
  public dropdownFiels: Object;
  file: any;
  messageVTV: boolean = false;
  public editSettings: EditSettingsModel = {
    allowDeleting: false,
    allowAdding: false,
    allowEditing: false,
    mode: 'Dialog',
  };
  public targetElement: HTMLElement;
  private oReq =  new XMLHttpRequest();
  private percentComplete : number;
  public hideDialog: EmitType<object> = () => {
    this.dialog.hide();
  };

  public initilaizeTarget: EmitType<object> = () => {
    this.targetElement = this.container.nativeElement.parentElement;
  };
  @ViewChild('ejDialogVideo') public dialog: DialogComponent;
  // Create element reference for dialog target element.
  @ViewChild('container', { read: ElementRef, static: true }) container:
    | ElementRef
    | any;
  public toolbarOptions: ToolbarItems[];
  public pageSettings: PageSettingsModel;
  public idPlan: any;
  public checkBroadcastingTime: boolean = false;
  public checkStatus: boolean = false;
  private readonly canGoBack: boolean;
  @ViewChild('gridVideo') public gridVideo: GridComponent;
  public fileUpload: any;
  private userLogged: UserLogged = new UserLogged();
  public idUpload: any;
  public uploadPartId: any;
  public dropEle?: HTMLElement;
  public open: boolean = false;
  public commands: CommandModel[];
  @ViewChild('orderForm') public orderForm?: FormGroup;
  @ViewChild('ejDialogMembers') ejDialogMembers: DialogComponent;
  @ViewChild('ejDialogDocuments') ejDialogDocuments: DialogComponent;
  constructor(
    private readonly service: BroadCastingDocumentService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly toastService: ToastrService,
    private readonly serviceCommoncategory: CommoncategoryService,
    public fileUploadService: UploadService,
    private spinnerService: SpinnerService,
    private readonly serviceBroadCasting: BroadCastingService,
    private roleRightService: RolePermissionService
  ) {
    this.idBroadCasting = route.snapshot.params['documentId'];
    this.planId = route.snapshot.params['id'];
    if (this.roleRightService.hasRole([AppRoles.DIRECTOR])) {
      this.toolbarOptions = ['Add', 'Edit', 'Delete'];

      if (this.editSettings) {
        this.checkStatus = false;
        this.editSettings.allowEditing = true;
        this.editSettings.allowAdding = true;
        this.editSettings.allowDeleting = true;
      }
    } else if (this.roleRightService.hasRole([AppRoles.LEADER])) {
      if (this.editSettings) {
        this.checkStatus = true;
        this.editSettings.allowEditing = false;
        this.editSettings.allowAdding = false;
        this.editSettings.allowDeleting = false;
      }
    }
    this.canGoBack = !!this.router.getCurrentNavigation()?.previousNavigation;
  }
  ngOnInit(): void {
    this.commands = [
      {
        buttonOption: {
          content: 'Nén file',
          
        },
      },
    ];
    this.listBroadCasting = new Broadcasting();
    this.loadBroadCasting();
    this.listVtvDetail = new Commoncategory();

    this.loadVTV();
    this.dropdownFiels = { text: 'Name', value: 'Id' };
  }
  loadBroadCasting() {
    if (this.idBroadCasting) {
      this.serviceBroadCasting
        .getBroadCastingById(this.idBroadCasting)
        .subscribe((data) => {
          this.listBroadCasting = data.value[0];
          this.listVtvDetail = this.listBroadCasting.Channel;
          this.service
            .getAllBoardDocumentByIdBroadCasting(this.idBroadCasting)
            .subscribe((data) => {
              this.listBroadCastingDocument = data.value;
            });
        });
    } else {
      this.listBroadCasting = new Broadcasting();
    }
  }
  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
  }
  toggleCollapse1() {
    this.isCollapsed1 = !this.isCollapsed1;
  }
  onSubmit() {
    if (this.listBroadCasting.BroadcastingTime == undefined) {
      this.checkBroadcastingTime = true;
    } else {
      this.checkBroadcastingTime = false;
    }
    this.messageChannel = false;
    if (this.idBroadCasting && this.checkBroadcastingTime == false) {
      this.serviceBroadCasting
        .UpdateBroadCasting(this.listBroadCasting, this.idBroadCasting)
        .subscribe((data) => {
          this.toastService.success('Cập nhật thành công', 'Thành công');
        });
    }
    if (!this.idBroadCasting) {
      this.messageChannel = false;
      this.checkBroadcastingTime = false;
      if (this.listBroadCasting.ChannelId == undefined) {
        this.messageChannel = true;
      } else {
        this.messageChannel = false;
      }
      if (this.listBroadCasting.BroadcastingTime == undefined) {
        this.checkBroadcastingTime = true;
      } else {
        this.checkBroadcastingTime = false;
      }
      if (this.messageChannel == false && this.checkBroadcastingTime == false)
        this.listBroadCasting.PostProductionPlaningId = this.planId;
      {
        this.serviceBroadCasting
          .CreateBroadCasting(this.listBroadCasting)
          .subscribe((data) => {
            this.toastService.success('Thêm mới thành công', 'Thành công');
            this.idBroadCasting = data.Id;
            this.router.navigate(['../edit-document', this.idBroadCasting], {
              relativeTo: this.route,
            });
          });
      }
    }
  }
  loadVTV() {
    this.serviceCommoncategory
      .getCateByType(CommonCategoriesType.TVSTATION)
      .subscribe((data) => {
        this.listVtv = data.value;
      });
  }
  onChange(event: any) {
    this.onChangeVTV(event);
  }
  onInputChange(value: any) {
    const key = value.key;
    const event = value.value;
    const data = { ...this.listBroadCasting, [key]: event };
    this.listBroadCasting = data;
    if (key === 'Duration') {
      this.listBroadCasting.Duration = parseFloat(event);
    }
  }
  onChangeVTV(Id: any) {
    if (Id) {
      this.serviceCommoncategory
        .getCateByTypeAndParentId(CommonCategoriesType.TVCHANNEL, Id)
        .subscribe((data) => {
          this.listChannel = data.value;
        });
    } else {
      this.serviceCommoncategory
        .getCateByType(CommonCategoriesType.TVCHANNEL)
        .subscribe((data) => {
          this.listChannel = data.value;
        });
    }
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
    const topicDocs = this.listBroadCasting.Broadcastingdocuments;
    arr = topicDocs.splice(idx, 1);
    this.deleteDocument.push(arr[0]);
    this.listBroadCasting.Broadcastingdocuments = topicDocs;
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
  actionBeginDocuments(args: SaveEventArgs): void {
    if (
      args.requestType === 'beginEdit' ||
      args.requestType === 'add' ||
      args.requestType === 'delete'
    ) {
      // Store the original data in case we need to revert
      this.listDocumentOriginal = [
        ...this.gridVideo.getCurrentViewRecords(),
      ] as Broadcastingdocument[];
    }
    if (args.action === RequestTypeAction.ADD) {
      this.messageFile = false;
      if (this.idBroadCasting) {
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
      this.documentDetail = args.rowData as Broadcastingdocument;
    }
    if (args.action === RequestTypeAction.EDIT) {
      this.service
        .UpdateTopicDocument(this.documentDetail, this.documentDetail.Id)
        .subscribe(
          (data) => {
            this.documentDetail = new Broadcastingdocument();
            this.loadBroadCasting();
          },
          () => {
            (args as any).cancel = true;
          }
        );
    }
    if (args.requestType === 'delete') {
      const dataRow = (args.data as Broadcastingdocument[])[0];
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
          click: this.onConfirmDeleteVideo.bind(this, dataRow),
          buttonModel: { content: 'OK', isPrimary: true },
        },
        {
          click: this.hideDialog.bind(this),
          buttonModel: { content: 'Hủy' },
        },
      ];
    }
  }
    
  onConfirmDeleteVideo(dataRow: any) {
    this.dialog.hide();
        this.service.DeleteTopicDocument(dataRow.Id).subscribe(
          (data) => {
            this.loadBroadCasting();
            this.toastService.success('Xóa thành công!');
          },
          () => {
            this.gridVideo.dataSource = this.listBroadCasting;
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
              const topDoc = new Broadcastingdocument();
              topDoc.FileUrl = data.url;
              topDoc.Description = this.documentDetail.Description;
              topDoc.BroadcastingId = this.idBroadCasting as number;
              topDoc.UploadPartId = data.entityId;
              this.service
                .CreateTopicDocument(topDoc)
                .subscribe((res) => {
                  this.documentDetail = new Broadcastingdocument();
                  this.loadBroadCasting();
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
      this.loadBroadCasting();
      this.toastService.warning('Tải lên thất bại. Vui lòng thử lại...');
    };
    this.oReq.send(chunkForm);
  }
  onCancelClick() {
    if (!this.idPlan) {
      this.router.navigate(['/lich-phat-song/danh-sach/edit/' + this.planId], {
        relativeTo: this.route,
      });
    } else {
      this.router.navigate(['../../'], { relativeTo: this.route });
    }
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
    console.log("command click" , args);
    this.open = true;
    setTimeout(() => {
      jQuery('#videoCompressorModal').modal('show');
    }, 100);
    this.uploadPartId = args.rowData.UploadPartId;
    console.log("uploadpart Id" , this.uploadPartId);
  }
  onSuccessUploadPart(event: any) {}
  onHideModal() {
    this.open = false;
  }
}
