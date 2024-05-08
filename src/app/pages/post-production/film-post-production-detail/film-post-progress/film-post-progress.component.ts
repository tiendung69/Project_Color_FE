import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  CommandModel,
  EditSettingsModel,
  GridComponent,
  SaveEventArgs,
  ToolbarItems,
} from '@syncfusion/ej2-angular-grids';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';
import { ToastrService } from 'ngx-toastr';
import {
  PostproductionPlaning,
  PostproductionProgress,
  Video,
} from 'src/app/core/models/database/db.model';
import { EmitType } from '@syncfusion/ej2-base';
import { CommoncategoryService } from 'src/app/core/services/commoncategory.service';
import { UploadService } from 'src/app/core/services/file-upload.service';
import { PostProPlanService } from 'src/app/core/services/post-pro-plan.service';
import { PostProductProgressService } from 'src/app/core/services/post-product-progress.service';
import { RolePermissionService } from 'src/app/core/services/role-permission.service';
import { VideoService } from 'src/app/core/services/video.service';
import {
  AppRoles,
  CommonCategoriesType,
  DBType,
  RequestTypeAction,
  TopicStatus,
  VideoType,
} from 'src/app/core/utils/constant';
import { UserLogged } from 'src/app/core/utils/userLogged';
import { SpinnerService } from 'src/app/theme/components/spinner/spinner.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-film-post-progress',
  templateUrl: './film-post-progress.component.html',
  styleUrls: ['./film-post-progress.component.scss'],
})
export class FilmPostProgressComponent implements OnInit {
  public idPostPlan: any;
  public idProgress: any;
  listPostPlan: PostproductionPlaning;
  public enableForm: boolean = false;
  public enableApprove: boolean = false;
  isCollapsed = false;
  listCate: Array<any> = [];
  private readonly canGoBack: boolean;
  isCollapsed1 = true;
  isCollapsed2 = true;
  public videoDetail: Video = new Video();
  public listVideo: Video[] = [];
  public listVideoOrigin: Video[] = [];
  check = false;
  public listStatus: any[] = [
  ///  { text: 'Chưa tiến hành', value: TopicStatus.NOTPROCESS },
    { text: 'Hoàn thành', value: true },
    { text: 'Đang tiến hành', value: false },
  ];
  checkProgressName = false;
  public fieldStatus = { text: 'text', value: 'value' };
  public field = { text: 'Name', value: 'Id' };
  public toolbarOptions: ToolbarItems[] = [];
  private oReq = new XMLHttpRequest();
  public editSettings: EditSettingsModel = {
    allowEditing: false,
    allowAdding: false,
    allowDeleting: false,
    mode: 'Dialog',
  };
  @ViewChild('gridVideo') public gridVideo: GridComponent;
  public fileUpload: any = undefined;
  public file: any = undefined;
  public messageFile: boolean = false;
  public listProress: PostproductionProgress;
  public progressDetail: PostproductionProgress;
  private userLogged = new UserLogged();
  public commands: CommandModel[];
  public idUpload: any;
  public uploadPartId: any;
  public dropEle?: HTMLElement;
  public percentComplete: number;
  public open: boolean = false;
  public targetElement: HTMLElement;
  public hideDialog: EmitType<object> = () => {
    this.dialogVideo.hide();
  };

