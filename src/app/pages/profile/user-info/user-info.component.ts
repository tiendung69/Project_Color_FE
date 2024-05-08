import { Component, Input, OnInit } from '@angular/core';
import {
  UntypedFormGroup,
  UntypedFormControl,
  UntypedFormBuilder,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/core/models/database/db.model';
import { CommoncategoryService } from 'src/app/core/services/commoncategory.service';
import { UserService } from 'src/app/core/services/user.service';
import { CommonCategoriesType } from 'src/app/core/utils/constant';
import { UserLogged } from 'src/app/core/utils/userLogged';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss'],
})
export class UserInfoComponent implements OnInit {
  public personalForm: UntypedFormGroup;
  public listUser: User;
  public listUser2: User;
  role: any;
  getListRole: Array<any> = [];
  public userDetail: User;
  public dropdownFields: Object;
  public userLogged: UserLogged = new UserLogged();
  query: any =
    '$expand=UserRoles($Expand=Role($Select=Name)),Depart($Select=Name),Teammembers($expand=Team($select=name))&$orderby=Id DESC';

  private readonly canGoBack: boolean;
  @Input() disabled: boolean = false;
  @Input() readonly: boolean = false;
  constructor(
    private formBuilder: UntypedFormBuilder,
    public service: UserService,
    private readonly location: Location,
    private readonly route: ActivatedRoute,

    private readonly router: Router,
    public service2: CommoncategoryService
  ) {
    this.canGoBack = !!this.router.getCurrentNavigation()?.previousNavigation;
  }

  ngOnInit() {
    this.listUser = new User();
    this.listUser2 = new User();
    this.loadInfor();
    this.loadUser();
    this.loadCate2();
    this.dropdownFields = { text: 'Name', value: 'Id' };
  }

  // public onSubmit(v): void {
  //   if (this.personalForm.valid) {
  //     // this.router.navigate(['pages/dashboard']);
  //     console.log(this.personalForm);
  //   }
  // }

  onCancelClick() {
    if (this.canGoBack) {
      this.location.back();
    } else {
      this.router.navigate(['../'], { relativeTo: this.route });
    }
  }
  onInputChange(value: any) {
    const key = value.key;
    const event = value.value;
    const data = { ...this.userDetail, [key]: event };
    this.userDetail = data;
  }
  onSubmit() {
    const userLogged = new UserLogged();
    const x = userLogged.getCurrentUser().userId;
    this.service.UpdateUser(this.userDetail, x).subscribe((data) => {
      alert('Cập nhật thông tin thành công!');
    });
  }
  loadUser() {
    const userLogged = new UserLogged();
    const x = userLogged.getCurrentUser().userId;
    this.service.getUserById(x).subscribe((data) => {
      this.listUser = data.value[0];
      this.role = this.listUser.UserRoles.map(
        (userRole: any) => userRole.RoleId
      );
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

  loadInfor() {
    this.service
      .getListUserByQueryId(this.query, this.userLogged.getCurrentUser().userId)
      .subscribe((data) => {
        this.listUser2 = data.value[0];
      });
  }
}

// export function emailValidator(
//   control: AbstractControl
// ): ValidationErrors | null {
//   const emailRegexp = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/;
//   if (control.value && !emailRegexp.test(control.value)) {
//     return { invalidEmail: true };
//   }
//   return null;
//}
