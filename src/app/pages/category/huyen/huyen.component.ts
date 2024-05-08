import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommoncategoryService } from 'src/app/core/services/commoncategory.service';
import {
  DataSourceChangedEventArgs,
  DataStateChangeEventArgs,
  EditEventArgs,
  EditSettingsModel,
  FilterSettingsModel,
  GridComponent,
  IEditCell,
  PageSettingsModel,
  SaveEventArgs,
  ToolbarItems,
  ToolbarService,
  autoCol,
} from '@syncfusion/ej2-angular-grids';
import { finalize } from 'rxjs';
import { HtmlParser } from '@angular/compiler';
import { EmitType } from '@syncfusion/ej2-base';
import {
  CommonCategoriesType,
  RequestTypeAction,
} from 'src/app/core/utils/constant';
import { Commoncategory } from 'src/app/core/models/database/db.model';
import { ToastrService } from 'ngx-toastr';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';

@Component({
  selector: 'app-huyen',
  templateUrl: './huyen.component.html',
  styleUrls: ['./huyen.component.scss'],
})
export class HuyenComponent {
  listCate: Array<any> = [];
  description: any;
  name: any;
  messgae1: boolean = false;
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
  public cateDetail: Commoncategory;
  public message: boolean = false;
  @ViewChild('grid', { static: false }) public grid: GridComponent;
  public editSettings?: EditSettingsModel;
  public toolbarOptions: ToolbarItems[] = ['Add', 'Edit', 'Delete'];
  public NameValidationRules: Object;
  public TypeValidationRules: Object;
  public pageSettings?: PageSettingsModel;
  public DescriptionValidationRules: Object;
  public ParentIdValidationRules: Object;
  public dropdownFields: Object;
  constructor(
    private service: CommoncategoryService,
    public changeDetectorRef: ChangeDetectorRef,
    public toastService : ToastrService
  ) {}
  fields : Object = {text: 'Name', value: 'Id'}
  parentIdList: Array<any> = [];
  selectedParentId: number;
  listData: Array<any> = [];
  AllList: Array<any> = [];
  public filterOptions : FilterSettingsModel ={

    ignoreAccent: false,
    showFilterBarStatus: false,
  }
  listName: Array<any> = [];
  getNameByParentId(parentId: number): string {
    const topic: any = this.parentIdList.find((item) => item.Id === parentId);
    return topic ? topic.Name : '';
  }
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

    this.NameValidationRules = { required: [true, 'Vui lòng nhập tên Huyện.'] };
    this.DescriptionValidationRules = {};
    this.ParentIdValidationRules = { number: true };
    this.dropdownFields = { text: 'Name', value: 'Id' };
    this.loadCate();
  }
  onchange(event: any) {
    this.cateDetail.ParentId = event.value;
  }
  changeStatus(event: any) {
    this.cateDetail.Name = event.value;
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
    this.cateDetail.Description = event.value;
  }

  loadCate() {
    this.service
      .getCateById(
        CommonCategoriesType.PROVINCE,
        CommonCategoriesType.DISTRICTS
      )
      .subscribe((data: any) => {
        this.AllList = data.value;

        this.listCate = data.value.filter(
          (item: any) =>
            item.Type === CommonCategoriesType.DISTRICTS &&
            this.AllList.some((allItem) => item.ParentId == allItem.Id)
        );

        this.parentIdList = data.value
          .filter(
            (item: any) =>
              item.Type === CommonCategoriesType.PROVINCE && item.Name != null
          )
          .map((item: any) => ({
            Id: item.Id,
            Name: item.Name,
          }));
      });
  }
  loadCate2() {
    this.service
      .getCateByType(CommonCategoriesType.COMMUNE)
      .subscribe((data: any) => {
        this.listData = data.value;
      });
  }
  actionComplete(args: SaveEventArgs) {
    if (
      (args as any).requestType === 'beginEdit' ||
      (args as any).requestType === 'add'
    ) {
      const dialog = (args as any).dialog;
      dialog.showCloseIcon = false;
      dialog.height = 350;
      dialog.width = 550;

      dialog.header =
        (args as any).requestType === 'beginEdit'
          ? 'Chỉnh sửa '
          : 'Thêm Huyện Mới';
    }
  }
  actionBegin(args: SaveEventArgs) {
    if (args.action === RequestTypeAction.ADD) {
      this.cateDetail.Type = CommonCategoriesType.DISTRICTS;
      if (this.cateDetail.ParentId === undefined) {
        if (args.requestType === 'cancel') {
          args.cancel = false;
        } else {
          args.cancel = true;
          alert('Hãy chọn 1 Thành Phố');
        }
      }
      if (this.cateDetail.ParentId !== undefined) {
        this.service
          .CreateCommoncategory(this.cateDetail)
          .subscribe((data: any) => {
            this.cateDetail = new Commoncategory();
            this.loadCate();
            this.changeDetectorRef.markForCheck();
            if (data.ParentId == undefined) {
              this.messgae1 = true;
              this.service.DeleteCommonCategory(data.Id).subscribe(() => {});
            }

        this.toastService.success('Thêm mới thành công!', 'Thành công');
          });
      }
    }
    if (args.action === RequestTypeAction.BEGINEDIT) {
      this.cateDetail = args.rowData as Commoncategory;
    }

    if (args.action === RequestTypeAction.EDIT) {
      this.service
        .UpdateCommonCategory(this.cateDetail, (args.data as any).Id)
        .subscribe(() => {
          this.cateDetail = new Commoncategory();

        this.toastService.success('Cập nhật thành công!', 'Thành công');
          this.loadCate();
          this.changeDetectorRef.markForCheck();
        });
    }
    if (args.requestType === 'delete') {
      const dataRow = (args.data as Commoncategory[])[0];
      args.cancel = true;
      this.dialog.show();
      this.dialog.header = 'Xác nhận xóa Quận/ Huyện';
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