  public initilaizeTarget: EmitType<object> = () => {
    this.targetElement = this.container.nativeElement.parentElement;
  };
  @ViewChild('ejDialog') public dialog: DialogComponent;
  // Create element reference for dialog target element.
  @ViewChild('container', { read: ElementRef, static: true }) container:
    | ElementRef
    | any;
  @ViewChild('orderForm') public orderForm?: FormGroup;
  @ViewChild('ejDialogVideo') dialogVideo: DialogComponent;
  @ViewChild('ejDialogDocuments') ejDialogDocuments: DialogComponent;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private service: PostProductProgressService,
    public serivcePostPlan: PostProPlanService,
    private toastService: ToastrService,
    private serviceCate: CommoncategoryService,
    private fileUploadService: UploadService,
    private spinnerService: SpinnerService,
    private videoService: VideoService,
    private roleRightService: RolePermissionService
  ) {
    this.idProgress = route.snapshot.params['progressId'];
    this.idPostPlan = route.snapshot.params['id'];

    this.canGoBack = !!this.router.getCurrentNavigation()?.previousNavigation;
    if (this.roleRightService.hasRole([AppRoles.DIRECTOR])) {
      this.enableForm = true;
      this.toolbarOptions = ['Add', 'Edit', 'Delete'];
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
    this.commands = [
      {
        buttonOption: {
          content: 'Nén file',
          
        },
      },
    ];
    this.listProress = new PostproductionProgress();
    this.loadPostProduction();
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
        allowEditing: false,
        allowAdding: false,
        allowDeleting: false,
        mode: 'Dialog',
      };
    }
    this.loadProgress();
  }

  loadProgress() {
    if (this.idProgress) {
      this.service.getPostProgressById(this.idProgress).subscribe((data) => {
        this.listProress = data.value[0];
        this.refreshVideoList();
      });
    }
  }
  onChangeStatus( args : any) {
    this.listProress.IsFinished = args.value;
  }
  loadPostProduction() {
    this.serviceCate
      .getCateByType(CommonCategoriesType.COST)
      .subscribe((data) => {
        this.listCate = data.value;
      });
    if (this.idPostPlan) {
      this.serivcePostPlan
        .getAllPostPlanById(this.idPostPlan)
        .subscribe((data) => {
          this.listPostPlan = data.value[0];
          if (this.listPostPlan.Status == 5) {
            this.check = true;
            this.editSettings = {
              allowEditing: false,
              allowAdding: false,
              allowDeleting: false,
              mode: 'Dialog',
            };
          }
        });
    }
  }
  onCancelClick() {
    if (!this.idProgress) {
      this.router.navigate(['../'], { relativeTo: this.route });
    } else {
      this.router.navigate(['../../'], { relativeTo: this.route });
    }
  }

  toggleForm() {
    this.isCollapsed = !this.isCollapsed;
  }
  toggleForm1() {
    this.isCollapsed1 = !this.isCollapsed1;
  }
  toggleForm2() {
    this.isCollapsed2 = !this.isCollapsed2;
  }
  onSubmit() {
    if (this.idProgress) {
      console.log("begfore adding",this.listProress);
      this.listProress.Expense = Number(this.listProress.Expense);
      this.listProress.TotalProgress = Number(this.listProress.TotalProgress);
      this.service
        .UpdatePostProgress(this.listProress, this.idProgress)
        .subscribe((data) => {
          this.toastService.success('Cập nhật thành công!', 'Thành công');
        });
    }
    if (!this.idProgress) {
      this.listProress.PostProductionId = this.idPostPlan;
      if (this.listProress.TotalProgress == undefined) {
        this.listProress.TotalProgress = 0;
      } else {
        this.listProress.TotalProgress = Number(this.listProress.TotalProgress);
      }
      if (this.listProress.Expense == undefined) {
        this.listProress.Expense = 0;
      } else {
        this.listProress.Expense = Number(this.listProress.Expense);
      }
      if (this.listProress.ExpenseType == undefined) {
        this.checkProgressName = true;
      } else {
        this.checkProgressName = false;
      }
      if (this.checkProgressName == false) {
        this.service.createPostProgresss(this.listProress).subscribe((data) => {
          this.router.navigate(['../edit-progress', data.Id], {
            relativeTo: this.route,
          });
          this.toastService.success('Thêm tiến độ thành công!', 'Thành công');
        });
      }
    }
  }
  onInputChange(input: any) {
    const { key, value } = input;
    const data = { ...this.listProress, [key]: value };
    this.listProress = data;
  }
  onFileUrlClick(fileUrl: any) {
    if (fileUrl) {
      window.open(fileUrl, '_blank');
    }
  }
  // Get filename
  getFileName(fileUrl: string): string {
    if (fileUrl) {
      const fileName = fileUrl.substring(fileUrl.lastIndexOf('/') + 1);
      return fileName;
    }
    return '';
  }

  // On file change
  fileChange(event: any) {
    if (event.files.length) {
      this.file = event.files[0].name;
      this.fileUpload = event.files[0];
    }
  }
  // Remove file
  removeFile(): void {
    this.file = '';
    this.fileUpload = undefined;
  }

  // Action complete grid video
  actionComplete(args: any) {
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
          : 'Thêm mới video';
    }
  }
  // Action begin grid video
  actionBegin(args: SaveEventArgs): void {
    if (
      args.requestType === 'beginEdit' ||
      args.requestType === 'add' ||
      args.requestType === 'delete'
    ) {
      // Store the original data in case we need to revert
      this.listVideoOrigin = [
        ...this.gridVideo.getCurrentViewRecords(),
      ] as Video[];
    }
    if (args.action === RequestTypeAction.ADD) {
      this.messageFile = false;
      if (this.idProgress) {
        if (this.fileUpload == undefined) {
          if (args.requestType == 'save') {
            this.messageFile = true;
            args.cancel = true;
          } else {
            args.cancel = false;
          }
        } else {
          this.messageFile = false;
          if (this.fileUpload && !this.videoDetail.Id) {
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
      this.videoDetail = args.rowData as Video;
    }
    if (args.action === RequestTypeAction.EDIT) {
      this.videoService
        .UpdateVideo(this.videoDetail, this.videoDetail.Id)
        .subscribe(
          (data) => {
            this.videoDetail = new Video();
            this.refreshVideoList();
          },
          () => {
            (args as any).cancel = true;
          }
        );
    }
    if (args.requestType === 'delete') {
      const dataRow = (args.data as Video[])[0];
      args.cancel = true;
      this.dialogVideo.show();
      this.dialogVideo.header = 'Xác nhận xóa thư mục';
      this.dialogVideo.content = 'Bạn có chắc chắn muốn tiếp tục không?';
      this.dialogVideo.animationSettings = {
        effect: 'Fade',
        duration: 100,
        delay: 0,
      };
      this.dialogVideo.buttons = [
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
    this.dialogVideo.hide();
    const data = dataRow as Video[];

        this.videoService.DeleteVideo(dataRow.Id).subscribe(
          (data) => {
            this.refreshVideoList();
            this.toastService.success('Xóa thành công!');
          },
          () => {
            this.gridVideo.dataSource = this.listVideo;
            this.toastService.warning('Có lỗi xảy ra...');
          }
        );
      }
    // if (args.requestType === RequestTypeAction.DELETE) {
    //   const data = args.data as Video[];
    //   data.forEach((item) => {
    //     this.videoService.DeleteVideo(item.Id).subscribe(
    //       (data) => {
    //         this.refreshVideoList();
    //       },
    //       () => {
    //         this.gridVideo.dataSource = this.listVideoOrigin;
    //         // (args as any).cancel = true;
    //       }
    //     );
    //   });
    // }
  //}

  // create chunk to upload
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
              const topDoc = new Video();
              topDoc.VideoUrl = data.url;
              topDoc.ObjectId = this.idProgress as number;
              topDoc.ObjectType = VideoType.POSTPRODGRESS;
              topDoc.UploadPartId = data.entityId;
              this.videoService
                .CreateVideo(topDoc)
                .subscribe((res) => {
                  this.videoDetail = new Video();
                  this.refreshVideoList();
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
      this.refreshVideoList();
      this.toastService.warning('Tải lên thất bại. Vui lòng thử lại...');
    };
    this.oReq.send(chunkForm);
  }

  // get list video by progress id
  refreshVideoList() {
    if (this.idProgress) {
      this.videoService
        .getVideoByQuery(
          `$Filter=ObjectId eq ${this.idProgress} and ObjectType eq 1`
        )
        .subscribe((data) => {
          this.listVideo = data.value;
        });
    }
  }
  onInputVideoChange(input: any) {
    const { key, value } = input;
    const data = { ...this.videoDetail, [key]: value };
    this.videoDetail = data;
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
