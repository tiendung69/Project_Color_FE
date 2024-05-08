import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UserService } from 'src/app/core/services/user.service';
import { Location } from '@angular/common';
import {
  Commoncategory,
  TeamMember,
  User,
  UserRole,
} from 'src/app/core/models/database/db.model';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';
import { ActivatedRoute, Router } from '@angular/router';
import { EmitType } from '@syncfusion/ej2-base';
import { CommoncategoryService } from 'src/app/core/services/commoncategory.service';
import { UserRoleService } from 'src/app/core/services/user-role.service';
import { NonNullAssert } from '@angular/compiler';
import { empty, isEmpty } from 'rxjs';
import { TeamMemberService } from 'src/app/core/services/team-member.service';
import { TeamService } from 'src/app/core/services/team.service';
import { SaveEventArgs } from '@syncfusion/ej2-angular-grids';
import { CommonCategoriesType, TopicType } from 'src/app/core/utils/constant';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss'],
})
export class UserDetailsComponent implements OnInit {
  public userDetail: User;
  public listUser: Array<any> = [];
  getRoleCheck: any[] = [];
  listRoles: Array<any> = [];
  role: any;
  listRoleRemove: any = [];
  messageCreate: boolean = false;

  messageCheckChar: boolean = false;
  messageRole: boolean = false;
  messageCreateFalse: boolean = false;
  messageUpdateFalse: boolean = false;
  messageUpdate: boolean = false;
  messageUserName: boolean = false;
  messageFirstName: boolean = false;
  messageLastName: boolean = false;
  messageEmail: Boolean = false;
  messagePassword: boolean = false;
  messageStatus: boolean = false;
  messageEmailUsed: boolean;
  listRoleAdd: UserRole[];
  team: any = [];
  messageUserNameUsed: boolean;
  listTeam: any;
  public getListUser: Array<any> = [];
  public listRole: Commoncategory;
  public getListRole: Array<any> = [];
  listCate: Array<any> = [];
  findId: any[] = [];
  public idUser: any | null;
  editMode: boolean;
  public depart: any;
  public documentDetail: any;
  @ViewChild('ejDialog') ejDialog: DialogComponent;
  @ViewChild('container', { read: ElementRef, static: true })
  container: ElementRef;
  public targetElement: HTMLElement;
  public dropdownFields: Object;
  public dropdownFieldStatus: Object;
  public dropdownField: Object;
  checkRole: boolean = false;
  public listStatus: Array<any> = [
    {
      Name: 'Hoạt động',
      Id: 1,
    },
    { Name: 'Ngưng hoạt động', Id: 0 },
  ];
  isButtonDisabled = false;
  public dialogVisibility: boolean = false;
  @ViewChild('ejDialogRole') ejDialogRole: DialogComponent;
  private readonly canGoBack: boolean;
  constructor(
    public service: UserService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    public service2: CommoncategoryService,
    public serviceRole: UserRoleService,
    public serviceTeam: TeamService,
    private readonly location: Location,
    public toastService: ToastrService
  ) {
    this.canGoBack = !!this.router.getCurrentNavigation()?.previousNavigation;
  }

