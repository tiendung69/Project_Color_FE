import { RequestTypeAction } from './../../../core/utils/constant';
import { Component, ChangeDetectorRef } from '@angular/core';
import {
  EditSettingsModel,
  PageSettingsModel,
  SaveEventArgs,
  ToolbarItems,
  autoCol,
} from '@syncfusion/ej2-angular-grids';
import { ToastrService } from 'ngx-toastr';
import { Commoncategory } from 'src/app/core/models/database/db.model';
import { PermissionRouteModel } from 'src/app/core/models/permission-route.model';
import { CommoncategoryService } from 'src/app/core/services/commoncategory.service';
import { CommonCategoriesType } from 'src/app/core/utils/constant';
import { permissionData } from 'src/environments/environment';

@Component({
  selector: 'app-permissions',
  templateUrl: './permissions.component.html',
  styleUrls: ['./permissions.component.scss'],
})
export class PermissionsComponent {
  listCate: Array<any> = [];
  public typeDropdownData = permissionData;
  public dropdownListData = [
    {
      Name: 'Tạo mới',
      Key: 'create',
    },
    {
      Name: 'Chỉnh sửa',
      Key: 'update',
    },
    {
      Name: 'Xóa',
      Key: 'delete',
    },
    {
      Name: 'Xem',
      Key: 'read',
    },
    {
      Name: 'Duyệt',
      Key: 'approve',
    },
  ];
  public dropdownFields: Object = { text: 'Name', value: 'Key' };

  public selectedPermission: string;
  public selectedRoute: string;

  public permissionDetail: Commoncategory;
  public pageSettings?: PageSettingsModel;
  public editSettings?: EditSettingsModel;
  public toolbarOptions: ToolbarItems[] = ['Add', 'Edit', 'Delete'];
  public NameValidationRules: Object;
  public messageDelete: boolean = false;
  constructor(
    private service: CommoncategoryService,
    private changeDetectorRef: ChangeDetectorRef,
    public toastService : ToastrService
  ) {}
  ngOnInit(): void {
    this.NameValidationRules = {
      required: [true, 'Vui lòng nhập tên Quyền.'],
    };
    this.permissionDetail = new Commoncategory();
    this.loadCate();
    this.pageSettings = { pageSize: 10 };
    this.editSettings = {
      allowEditing: true,
      allowAdding: true,
      allowDeleting: true,
      mode: 'Dialog',
    };
    this.loadCate();
  }
  renderRouteName(data: any) {
    try {
      const routeName = JSON.parse(data).RouteName;
      // @ts-ignore
      return this.typeDropdownData.find((item) => item.Key === routeName).Name;
    } catch (error) {
      return data;
    }
  }
  renderPermissionName(data: any) {
    try {
      const permissionName = JSON.parse(data).Permission;
      return (
        'Có thể ' +
        // @ts-ignore
        this.dropdownListData
          .find((item) => item.Key === permissionName)
          .Name.toLowerCase()
      );
    } catch (error) {
      return data;
    }
  }
  onValueRouteChange(value: any) {
    this.selectedRoute = value;
  }
  onValuePermissionChange(value: any) {
    this.selectedPermission = value;
  }
  loadCate() {
    this.service
      .getCateByType(CommonCategoriesType.PERMISSION)
      .subscribe((data: any) => {
        this.listCate = data.value;
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
          ? 'Chỉnh sửa '
          : 'Thêm Quyền Mới';
    }
  }
  changeStatus(event: any) {
    this.permissionDetail.Name = event.value;
  }
  changeStatus2(event: any) {
    this.permissionDetail.Description = event.value;
  }
  actionBegin(args: SaveEventArgs) {
    if (args.action === RequestTypeAction.ADD) {
      this.permissionDetail.Type = CommonCategoriesType.PERMISSION;
      if (!this.selectedRoute) {
        args.cancel = true;
        return;
      }
      if (!this.selectedPermission) {
        args.cancel = true;
        return;
      }
      const description = {
        RouteName: this.selectedRoute,
        Permission: this.selectedPermission,
      };
      this.permissionDetail.Description = JSON.stringify(description);
      this.service.CreateCommoncategory(this.permissionDetail).subscribe(() => {
        this.permissionDetail = new Commoncategory();
        this.loadCate();

        this.toastService.success('Thêm mới thành công!', 'Thành công');
        this.changeDetectorRef.markForCheck();
      });
    }
    if (args.requestType === RequestTypeAction.ADD) {
      this.permissionDetail = new Commoncategory();
      this.selectedRoute = '';
      this.selectedPermission = '';
    }
    if (args.requestType === RequestTypeAction.BEGINEDIT) {

      this.permissionDetail = args.rowData as Commoncategory;
      try {
        const description = JSON.parse(this.permissionDetail.Description);
        this.selectedRoute = description.RouteName;
        this.selectedPermission = description.Permission;
      } catch (error) {
        this.selectedRoute = '';
        this.selectedPermission = '';
      }
    }
    if (args.action === RequestTypeAction.EDIT) {
      const Id = (<any>args.data).Id;
      const description = {
        RouteName: this.selectedRoute,
        Permission: this.selectedPermission,
      };
      this.permissionDetail.Description = JSON.stringify(description);
      this.service.UpdateCommonCategory(this.permissionDetail, Id).subscribe(() => {
        this.permissionDetail = new Commoncategory();
        this.loadCate();

        this.toastService.success('Cập nhật thành công!', 'Thành công');
        this.changeDetectorRef.markForCheck();
      });
    }
    if (args.requestType === RequestTypeAction.DELETE) {
      this.messageDelete = false;
      if ((args.data as any)[0].RoleRightRights.length === 0) {
        const x = (args.data as any)[0].Id;
        this.service.DeleteCommonCategory(x).subscribe(() => {

        this.toastService.success('Xóa thành công!', 'Thành công');
        });
      } else {

        this.toastService.error('Xóa thất bại, Quyền này đang được sử dụng !', 'Thất bại');
        args.cancel = true;
      }
    }
  }
}
