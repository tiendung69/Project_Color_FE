import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  EditSettings,
  EditSettingsModel,
  FilterSettingsModel,
  GridComponent,
  PredicateModel,
  SaveEventArgs,
  ToolbarItems,
  autoCol,
} from '@syncfusion/ej2-angular-grids';
import { L10n } from '@syncfusion/ej2-base';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/core/models/database/db.model';
import { UserService } from 'src/app/core/services/user.service';

L10n.load({
  'en-US': {
    grid: {
      SaveButton: 'Lưu',
      CancelButton: 'Hủy',
      AddButton: 'Thêm',
      Edit: 'Sửa',
      Add: 'Thêm ',
      Delete: 'Xóa',
      Update: 'Cập nhật',
      Cancel: 'Hủy',
      EditOperationAlert: 'Hãy chọn một mục để sửa.',
      DeleteOperationAlert: 'Hãy chọn một mục để xóa',
      EmptyRecord: 'Không có dữ liệu để hiển thị.',
      FilterButton: 'Lọc',
      ClearButton:'Xóa',
      EnterValue: 'Nhập giá trị',
      ChooseDate: 'Chọn ngày',
    },
    dropdowns: {

      noRecordsTemplate: 'Không có dữ liệu.',
    },
  },
});
@Component({
  selector: 'app-user-manager',
  templateUrl: './user-manager.component.html',
  styleUrls: ['./user-manager.component.scss'],
})
export class UserManagerComponent implements OnInit {
  listUser: Array<any> = [];
  userName: any;
  tel: any;
  query: any =
    '$expand=UserRoles($Expand=Role($Select=Name)),Depart($Select=Name),Teammembers($expand=Team($select=name))&$orderby=Id DESC';
  email: any;
  password: any;
  firstName: any;
  lastName: any;
  messageDelete: boolean = false;
  FirstNameValidationRules: Object;
  LastNameValidationRules: Object;
  public filterOptions : FilterSettingsModel ={
    
    ignoreAccent: false,
    showFilterBarStatus: false,
  }
  EmailValidationRules: Object;
  UserNameValidationRules: Object;
  public filterSettings?: Object;
  public listStatus = [
    {
      name: 'Hoạt động',
      value: '1',
    },
    {
      name: 'Ngưng hoạt động',
      value: '0',
    },
  ]
  PassWordValidationRules: Object;
  @ViewChild('grid', { static: false }) public grid: GridComponent;
  public editSettings?: EditSettingsModel;
  public fields : Object = {text:'name', value:'value'};
  public toolbarOptions: ToolbarItems[] = ['Add', 'Edit'];
  ngOnInit(): void {
    this.loadUser();
    this.editSettings = {
      allowEditing: true,
      allowAdding: true,
      template: false,
      //  mode: 'Dialog',
    };
    this.FirstNameValidationRules = {};
    this.LastNameValidationRules = {};
    this.EmailValidationRules = {};
    this.UserNameValidationRules = { required: true, multiline: 'true' };
    this.PassWordValidationRules = { required: true };
   
  }
  constructor(
    public service: UserService,
    private readonly router: Router,
    private readonly toastService : ToastrService,
    private readonly route: ActivatedRoute,
    public changeDetectorRef: ChangeDetectorRef
  ) {}
  loadUser() {
    this.service.getListUserByQuery(this.query).subscribe((data: any) => {
      this.listUser = data.value.filter((item: any) => item.UserName != null);
    });
  }
  renderStatus(data: User) {
    const status = data.Status;
    switch (status) {
      case 0:
        return 'Ngưng hoạt động';
      case 1:
        return 'Hoạt động';

      default:
        return '';
    }
  }
  onChange1(args: any): void{
    this.grid.filterByColumn('FirstName','contains',args.value);
  }
  onChange2(args: any): void{
    this.grid.filterByColumn('LastName','contains',args.value);
  }
  onChange4(args: any): void{
    this.grid.filterByColumn('Email','contains',args.value);
  }
  onChange5(args: any): void{
    this.grid.filterByColumn('UserName','contains',args.value);
  }
  onChange6(args: any): void{
    this.grid.filterByColumn('Tel','contains',args.value);
  }
  onChange8(args: any): void{
    this.grid.filterByColumn('Status','contains',args.value);
  }
  // onChange7(value: string): void {
  //   this.grid.filterSettings.columns = [
  //     { field: 'UserRoles', operator: 'contains', value: value, predicate: 'and', matchCase: false }
  //   ];
  //   this.grid.refresh();
  
  // }


  // customFilter(filter: { field: string, operator: string, value: string }): PredicateModel {
  //   return {
  //     field: 'UserRoles.Role.Name',
  //     operator: 'contains',
  //     value: filter.value,
  //     ignoreCase: true
  //   };
  
  
  
  onChange3(args: any): void{
    this.grid.filterByColumn('Status','contains',args.value);
  }
  actionComplete(args: SaveEventArgs) {
    if (args.requestType === 'beginEdit') {
      const Id = (args.rowData as any).Id;
      this.router.navigate(['./edit', Id], {
        relativeTo: this.route,
      });
    }
    if (args.requestType === 'add') {
      this.router.navigate(['./add'], {
        relativeTo: this.route,
      });
    }
    if (args.requestType === 'delete') {
      this.messageDelete=false;
      const user = (args.data as any)[0];
      const x = user.Id;
      const name = user.UserName;
      const popupConfirm = confirm('Bạn có muốn xóa người dùng '+ name + ' không?')
      if(popupConfirm == true){

        this.service.DeleteUser(x).subscribe(() => {
          console.log('Delete Successfully');
        },error => {
          this.loadUser();
          this.toastService.error("Xóa thất bại","Thất bại")
        }
      );
      }
      else {
        this.toastService.error("Xóa thất bại","Thất bại")
      }

    }
  }
}
