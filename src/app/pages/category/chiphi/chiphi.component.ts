import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { L10n } from '@syncfusion/ej2-base';
import { CommoncategoryService } from 'src/app/core/services/commoncategory.service';
import { EmitType } from '@syncfusion/ej2-base';
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
import { finalize } from 'rxjs';
import { ODataResponse } from 'src/app/core/models/odata-response.model';
import {
  CommonCategoriesType,
  RequestTypeAction,
} from 'src/app/core/utils/constant';
import { Commoncategory } from 'src/app/core/models/database/db.model';
import { ToastrService } from 'ngx-toastr';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';

L10n.load({
  'en-US': {
    grid: {
      SaveButton: 'Lưu',
      CancelButton: 'Hủy',
      Edit: 'Sửa',
      Add: 'Thêm',
      Delete: 'Xóa',
      EditOperationAlert: 'Hãy chọn một mục để sửa.',
      DeleteOperationAlert: 'Hãy chọn một mục để xóa',
      EmptyRecord: 'Không có dữ để hiển thị.',
      requiredMessage: 'Vui lòng nhập giá trị.',
    },
    dropdowns: {
      noRecordsTemplate: 'Không có dữ liệu.',
    },
    listbox: {
      noRecordsTemplate: 'Your Custom Text', // provide your own text here
    },
  },
});
@Component({
  selector: 'app-chiphi',
  templateUrl: './chiphi.component.html',
  styleUrls: ['./chiphi.component.scss'],
})
export class ChiphiComponent {
  @ViewChild('grid', { static: false }) public grid: GridComponent;
  listCate: Array<any> = [];
  public costDetail: Commoncategory;
  parentIdList: Array<any> = [];
  AllList: Array<any> = [];
  Type1: number = 9;
  Type2: number = 8;
  check: number = 9;
  public targetElement: HTMLElement;
  info: any;
  message: boolean = false;
  public editSettings?: EditSettingsModel;
  public filterOptions : FilterSettingsModel ={

    ignoreAccent: false,
    showFilterBarStatus: false,
  }
  public pageSettings?: PageSettingsModel;

  public toolbarOptions: ToolbarItems[] = ['Add', 'Edit', 'Delete'];
  public NameValidationRules: Object;
  public fields : Object = { text: 'Name', value: 'Id' };
  public TypeValidationRules: Object;
  message1: boolean = false;
  public DescriptionValidationRules: Object;
  public ParentIdValidationRules: Object;
  @ViewChild('container', { read: ElementRef, static: true }) container:
  | ElementRef
  | any;
  @ViewChild('ejDialog') public dialog: DialogComponent;
  public dropdownFields = { text: 'Name', value: 'Id' };
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
  selectedParentId: number;
  name: any;
  ngOnInit(): void {
    this.costDetail = new Commoncategory();
    this.loadCate();
    this.editSettings = {
      allowEditing: true,
      allowAdding: true,
      allowDeleting: true,
      mode: 'Dialog',
    };
    this.pageSettings = { pageSize: 10 };
    this.NameValidationRules = {
      required: [true, 'Vui lòng nhập loại Chi Phí.'],
    };
    this.DescriptionValidationRules = {};
    this.ParentIdValidationRules = {};
    this.changeDetectorRef.markForCheck();
  }
  onChange(args: any){
    this.grid.filterByColumn('ParentId','contains',args.value);
  }

  loadCate() {
    this.service
      .getCateById(CommonCategoriesType.COST, CommonCategoriesType.OUTLINE)
      .subscribe((data: any) => {
        this.AllList = data.value;
        this.listCate = data.value.filter(
          (item: any) =>
            item.Type === CommonCategoriesType.COST &&
            this.AllList.some((allItem) => item.ParentId == allItem.Id)
        );

        this.parentIdList = data.value
          .filter(
            (item: any) =>
              item.Type === CommonCategoriesType.OUTLINE && item.Name != null
          )
          .map((item: any) => ({
            Id: item.Id,
            Name: item.Name,
          }));
      });
    this.changeDetectorRef.markForCheck();
  }
  onChange1(args: any): void{
    this.grid.filterByColumn('Name','contains',args.value);
  }
  onChange2(args: any): void{
    this.grid.filterByColumn('Description','contains',args.value);
  }
  onChange3(args: any): void{
    this.grid.filterByColumn('ParentId','contains',args.value);
  }
  changeStatus2(event: any) {
    this.costDetail.Name = event.value;
  }
  changeStatus(event: any) {
    this.costDetail.Description = event.value;
  }
  onchange(event: any) {
    this.costDetail.ParentId = event.value;
  }
  getNameByParentId(parentId: number): string {
    const topic: any = this.parentIdList.find((item) => item.Id === parentId);
    return topic ? topic.Name : '';
  }
  actionComplete(args: any) {
    if (
      (args as any).requestType === 'beginEdit' ||
      (args as any).requestType === 'add'
    ) {
      const dialog = (args as any).dialog;
      dialog.showCloseIcon = false;
      dialog.height = 350;
      dialog.saveButtonContent = 'Luu';
      dialog.width = 550;

      dialog.header =
        (args as any).requestType === 'beginEdit'
          ? 'Chỉnh sửa '
          : 'Thêm Chi Phí Mới';
    }
  }

  actionBegin(args: SaveEventArgs) {
    if (args.action === RequestTypeAction.ADD) {
      this.costDetail.Type = CommonCategoriesType.COST;
      if (this.costDetail.ParentId === undefined) {
        if (args.requestType === 'cancel') {
          args.cancel = false;
        } else {
          args.cancel = true;
          alert('Hãy chọn 1 Loại Đề Cương');
        }
      }
      if (this.costDetail.ParentId !== undefined) {
        this.service
          .CreateCommoncategory(this.costDetail)
          .subscribe((data: any) => {
            this.costDetail = new Commoncategory();
            this.loadCate();
            this.changeDetectorRef.markForCheck();

            if (data.ParentId == undefined) {
              this.message1 = true;
              this.service.DeleteCommonCategory(data.Id).subscribe(() => {});
            }

        this.toastService.success('Thêm mới thành công!', 'Thành công');
          });
      }
    }
    if (args.action === RequestTypeAction.BEGINEDIT) {
      this.costDetail = args.rowData as Commoncategory;
    }
    if (args.action === RequestTypeAction.EDIT) {
      this.service
        .UpdateCommonCategory(this.costDetail, (args.data as any).Id)
        .subscribe(() => {
          this.costDetail = new Commoncategory();
          this.loadCate();

        this.toastService.success('Cập nhật thành công!', 'Thành công');
          this.changeDetectorRef.markForCheck();
        });
    }
    if (args.requestType === 'delete') {
      const dataRow = (args.data as Commoncategory[])[0];
      args.cancel = true;
      this.dialog.show();
      this.dialog.header = 'Xác nhận xóa Loại chi phí';
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
