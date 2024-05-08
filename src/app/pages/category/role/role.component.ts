import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MultiSelectComponent } from '@syncfusion/ej2-angular-dropdowns';
import {
  EditSettingsModel,
  FilterSettingsModel,
  GridComponent,
  PageSettingsModel,
  SaveEventArgs,
  ToolbarItems,
  autoCol,
} from '@syncfusion/ej2-angular-grids';
import {
  Commoncategory,
  RoleRight,
  User,
} from 'src/app/core/models/database/db.model';
import { CommoncategoryService } from 'src/app/core/services/commoncategory.service';
import { RoleRightService } from 'src/app/core/services/role-right.service';
import { UserService } from 'src/app/core/services/user.service';
import { EmitType } from '@syncfusion/ej2-base';
import {
  CommonCategoriesType,
  RequestTypeAction,
} from 'src/app/core/utils/constant';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss'],
})
export class RoleComponent implements OnInit {
  listCate: Array<any> = [];
  listUser: Array<any> = [];
  listId: Array<any> = [];
  message: boolean = false;
  roleRight = new RoleRight();
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
  listUserRoleId: Array<any> = [];
  messageChooseDropdown: boolean = false;
  public pageSettings?: PageSettingsModel;
  public editSettings?: EditSettingsModel;
  public multipleField: Object;
  public toolbarOptions: ToolbarItems[] = [];
  public NameValidationRules: Object;
  public filterOptions : FilterSettingsModel ={

    ignoreAccent: false,
    showFilterBarStatus: false,
  }
  constructor(
    private service: CommoncategoryService,
    private changeDetectorRef: ChangeDetectorRef,
    private roleRightService: RoleRightService,
    private serviceUser: UserService,
    private translate: TranslateService
  ) {
    this.translate.onLangChange.subscribe(() => {
      setTimeout(() => {
        this.grid.refreshHeader();
      }, 200);
    });
  }
  @ViewChild('grid') public grid: GridComponent;
  @ViewChild('ejMultiSelect') ejMultiSelect: MultiSelectComponent;
  role: any = [];
  roleTest: any;
  message2: boolean = false;
  listPermissions: Array<any> = [];
  public cateDetail: Commoncategory;
  public permissDetail: Commoncategory;
  public filterSettings?: Object;
  // New Name: Trung
  public listRoleSelected: any[] = [];
  public roleSelectedDetail: Commoncategory;
  public listOldPermission: any[] = [];
  public listNewPermission: any[] = [];
  public filterType: string = 'Contains';
  ngOnInit(): void {
    this.roleSelectedDetail = new Commoncategory();
//  this.loadQuyen();

    this.cateDetail = new Commoncategory();
    this.permissDetail = new Commoncategory();
   this.loadCate();
    this.pageSettings = { pageSize: 10 };
    this.editSettings = {
      allowAdding: true,
      mode: 'Dialog',
    };
    this.NameValidationRules = {
      required: [true, 'Vui lòng nhập tên Nhóm Quyền.'],
    };
    this.multipleField = { text: 'Name', value: 'Id' };
    this.roleRight = new RoleRight();


  }
  refreshHeader() {
    if (this.grid) {
      this.grid.refresh();
    }
  }
  onChange1(args: any): void{
    this.grid.filterByColumn('Name','contains',args.value);
  }
  onChange2(args: any): void{
    this.grid.filterByColumn('Description','contains',args.value);
  }

