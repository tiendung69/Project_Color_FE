import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
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
import { EmitType } from '@syncfusion/ej2-base';
import { ToastrService } from 'ngx-toastr';
import { Commoncategory } from 'src/app/core/models/database/db.model';
import { CommoncategoryService } from 'src/app/core/services/commoncategory.service';
import {
  CommonCategoriesType,
  RequestTypeAction,
} from 'src/app/core/utils/constant';

@Component({
  selector: 'app-movie',
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.scss'],
})
export class MovieComponent {
  name: any;
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
  listRoles: Array<any> = [];
  @ViewChild('grid', { static: false }) public grid: GridComponent;
  listParent: Array<any> = [];
  public filterOptions : FilterSettingsModel ={

    ignoreAccent: false,
    showFilterBarStatus: false,
  }
  public cateDetail: Commoncategory;
  description: any;
  listCate: Array<any> = [];
  listAll: Array<any> = [];
  public pageSettings?: PageSettingsModel;
  public editSettings?: EditSettingsModel;
  public toolbarOptions: ToolbarItems[] = ['Add', 'Edit', 'Delete'];
  public NameValidationRules: Object;
  public TypeValidationRules: Object;
  public DescriptionValidationRules: Object;
  public ParentIdValidationRules: Object;

  constructor(
    private service: CommoncategoryService,
    public changeDetectorRef: ChangeDetectorRef,
    public toastService : ToastrService
  ) {}
  hello: any;
  message: boolean = false;
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
    this.NameValidationRules = { required: [true, 'Vui lòng nhập loại Phim.'] };

    this.loadCate();
  }

  loadCate() {
    this.service
      .getCateByType(CommonCategoriesType.FILM)
      .subscribe((data: any) => {
        this.listCate = data.value;
      });
  }
  onChange1(args: any): void{
    this.grid.filterByColumn('Name','contains',args.value);
  }
  onChange2(args: any): void{
    this.grid.filterByColumn('Description','contains',args.value);
  }

  loadCate2() {
    this.service
      .getCateByType(CommonCategoriesType.TOPIC)
      .subscribe((data: any) => {
        this.listRoles = data.value;
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
          : 'Thêm Phim Mới';
    }
  }
  actionBegin(args: any) {
    if (args.action === RequestTypeAction.ADD) {
      this.cateDetail.Type = CommonCategoriesType.FILM;
      this.service.CreateCommoncategory(this.cateDetail).subscribe(() => {
        this.cateDetail = new Commoncategory();
        this.loadCate();

        this.toastService.success('Thêm mới thành công!', 'Thành công');
        this.changeDetectorRef.markForCheck();
      });
    }
    if (args.action === RequestTypeAction.BEGINEDIT) {
      this.cateDetail = args.data as Commoncategory;
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
      this.dialog.header = 'Xác nhận xóa Loại phim';
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
