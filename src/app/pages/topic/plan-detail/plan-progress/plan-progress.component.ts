import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { EmitType } from '@syncfusion/ej2-base';
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
  PreproductionPlaning,
  PreproductionProgress,
  PreproductionSegment,
  Video,
} from 'src/app/core/models/database/db.model';
import { CommoncategoryService } from 'src/app/core/services/commoncategory.service';
import { UploadService } from 'src/app/core/services/file-upload.service';
import { PrePlanService } from 'src/app/core/services/pre-plan.service';
import { PreProgressService } from 'src/app/core/services/pre-progress.service';
import { PreSegmentService } from 'src/app/core/services/pre-segment.service';
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
  selector: 'app-plan-progress',
  templateUrl: './plan-progress.component.html',
  styleUrls: ['./plan-progress.component.scss'],
})
export class PlanProgressComponent implements OnInit {
  public progressId: any;
  private planId: any;
  private oReq = new XMLHttpRequest();
  public listCate: Array<any> = [];
  public enableForm: boolean = false;
  public percentComplete: number;
  public enableApprove: boolean = false;
  public progressDetail: PreproductionProgress = new PreproductionProgress();
  public videoDetail: Video = new Video();
  public isCollapsed = false;
  public isCollapsed1 = false;
  messageTypeCost: boolean = false;
  checkProgressName = false;
  public userLogged = new UserLogged();
  public listStatus: any[] = [
    { text: 'Chưa tiến hành', value: TopicStatus.NOTPROCESS },
    { text: 'Hoàn thành', value: TopicStatus.APPROVE },
    { text: 'Đang tiến hành', value: TopicStatus.INPROCRESS },
  ];
  listPlan: PreproductionPlaning;
  public listSegment: PreproductionSegment[] = [];
  public listVideo: Video[] = [];
  dropdownField: Object = { text: 'text', value: 'value' };
  field = { text: 'Name', value: 'Id' };
  public listVideoOrigin: Video[] = [];
  public dropdownProgress: Object = { text: 'Scenario', value: 'Id' };
  public toolbarOptions: ToolbarItems[] = [];
  public editSettings: EditSettingsModel = {
    allowEditing: false,
    allowAdding: false,
    allowDeleting: false,
    mode: 'Dialog',
  };
  check = false;
  public targetElement: HTMLElement;
  public hideDialog: EmitType<object> = () => {
    this.dialog.hide();
  };
  @ViewChild('parentGrid') grid: GridComponent;
  public initilaizeTarget: EmitType<object> = () => {
    this.targetElement = this.container.nativeElement.parentElement;
  };
  @ViewChild('ejDialog') public dialog: DialogComponent;
  @ViewChild('container', { read: ElementRef, static: true }) container:
    | ElementRef
    | any;
  public fileUpload: any = undefined;
  public file: any = undefined;
  public listVideoOriginal: Video[] = [];
  public messageFile: boolean = false;
  public idUpload: any;
  public uploadPartId: any;
  public dropEle?: HTMLElement;
  public open: boolean = false;
  public commands: CommandModel[];
  @ViewChild('gridVideo') public gridVideo: GridComponent;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private roleRightService: RolePermissionService,
    private preProgressService: PreProgressService,
    private preSegmentService: PreSegmentService,
    private service: PrePlanService,
    private serviceCate: CommoncategoryService,
    private toastService: ToastrService,
    private fileUploadService: UploadService,
    private spinnerService: SpinnerService,
    private videoService: VideoService
  ) {
    // Get progress Id from params
    this.progressId = route.snapshot.params['progressId'];
    this.planId = route.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.commands = [
      {
        buttonOption: {
          content: 'Nén file',
          cssClass: 'btn-video-compressor e-custombtn',
          
        },
      },
    ];
    this.listPlan = new PreproductionPlaning();
    this.dropEle = document.getElementById('droparea') as HTMLElement;
    // this.canGoBack = !!this.router.getCurrentNavigation()?.previousNavigation;
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
    // Load progress detail
    this.onLoadProgress();
  }

  // On form submit
  onSubmit() {
    if (this.progressId) {
      // Update progress
      this.progressDetail.SegmentProgress = Number(
        this.progressDetail.SegmentProgress
      );

      this.progressDetail.Expense = Number(this.progressDetail.Expense);
      if (
        this.progressDetail.SegmentProgress == undefined ||
        this.progressDetail.SegmentProgress == null
      ) {
        this.progressDetail.SegmentProgress = 0;
      }
      if (
        this.progressDetail.Status == undefined ||
        this.progressDetail.Status == null
      ) {
        this.progressDetail.Status = 0;
      }
      this.preProgressService
        .UpdateProgess(this.progressDetail, this.progressId)
        .subscribe(
          (data) => {
            this.progressDetail = new PreproductionProgress();
            this.toastService.success('Cập nhập thành công!');
          },
          () => {
            this.progressDetail = new PreproductionProgress();
            this.toastService.warning('Cập nhập thất bại!');
          }
        );
    } else {
      // Create progress
      this.progressDetail.SegmentProgress = Number(
        this.progressDetail.SegmentProgress
      );
      this.progressDetail.Expense = Number(this.progressDetail.Expense);
      this.progressDetail.PreProductionId = this.planId;
      if (this.progressDetail.SegmentId == undefined) {
        this.checkProgressName = true;
      } else {
        this.checkProgressName = false;
      }
      if (this.progressDetail.ExpenseType == undefined) {
        this.messageTypeCost = true;
      } else {
        this.messageTypeCost = false;
      }
      if (
        this.progressDetail.SegmentProgress == undefined ||
        this.progressDetail.SegmentProgress == null
      ) {
        this.progressDetail.SegmentProgress = 0;
      }
      if (this.checkProgressName == false && this.messageTypeCost == false) {
        this.checkProgressName = false;
        this.progressDetail.CreatedBy = this.userLogged.getCurrentUser().userId;
        this.progressDetail.CreatedAt = new Date();
        if (
          this.progressDetail.Status == undefined ||
          this.progressDetail.Status == null
        ) {
          this.progressDetail.Status = 0;
        }
        this.preProgressService.CreateProgess(this.progressDetail).subscribe(
          (data) => {
            this.progressDetail = new PreproductionProgress();
            this.router.navigate(['../edit-progress', data.Id], {
              relativeTo: this.route,
            });
            this.toastService.success('Tạo tiến độ thành công!');
          },
          () => {
            this.progressDetail = new PreproductionProgress();
            this.toastService.warning('Tạo tiến độ thất bại!');
          }
        );
      }
    }
  }
  // Handle input change with object input: {key: string, value: any}
  onInputChange(input: any) {
    const { key, value } = input;
    const data = { ...this.progressDetail, [key]: value };
    this.progressDetail = data;
    if (
      this.progressDetail.SegmentProgress == undefined ||
      this.progressDetail.SegmentProgress == null
    ) {
      this.progressDetail.SegmentProgress = 0;
    }
  }

  onInputVideoChange(input: any) {
    const { key, value } = input;
    const data = { ...this.videoDetail, [key]: value };
    this.videoDetail = data;
  }
  // Load progess list by plan id
  onLoadProgress() {
    this.serviceCate
      .getCateByType(CommonCategoriesType.COST)
      .subscribe((data) => {
        this.listCate = data.value;
      });
    if (this.planId) {
      this.service.getPlanById(this.planId).subscribe((data) => {
        this.listPlan = data.value[0];
        if (this.listPlan.Status == 5) {
          this.check = true;
        }
      });
      this.preSegmentService
        .getAddSegmentbyIdPlan(this.planId)
        .subscribe((data) => {
          this.listSegment = data.value;
          this.preProgressService
            .getAllPreProgressByIdPlan(this.planId)
            .subscribe((parentData) => {
              for (let index = 0; index < this.listSegment.length; index++) {
                const element = this.listSegment[index].Id;
                let foundMatch = false;
                for (let j = 0; j < parentData.value.length; j++) {
                  const element1 = parentData.value[j].SegmentId;
                  if (element === element1) {
                    foundMatch = true;
                    this.listSegment.splice(index, 1);
                    index--;
                    break;
                  }
                }
              }
            });
        });
    }
    if (this.progressId) {
      this.preProgressService
        .getPreproductionProgressById(this.progressId)
        .subscribe((data) => {
          this.progressDetail = data.value[0];
          this.refreshVideoList();
        });
    }
  }
  toggleForm() {
    this.isCollapsed = !this.isCollapsed;
  }
  toggleForm1() {
    this.isCollapsed1 = !this.isCollapsed1;
  }
  onCancelClick() {
    if (!this.progressId) {
      this.router.navigate(['../'], { relativeTo: this.route });
    } else {
      this.router.navigate(['../../'], { relativeTo: this.route });
    }
  }

  // Open file on url click
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
      this.listVideoOriginal = [
        ...this.gridVideo.getCurrentViewRecords(),
      ] as Video[];
    }
    if (args.action === RequestTypeAction.ADD) {
      this.messageFile = false;
      if (this.progressId) {
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
        const data = dataRow as Video[];
    
            this.videoService.DeleteVideo(dataRow.Id).subscribe(
              (data) => {
                this.onLoadProgress();
                this.toastService.success('Xóa thành công!');
              },
              () => {
                this.gridVideo.dataSource = this.videoDetail;
                this.toastService.warning('Có lỗi xảy ra...');
              }
            );
          }
  //   }
  //   if (args.requestType === RequestTypeAction.DELETE) {
  //     const data = args.data as Video[];
  //     data.forEach((item) => {
  //       this.videoService.DeleteVideo(item.Id).subscribe(
  //         (data) => {
  //           this.refreshVideoList();
  //         },
  //         () => {
  //           this.gridVideo.dataSource = this.listVideoOrigin;
  //           // (args as any).cancel = true;
  //         }
  //       );
  //     });
  //   }
   

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
              topDoc.ObjectId = this.progressId as number;
              topDoc.ObjectType = VideoType.PREPRODPROGRESS;
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
    if (this.progressId) {
      this.videoService
        .getVideoByQuery(
          `$Filter=ObjectId eq ${this.progressId} and ObjectType eq 0&$Expand=UploadPart`
        )
        .subscribe((data) => {
          this.listVideo = data.value;
        });
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