  loadCate() {
    this.service
      .getCateByType2(CommonCategoriesType.ROLE)
      .subscribe((data: any) => {
        this.permissDetail = data.value;
        (this.roleTest = this), this.permissDetail.RoleRightRoles;
      });
  }
  actionComplete(args: any) {
    if (
      (args as any).requestType === 'beginEdit' ||
      (args as any).requestType === 'add'
    ) {
      const dialog = (args as any).dialog;
      dialog.showCloseIcon = false;
      // dialog.height = 350;
      dialog.width = 650;
      dialog.header =
        (args as any).requestType === 'beginEdit'
          ? 'Chỉnh Sửa '
          : 'Thêm Nhóm Quyền Mới';
    }
  }
  onPermissionChange(event: any) {
    this.role = event;
    this.listRoleSelected = event;
  }
  actionBegin(args: SaveEventArgs) {
    if (args.requestType === RequestTypeAction.ADD) {
      this.roleSelectedDetail = new Commoncategory();
      this.listRoleSelected = [];
    }
    this.roleRight = new RoleRight();
    if (args.action === RequestTypeAction.ADD) {
      this.roleSelectedDetail.Type = CommonCategoriesType.ROLE;
      const arrPermission = this.listPermissions.filter((item) =>
        this.listRoleSelected.includes(item.Id)
      );
      if (this.listRoleSelected.length === 0) {
        if (args.requestType === 'cancel') {
          args.cancel = false;
        } else {
          alert('Hãy chọn Quyền');
          this.messageChooseDropdown = true;
          args.cancel = true;
        }
      } else {
        const listCreate = arrPermission.map((item) => {
          const roleRight = new RoleRight();
          roleRight.RoleId = this.roleSelectedDetail.Id;
          roleRight.RightId = item.Id;
          return roleRight;
        });

        this.roleSelectedDetail.RoleRightRoles = listCreate;
        this.service
          .CreateCommoncategory(this.roleSelectedDetail)
          .subscribe((data) => {
            this.roleSelectedDetail = new Commoncategory();
            this.listRoleSelected = [];
            this.loadCate();
          });
      }
    }

    if (args.requestType === 'beginEdit') {
      this.roleSelectedDetail = args.rowData as Commoncategory;
      const arrId = this.roleSelectedDetail.RoleRightRoles.map(
        (item) => item.RightId
      );
      this.listRoleSelected = arrId;
      this.listOldPermission = arrId;
    }
    if (args.action === RequestTypeAction.EDIT) {
      // if (this.roleSelectedDetail.RoleRightRoles.length === 0) {
      //   if (args.requestType === 'cancel') {
      //     args.cancel = false;
      //   } else {
      //     alert('Hãy chọn Quyền');
      //     this.messageChooseDropdown = true;
      //     args.cancel = true;
      //   }
      // } else {
      this.listNewPermission = this.listRoleSelected;
      const filterListAddNew = this.listNewPermission.filter(
        (item: any) => !this.listOldPermission.includes(item)
      );
      const filteredListRemove = this.listOldPermission.filter(
        (item: any) => !this.listNewPermission.includes(item)
      );
      this.service
        .UpdateCommonCategory(this.roleSelectedDetail, this.roleSelectedDetail.Id)
        .subscribe(() => {
          this.loadCate();
          if (filterListAddNew.length > 0) {
            for (let index = 0; index < filterListAddNew.length; index++) {
              const roleRight = new RoleRight();
              roleRight.RoleId = this.roleSelectedDetail.Id;
              roleRight.RightId = filterListAddNew[index];
              this.roleRightService.CreateRoleRight(roleRight).subscribe(() => {
                if (index === filterListAddNew.length - 1) {
                  this.loadCate();
                }
              });
            }
          }
          if (filteredListRemove.length > 0) {
            for (let index = 0; index < filteredListRemove.length; index++) {
              const rightId = filteredListRemove[index];
              const perToRemove = this.roleSelectedDetail.RoleRightRoles.find(
                (item) => item.RightId === rightId
              );

              this.roleRightService
                .DeleteRole(perToRemove?.Id)
                .subscribe(() => {
                  if (index === filteredListRemove.length - 1) {
                    this.loadCate();
                  }
                });
            }
          }
        });
      // }
    }
    if (args.requestType === RequestTypeAction.DELETE) {
      this.serviceUser.getAllUserRole().subscribe((data) => {
        this.listUser = data.value
          .map((user: any) => user.UserRoles.map((role: any) => role.RoleId))
          .filter((item: any) => item !== null && item.length > 0);
        const listId = this.listUser;

        const listRole = (args.data as any)[0];
        const x = listRole.Id;
        const idRole = listRole.RoleRightRoles;

        for (let index = 0; index < this.listUser.length; index++) {
          const element = this.listUser[index];
          for (let index = 0; index < element.length; index++) {
            const elementa = element[index];
            this.listUserRoleId.push(elementa);
          }
        }
        const hasMatch = this.listUserRoleId.some((element) => element === x);
        if (!hasMatch) {
          this.message = false;
          const del = listRole.RoleRightRoles;
          for (let index = 0; index < del.length; index++) {
            const element = del[index].Id;
            this.roleRightService.DeleteRole(element).subscribe(() => {
              this.service.DeleteCommonCategory(x).subscribe(() => {
                console.log('Delete Successfully');
              });
            });
          }
          this.service.DeleteCommonCategory(x).subscribe(() => {
            console.log('Delete Successfully');
          });
        } else {
          args.cancel = true;
          this.message = true;
          this.loadCate();
        }
      });
    }
  }
  loadQuyen() {
    this.service
      .getCateByType(CommonCategoriesType.PERMISSION)
      .subscribe((data) => {
        this.listPermissions = data.value;
      });
  }
  onInputChange(value: any) {
    const key = value.key;
    const event = value.value;
    const data = { ...this.cateDetail, [key]: event };
    const dataSimilar = { ...this.roleSelectedDetail, [key]: event };
    this.roleSelectedDetail = dataSimilar;
    this.cateDetail = data;
  }
}