  ngOnInit(): void {
    this.loadUser();
    this.idUser = this.route.snapshot.paramMap.get('id');
    this.editMode = false;
    this.userDetail = new User();
    this.loadCate();
    this.loadCate2();
    this.loadRole();
    this.listRole = new Commoncategory();

    this.dropdownFields = { text: 'Name', value: 'Id' };
    this.dropdownField = { text: 'FirstName', value: 'Id' };
    this.dropdownFieldStatus = { text: 'Name', value: 'Id' };
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  onInputChange(value: any) {
    const key = value.key;
    const event = value.value;
    const data = { ...this.userDetail, [key]: event };
    if(key == 'Email'){
      this.isValidEmail(data.Email); 
    }
    this.userDetail = data;
  }
  submitAndDisable() {
    if (this.idUser) {
    } else {
      if ((this.messageCreateFalse = true)) {
        this.isButtonDisabled = false;
      } else {
        this.onSubmit();
        this.isButtonDisabled = true;
      }
    }
  }
  loadUser() {
    if (this.idUser) {
      this.service.getUserById(this.idUser).subscribe((data) => {
        this.userDetail = data.value[0];
        this.role = this.userDetail.UserRoles.map(
          (userRole: any) => userRole.RoleId
        );
        this.team = this.userDetail.TeamMembers.map(
          (item: any) => item.Team.Name
        );
        this.getRoleCheck = this.role;
      });

      this.editMode = true;
    } else {
      this.editMode = false;
    }
  }
  onChange(event: any) {
    this.depart = event;
  }
  onChangeRole(value: any) {
    this.role = value;
  }
  onChangeStatus(value: any) {
    this.userDetail.Status = value;
  }
  onSubmit() {
    if (!this.idUser) {
      this.service.getAllUser().subscribe((data) => {
        this.loadCate();
        this.listUser = data.value;
        for (let index = 0; index < this.listUser.length; index++) {
          const element = this.listUser[index].Email;
          if (this.userDetail.Email == element) {
            this.messageEmailUsed = true;
            break;
          } else {
            this.messageEmailUsed = false;
          }
        }
      });
      if (this.userDetail.Email == null) {
        this.messageEmail = true;
      } else {
        this.messageEmail = false;
      }
      this.service.getAllUser().subscribe((data) => {
        this.loadCate();
        this.messageUserNameUsed = false;
        this.listUser = data.value;

        for (let index = 0; index < this.listUser.length; index++) {
          const element = this.listUser[index].UserName;

          if (this.userDetail.UserName === element) {
            this.messageUserNameUsed = true;
            break;
          } else {
            this.messageUserNameUsed = false; 
          }
        }
      });

      if (this.userDetail.UserName == null) {
        this.messageUserName = true;
      } else {
        this.messageUserName = false;
      }
      if (this.userDetail.PassWord == null) {
        this.messagePassword = true;
      } else {
        this.messagePassword = false;
      }

      if (this.userDetail.FirstName == null) {
        this.messageFirstName = true;
      } else {
        this.messageFirstName = false;
      }
      if (this.userDetail.Status == null) {
        this.messageStatus = true;
      } else {
        this.messageStatus = false;
      }
      if (this.userDetail.LastName == null) {
        this.messageLastName = true;
      } else {
        this.messageLastName = false;
      }
      if (this.role == undefined) {
        this.messageRole = true;
      } else {
        this.messageRole = false;
      }
      if (this.userDetail.PassWord.length < 6) {
        this.messageCheckChar = true;
      } else {
        this.messageCheckChar = false;
      }
    
      if (
        this.userDetail.Email != null &&
        this.userDetail.PassWord != null &&
        this.userDetail.PassWord.length >= 6 &&
        this.userDetail.UserName != null &&
        this.userDetail.FirstName != null &&
        this.userDetail.LastName != null &&
        this.role != undefined &&
        this.messageUserNameUsed == false
      ) {
        this.messageCreateFalse = false;
        this.service.CreateUser(this.userDetail).subscribe((data) => {
          this.idUser = data.Id;

          this.toastService.success(
            'Thêm mới người dùng thành công!',
            'Thành công'
          );
          this.router.navigate(['../edit', this.idUser], {
            relativeTo: this.route,
          });
          this.loadUser();

          for (let i = 0; i < this.role.length; i++) {
            let userRoles = new UserRole();
            (userRoles.UserId = data.Id),
              (userRoles.RoleId = this.role[i]),
              this.service.CreateUserRole(userRoles).subscribe(() => {});
          }
          this.userDetail = new User();
        });
      } else {
        this.messageCreateFalse = true;
      }
    }
    if (this.idUser) {
      if (this.role.length == 0) {
        this.messageRole = true;
      } else {
        this.messageRole = false;
      }
      if (this.userDetail.Email == '') {
        this.messageEmail = true;
      } else {
        this.messageEmail = false;
      }
      if (this.userDetail.UserName == '') {
        this.messageUserName = true;
      } else {
        this.messageUserName = false;
      }
      if (this.userDetail.PassWord == '') {
        this.messagePassword = true;
      } else {
        this.messagePassword = false;
      }
      if (this.userDetail.FirstName == '') {
        this.messageFirstName = true;
      } else {
        this.messageFirstName = false;
      }
      if (this.userDetail.LastName == '') {
        this.messageLastName = true;
      } else {
        this.messageLastName = false;
      }
      this.service.getAllUser().subscribe((data) => {
        this.listUser = data.value;
        var count = 0;
        for (let index = 0; index < this.listUser.length; index++) {
          const element = this.listUser[index].Email;

          if (this.userDetail.Email == element) {
            count++;
            if (count == 2) {
              this.messageEmailUsed = true;
              break;
            } else {
              this.messageEmailUsed = false;
            }
          } else {
            this.messageEmailUsed = false;
          
          }
        }
      });
      
      console.log(this.userDetail);
      console.log(this.role);
      console.log(this.messageUserNameUsed);
      if (
        this.userDetail.Email != '' &&
        this.userDetail.PassWord != '' &&
        this.userDetail.UserName != '' &&
        this.userDetail.FirstName != '' &&
        this.userDetail.LastName != '' &&
        this.role.length != 0 &&
        this.messageEmailUsed == false || this.messageEmailUsed == undefined
      ) {
        this.service
          .UpdateUser(this.userDetail, this.idUser)
          .subscribe((data: any) => {
            this.toastService.success(
              'Cập nhật người dùng thành công!',
              'Thành công'
            );
            this.messageUpdateFalse = false;
            this.loadCate();
          });

        const newRoles = this.role;
        const oldRoles = this.getRoleCheck;
        const filteredListNew = newRoles.filter(
          (item: any) => !oldRoles.includes(item)
        );
        const filteredListOld = oldRoles.filter(
          (item: any) => !newRoles.includes(item)
        );

        if (filteredListNew.length > 0) {
          for (let index = 0; index < filteredListNew.length; index++) {
            const element = filteredListNew[index];
            let formData = {
              UserId: this.idUser,
              RoleId: element,
            };
            this.service.CreateUserRole(formData).subscribe(() => {
            });
          }
        }
        if (filteredListOld.length > 0) {
          for (let index = 0; index < filteredListOld.length; index++) {
            const element = filteredListOld[index];
            const userRolesss = this.userDetail.UserRoles.filter((item: any) =>
              filteredListOld.includes(item.RoleId)
            );
            const x = userRolesss[index].Id;
            this.service.DeleteUserRole(x).subscribe(() => {
              console.log('Delete Successfully');
              this.messageUpdate = true;
              this.loadUser();
            });
          }
        }
        this.messageUpdate = true;
      } else {
        this.messageUpdateFalse = true;
      }
    }
  }

  loadRole() {
    this.service.getUserIdByRole(this.idUser).subscribe((data: any) => {
      this.listRoles = data.value;
    });
  }
  UpdateRole() {
    let formData2 = {
      UserId: this.idUser,
      RoleId: this.role,
    };

    this.service.CreateUser2(formData2).subscribe((data: any) => {
      console.log('Update Successfully');
    });
  }
  loadCate() {
    this.service2
      .getCateByType(CommonCategoriesType.DEPARTMENT)
      .subscribe((data: any) => {
        this.listCate = data.value;
      });
  }

  loadCate2() {
    this.service2
      .getCateByType(CommonCategoriesType.ROLE)
      .subscribe((data: any) => {
        this.getListRole = data.value;
        this.loadUser();
      });
  }

  onAddRole() {
    this.ejDialogRole.show();
  }
  public onOverlayMembersClick: EmitType<object> = () => {
    this.ejDialogRole.hide();
  };
  onCancelClick() {
    // } else
    if (!this.idUser) {
      this.router.navigate(['../'], { relativeTo: this.route });
    } else {
      this.router.navigate(['../../'], { relativeTo: this.route });
    }
  }
}
