import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  EditSettingsModel,
  FilterSettingsModel,
  GridComponent,
  PageSettingsModel,
  SaveEventArgs,
  ToolbarItems,
  autoCol,
} from '@syncfusion/ej2-angular-grids';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';
import { ToastrService } from 'ngx-toastr';
import { Commoncategory } from 'src/app/core/models/database/db.model';
import { CommoncategoryService } from 'src/app/core/services/commoncategory.service';
import { EmitType } from '@syncfusion/ej2-base';
import {
  CommonCategoriesType,
  RequestTypeAction,
} from 'src/app/core/utils/constant';

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.scss']
})
export class DepartmentComponent implements OnInit {
  listCate: Array<any> = [];
  public pageSettings?: PageSettingsModel;
  public departDetail: Commoncategory;
  public name: any;
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
  public filterOptions : FilterSettingsModel ={

    ignoreAccent: false,
    showFilterBarStatus: false,
  }
  message : boolean = false;
  public description: any;
  public editSettings?: EditSettingsModel;
  public toolbarOptions: ToolbarItems[] = ['Add', 'Edit', 'Delete'];
  public NameValidationRules: Object;
  @ViewChild('grid', { static: false }) public grid: GridComponent;
  public TypeValidationRules: Object;
  public DescriptionValidationRules: Object;
  public ParentIdValidationRules: Object;

  constructor(
    private service: CommoncategoryService,
    public changeDetectorRef: ChangeDetectorRef,
    public toastService : ToastrService
  ) {}
  ngOnInit(): void {
    this.departDetail = new Commoncategory();
    this.loadCate();
    this.pageSettings = { pageSize: 10 };
    this.editSettings = {
      allowEditing: true,
      allowAdding: true,
      allowDeleting: true,
      mode: 'Dialog',
    };

    this.NameValidationRules = { required: [true, 'Vui lòng nhập tên Phòng Ban.' ]};
    this.TypeValidationRules = { number: true };
    this.DescriptionValidationRules = {};
    this.ParentIdValidationRules = { number: true };
    this.loadCate();
  }

  loadCate() {
    this.service.getCateByType(0).subscribe((data: any) => {
      this.listCate = data.value;
    });
  }
  changeStatus(event: any) {
    this.departDetail.Name = event.value;
  }
  changeStatus2(event: any) {
    this.departDetail.Description = event.value;
  }
  onChange1(args: any): void{
    this.grid.filterByColumn('Name','contains',args.value);
  }
  onChange2(args: any): void{
    this.grid.filterByColumn('Description','contains',args.value);
  }
  actionComplete(args: any) {
    if (
      (args as any).requestType === 'beginEdit' ||
      (args as any).requestType === 'add'
    ) {
      const dialog = (args as any).dialog;
      dialog.showCloseIcon = false;
      dialog.height = 300;
      dialog.width=500;

      dialog.header =
        (args as any).requestType === 'beginEdit'
          ? 'Chỉnh sửa '
          : 'Thêm Phòng Ban Mới';
    }
  }
  actionBegin(args: SaveEventArgs) {
    if (args.action === RequestTypeAction.ADD) {
      this.departDetail.Type = CommonCategoriesType.DEPARTMENT;

      this.service.CreateCommoncategory(this.departDetail).subscribe(() => {
        this.departDetail = new Commoncategory();
        this.loadCate();

        this.toastService.success('Thêm mới thành công!', 'Thành công');
        this.changeDetectorRef.markForCheck();
    });
    }
    if (args.requestType === RequestTypeAction.BEGINEDIT) {
      this.departDetail = args.rowData as Commoncategory;
    }
    if (args.action === RequestTypeAction.EDIT) {
      this.service
        .UpdateCommonCategory(this.departDetail, this.departDetail.Id)
        .subscribe(() => {
          this.departDetail = new Commoncategory();
          this.loadCate();

        this.toastService.success('Cập nhật thành công!', 'Thành công');
          this.changeDetectorRef.markForCheck();
        });
    }
    if (args.requestType === RequestTypeAction.DELETE) {
      const dataRow = (args.data as Commoncategory[])[0];
      args.cancel = true;
      this.dialog.show();
      this.dialog.header = 'Xác nhận xóa Phòng ban';
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
