import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommoncategoryService } from 'src/app/core/services/commoncategory.service';
import {
  DataSourceChangedEventArgs,
  DataStateChangeEventArgs,
  EditEventArgs,
  EditSettingsModel,
  FilterSettingsModel,
  GridComponent,
  PageSettingsModel,
  SaveEventArgs,
  ToolbarItems,
  ToolbarService,
  autoCol,
} from '@syncfusion/ej2-angular-grids';
import { EmitType } from '@syncfusion/ej2-base';
import {
  CommonCategoriesType,
  RequestTypeAction,
} from 'src/app/core/utils/constant';
import { Commoncategory } from 'src/app/core/models/database/db.model';
import { ToastrService } from 'ngx-toastr';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';

@Component({
  selector: 'app-list-commoncategory',
  templateUrl: './list-commoncategory.component.html',
  styleUrls: ['./list-commoncategory.component.scss'],
})
export class ListCommoncategoryComponent implements OnInit {
  listCate: Array<any> = [];
  message: boolean = false;
  listData: Array<any> = [];

  public pageSettings?: PageSettingsModel;
  name: any;
  description: any;
  @ViewChild('grid', { static: false }) public grid: GridComponent;
  public cateDetail: Commoncategory;
  public editSettings?: EditSettingsModel;
  public toolbarOptions: ToolbarItems[] = ['Add', 'Edit', 'Delete'];
  public NameValidationRules: Object;
  public TypeValidationRules: Object;
  public filterOptions : FilterSettingsModel ={

    ignoreAccent: false,
    showFilterBarStatus: false,
  }
  public DescriptionValidationRules: Object;
  public ParentIdValidationRules: Object;
  public targetElement: HTMLElement;
  @ViewChild('ejDialog') public dialog: DialogComponent;
  // Create element reference for dialog target element.
  @ViewChild('container', { read: ElementRef, static: true }) container:
    | ElementRef
    | any;
    public hideDialog: EmitType<object> = () => {
      this.dialog.hide();
    };

    public initilaizeTarget: EmitType<object> = () => {
      this.targetElement = this.container.nativeElement.parentElement;
    };
  constructor(
    private service: CommoncategoryService,
    public changeDetectorRef: ChangeDetectorRef,
    public toastService : ToastrService
  ) {}
  hello: any;

  ngOnInit(): void {
    this.cateDetail = new Commoncategory();
    this.loadCate();
    this.loadCate2();
    this.pageSettings = { pageSize: 10 };
    this.editSettings = {
      allowEditing: true,
      allowAdding: true,
      allowDeleting: true,
      mode: 'Dialog',
    };

    this.NameValidationRules = {
      required: [true, 'Vui lòng nhập tên Thành Phố.'],
    };
    this.TypeValidationRules = { number: true };
    this.DescriptionValidationRules = {};
    this.ParentIdValidationRules = { number: true };
    this.loadCate();
  }

  loadCate() {
    this.service
      .getCateByType(CommonCategoriesType.PROVINCE)
      .subscribe((data: any) => {
        this.listCate = data.value;
      });
  }
  changeStatus(event: any) {
    this.cateDetail.Name = event.value;
  }
  changeStatus2(event: any) {
    this.cateDetail.Description = event.value;
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
          ? 'Chỉnh sửa '
          : 'Thêm Thành Phố Mới';
    }
  }
  onChange1(args: any): void{
    this.grid.filterByColumn('Name','contains',args.value);
  }
  onChange2(args: any): void{
    this.grid.filterByColumn('Description','contains',args.value);
  }

  loadCate2() {
    this.service
      .getCateByType(CommonCategoriesType.DISTRICTS)
      .subscribe((data: any) => {
        this.listData = data.value;
      });
  }
  actionBegin(args: SaveEventArgs) {
    if (args.action === RequestTypeAction.ADD) {
      this.cateDetail.Type = CommonCategoriesType.PROVINCE;

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
    if ((args.action = RequestTypeAction.EDIT)) {
      if (args.data) {
        this.service
          .UpdateCommonCategory(this.cateDetail, (args.data as any).Id)
          .subscribe(() => {
            this.cateDetail = new Commoncategory();
            this.loadCate();

        this.toastService.success('Cập nhật thành công!', 'Thành công');
            this.changeDetectorRef.markForCheck();
          });
      }
    }

      if (args.requestType === 'delete') {
        const dataRow = (args.data as Commoncategory[])[0];
        args.cancel = true;
        this.dialog.show();
        this.dialog.header = 'Xác nhận xóa Tỉnh/ Thành phố';
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

