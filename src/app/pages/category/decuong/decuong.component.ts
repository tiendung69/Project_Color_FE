import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommoncategoryService } from 'src/app/core/services/commoncategory.service';
import { EmitType } from '@syncfusion/ej2-base';
import {
  EditSettingsModel,
  FilterSettingsModel,
  GridComponent,
  PageSettingsModel,
  SaveEventArgs,
  ToolbarItems,
  ToolbarService,
  autoCol,
} from '@syncfusion/ej2-angular-grids';
import {
  CommonCategoriesType,
  RequestTypeAction,
} from 'src/app/core/utils/constant';
import { Commoncategory } from 'src/app/core/models/database/db.model';
import { ToastrService } from 'ngx-toastr';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';

@Component({
  selector: 'app-decuong',
  templateUrl: './decuong.component.html',
  styleUrls: ['./decuong.component.scss'],
})
export class DecuongComponent {
  listCate: Array<any> = [];
  @ViewChild('grid', { static: false }) public grid: GridComponent;
  message1: boolean = false;
  public filterOptions : FilterSettingsModel ={

    ignoreAccent: false,
    showFilterBarStatus: false,
  }
  public cateDetail: Commoncategory;
  listData: Array<any> = [];
  public hideDialog: EmitType<object> = () => {
    this.dialog.hide();
  };
  public targetElement: HTMLElement;

  public initilaizeTarget: EmitType<object> = () => {
    this.targetElement = this.container.nativeElement.parentElement;
  };
  @ViewChild('ejDialog') public dialog: DialogComponent;
  // Create element reference for dialog target element.
  @ViewChild('container', { read: ElementRef, static: true }) container:
    | ElementRef
    | any;
  public editSettings?: EditSettingsModel;
  public NameValidationRules: Object;
  public pageSettings?: PageSettingsModel;
  public toolbarOptions: ToolbarItems[] = ['Add', 'Edit', 'Delete'];
  constructor(
    private service: CommoncategoryService,
    private changeDetectorRef: ChangeDetectorRef,
    public toastService : ToastrService
  ) {}
  info: any;
  message: boolean = false;
  name: any;
  ngOnInit(): void {
    this.cateDetail = new Commoncategory();
    this.loadCate2();
    this.loadCate();
    this.editSettings = {
      allowEditing: true,
      allowAdding: true,
      allowDeleting: true,
      mode: 'Dialog',
    };
    this.NameValidationRules = {
      required: [true, 'Vui lòng nhập loại Đề Cương.'],
    };
    this.pageSettings = { pageSize: 10 };
    this.loadCate();
  }
  changeStatus(event: any) {
    this.cateDetail.Description = event.value;
  }
  onChange1(args: any): void{
    this.grid.filterByColumn('Name','contains',args.value);
  }
  onChange2(args: any): void{
    this.grid.filterByColumn('Description','contains',args.value);
  }
  changeStatus2(event: any) {
    this.cateDetail.Name = event.value;
  }
  loadCate() {
    this.service.getCateByType(8).subscribe((data: any) => {
      this.listCate = data.value;
      this.listCate = this.listCate.filter((item) => item.Name != null);
    });
  }
  actionComplete(args: any) {
    if (
      (args as any).requestType === 'beginEdit' ||
      (args as any).requestType === 'add'
    ) {
      const dialog = (args as any).dialog;
      dialog.showCloseIcon = false;
      dialog.height = 300;
      dialog.width = 500;

      dialog.header =
        (args as any).requestType === 'beginEdit'
          ? 'Chỉnh sửa'
          : 'Thêm Đề Cương Mới';
    }
  }
  loadCate2() {
    this.service
      .getCateByType(CommonCategoriesType.COST)
      .subscribe((data: any) => {
        this.listData = data.value;
      });
  }
  actionBegin(args: SaveEventArgs) {
    if (args.action === RequestTypeAction.ADD) {
      this.cateDetail.Type = CommonCategoriesType.OUTLINE;

      this.service.CreateCommoncategory(this.cateDetail).subscribe(() => {
        this.cateDetail = new Commoncategory();
        this.loadCate();

        this.toastService.success('Thêm mới thành công!', 'Thành công');
        this.changeDetectorRef.markForCheck();
      });
    }

    if (args.action === RequestTypeAction.BEGINEDIT) {
      this.cateDetail = args.rowData as Commoncategory;
    }
    if (args.action === RequestTypeAction.EDIT) {
      this.service
        .UpdateCommonCategory(this.cateDetail, (args.data as any).Id)
        .subscribe(() => {
          this.cateDetail = new Commoncategory();
          this.loadCate();

        this.toastService.success('Cập nhật thành công!', 'Thành công');
          this.changeDetectorRef.markForCheck();
        });
    }
    if (args.requestType === 'delete') {
      const dataRow = (args.data as Commoncategory[])[0];
      args.cancel = true;
      this.dialog.show();
      this.dialog.header = 'Xác nhận xóa Loại đề cương';
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
    this.service.DeleteCommonCategory(dataRow.Id).subscribe(
      (data: Commoncategory) => {
        this.loadCate();
        this.toastService.success('Xóa thành công!');
      },
      () => {
        this.grid.dataSource = this.listCate;
        this.toastService.warning('Có lỗi xảy ra...');
      }
    );
  }
}
