import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { EditSettingsModel, FilterSettingsModel, GridComponent, PageSettingsModel, SaveEventArgs, ToolbarItems } from '@syncfusion/ej2-angular-grids';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';
import { Commoncategory,ElasticField } from 'src/app/core/models/database/db.model';
import { EmitType } from '@syncfusion/ej2-base';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { L10n } from '@syncfusion/ej2-base';
import { ElasticFieldService } from 'src/app/core/services/elastic-field.service';
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
  selector: 'app-elastic-settings',
  templateUrl: './elastic-settings.component.html',
  styleUrls: ['./elastic-settings.component.scss']
})
export class ElasticSettingsComponent  {
  public pageSettings?: PageSettingsModel;
  public editSettings?: EditSettingsModel;
  public toolbarOptions: ToolbarItems[] = ['Add', 'Edit', 'Delete'];
  public elasticData: { TableName: string; Fields: string[] }[] = [];
  public listTableName: { Text: string; Value: string }[] = [];
  public listFieldName: { Text: string; Value: string }[] = [];
  public listElasticField: ElasticField[] = [];
  public listElasticFieldOrigin: ElasticField[] = [];
  public detailElasticField: ElasticField = new ElasticField();
  public dropdownFields: Object = { text: 'Text', value: 'Value' };

  public targetElement: HTMLElement;
  @ViewChild('grid') public grid: GridComponent;
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
  public validationFieldNameRules: Object = {
    required: [true, "Vui lòng nhập trường 'Tên trường'"],
  };
  public validationTableNameRules: Object = {
    required: [true, "Vui lòng nhập trường 'Tên bảng'"],
  };

  constructor(
    private elasticfieldService: ElasticFieldService,
    private toastService: ToastrService,
    public changeDetectorRef: ChangeDetectorRef,
    private translate: TranslateService
  ) {}
  ngOnInit(): void {
    this.onFirstInit();
    this.onGetListElasticField();
    this.detailElasticField = new ElasticField();
    this.pageSettings = {
      pageSize:  10,
      pageCount: 4,
      pageSizes: [10, 20, 50, 100],
    };
    this.editSettings = {
      allowEditing: true,
      allowAdding: true,
      allowDeleting: true,
      mode: 'Dialog',
    };
  }

  onGetListElasticField() {
    this.elasticfieldService.getAllElasticField().subscribe((data: any) => {
      this.listElasticField = data.value;
    });
  }
  onFirstInit() {
    this.elasticfieldService.getFieldSetting().subscribe((data: any) => {
      this.elasticData = data;
      const list = this.elasticData
        .map((item) => {
          if (item.TableName && item.Fields?.length > 0) {
            let txt = item.TableName;
            this.translate
              .stream(`${item.TableName}Table`)
              .subscribe((value) => (txt = value));
            return {
              Text: txt,
              Value: item.TableName,
            };
          }
          return undefined;
        })
        .filter((item) => {
          return item !== undefined;
        });
      //@ts-ignore
      this.listTableName = list;
    });
  }
  onInputChange(event: any) {
    const { key, value } = event;
    if (key === 'TableName') {
      const listField = this.elasticData?.find((item) => {
        return item.TableName === value;
      });
      const list = listField?.Fields.map((item) => {
        if (
          this.listElasticField.find(
            (x) => x.FieldName === item && x.TableName === value
          )
        ) {
          return undefined;
        }
        let txt = item;
        this.translate
          .stream(`${value}.${item}`)
          .subscribe((value) => (txt = value));
        return {
          Text: txt,
          Value: item,
        };
      }).filter((item) => {
        return item !== undefined;
      });
      this.listFieldName = list as any;
    }
    const data = { ...this.detailElasticField, [key]: value };
    this.detailElasticField = data;
  }

  actionComplete(args: SaveEventArgs) {
    if (
      (args as any).requestType === 'beginEdit' ||
      (args as any).requestType === 'add'
    ) {
      const dialog = (args as any).dialog;
      dialog.showCloseIcon = false;
      dialog.width = 550;
      dialog.height = 300;
      dialog.header =
        (args as any).requestType === 'beginEdit'
          ? 'Chỉnh sửa'
          : 'Thêm cột cần tìm kiếm';
    }
  }

  actionBegin(args: SaveEventArgs) {
    if (args.requestType === 'paging') {
      // @ts-ignore
      setCookieSetting('paging', args.pageSize);
    }
    if (
      args.requestType === 'beginEdit' ||
      args.requestType === 'add' ||
      args.requestType === 'delete'
    ) {
      this.detailElasticField = new ElasticField();
      // Store the original data in case we need to revert
      this.listElasticFieldOrigin = [
        ...this.grid.getCurrentViewRecords(),
      ] as ElasticField[];
    }

    if (args.requestType === 'add') {
      this.listFieldName = [];
    }

    if (args.action === 'add' && args.requestType === 'save') {
      // const detail = args.data as Category;
      if (
        !this.detailElasticField.TableName ||
        !this.detailElasticField.FieldName
      ) {
        args.cancel = true;
        this.toastService.info('Hãy chọn TableName và FieldName');
      } else {
        this.elasticfieldService
          .CreateElasticField(this.detailElasticField)
          .subscribe(
            (data: ElasticField) => {
              this.toastService.success('Tạo mới thành công!');
              this.onGetListElasticField();
            },
            () => {
              this.grid.dataSource = this.listElasticFieldOrigin;
              this.toastService.warning('Có lỗi xảy ra...');
            }
          );
      }
    }

    if ((args as any).requestType === 'beginEdit') {
      this.detailElasticField = args.rowData as ElasticField;
      console.log('this.detailElasticField', this.detailElasticField);

      const listFieldName = this.elasticData.find(
        (x) => x.TableName === this.detailElasticField.TableName
      )?.Fields;
      const list = listFieldName
        ?.map((item) => {
          if (
            this.listElasticField.find(
              (x) =>
                x.FieldName === item &&
                x.TableName === this.detailElasticField.TableName &&
                x.FieldName !== this.detailElasticField.FieldName
            )
          ) {
            return undefined;
          }

          let txt = item;
          this.translate
            .stream(`${this.detailElasticField.TableName}.${item}`)
            .subscribe((value) => (txt = value));
          return {
            Text: txt,
            Value: item,
          };
        })
        .filter((item) => {
          return item !== undefined;
        });
      console.log('listFieldName', list);

      this.listFieldName = list as any;
    }

    if (args.action === 'edit' && args.requestType === 'save') {
      this.elasticfieldService
        .UpdateElasticField(this.detailElasticField, this.detailElasticField.Id)
        .subscribe(
          (data: ElasticField) => {
            this.toastService.success('Cập nhập thành công!');
            this.onGetListElasticField();
          },
          () => {
            this.grid.dataSource = this.listElasticFieldOrigin;
            this.toastService.warning('Có lỗi xảy ra...');
          }
        );
    }

    if (args.requestType === 'delete') {
      const dataRow = (args.data as Commoncategory[])[0];
      args.cancel = true;
      this.dialog.show();
      this.dialog.header = 'Xác nhận xóa';
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
    this.elasticfieldService.DeleteElasticField(dataRow.Id).subscribe(
      (data: ElasticField) => {
        this.onGetListElasticField();
        this.toastService.success('Xóa thành công');
      },
      () => {
        this.listElasticField = this.listElasticFieldOrigin;
        this.toastService.warning('Có lỗi xảy ra...');
      }
    );
  }

  getNameById(a: any) {
    return a;
  }
}
