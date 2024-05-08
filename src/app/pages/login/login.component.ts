import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import {
  UntypedFormGroup,
  // FormControl,
  // AbstractControl,
  UntypedFormBuilder,
  Validators,
  UntypedFormControl,
} from '@angular/forms';
// import { EmailValidators } from 'ngx-validators';
import { UserService } from 'src/app/core/services/user.service';
import { UserLogged } from 'src/app/core/utils/userLogged';
import { LoginService } from 'src/app/core/services/Token/login.service';
import { ToastrService } from 'ngx-toastr';
import { RoleRightService } from 'src/app/core/services/role-right.service';
import { RoleRight } from 'src/app/core/models/database/db.model';
import { UserStatus } from 'src/app/core/utils/constant';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class LoginComponent {
  public router: Router;
  public form: UntypedFormGroup;
  public username: UntypedFormControl;
  public password: UntypedFormControl;

  constructor(
    router: Router,
    private toastService: ToastrService,
    private roleRightService: RoleRightService,
    private userService: UserService,
    fb: UntypedFormBuilder,
    public service: LoginService
  ) {
    setTimeout(() => {
      jQuery('#videoCompressorModal').modal('hide');
    }, 200);
    this.router = router;
    this.form = fb.group({
      username: ['', Validators.compose([Validators.required])],
      password: [
        '',
        Validators.compose([Validators.required, Validators.minLength(6)]),
      ],
    });

    this.username = this.form.controls['username'] as UntypedFormControl;
    this.password = this.form.controls['password'] as UntypedFormControl;
  }
  public onSubmit(values: any): void {
    if (this.form.valid) {
      let formData = {
        username: values.username,
        password: values.password,
      };

      // this.service.Login(formData).subscribe((result: any) => {
      //   if (result === null) {
      //     this.toastService.warning(
      //       'Thông tin đăng nhập không đúng. \n Vui lòng thử lại...'
      //     );
      //   } else {
      //     let userLogged: UserLogged = new UserLogged();
      //     userLogged.setCurrentUser(
      //       result.token,
      //       result.username,
      //       result.userid,
      //       result.refreshToken,
      //       JSON.stringify(result.roles),
      //       JSON.stringify([])
      //     );
      //     // Handle user disabled on login
      //     this.userService.getUserByIds(result.userid).subscribe(
      //       (data) => {
      //         if (data.value.length > 0) {
      //           if (data.value[0].Status === UserStatus.ACTIVATE) {
      //             // Get rights
      //             if (result.roles?.length > 0) {
      //               // Build query params to get right
      //               let rightQuery = '';
      //               // rightQuery += `$expand=Right`;
      //               // if user have roles then filter by RoleId
      //               rightQuery += `&$filter=`;
      //               result.roles.forEach((role: any, i: number) => {
      //                 if (i === 0) {
      //                   rightQuery += `RoleId eq ${role.Id}`;
      //                 } else {
      //                   rightQuery += ` or RoleId eq ${role.Id}`;
      //                 }
      //               });
      //               this.roleRightService
      //                 .GetRoleRightByQuery(rightQuery)
      //                 .subscribe(
      //                   (data) => {
      //                     const key = 'RightId';
      //                     const arrayUniqueByKey = [
      //                       ...new Map(
      //                         data.value.map((item: RoleRight) => [
      //                           item[key],
      //                           item,
      //                         ])
      //                       ).values(),
      //                     ] as RoleRight[];
      //                     // console.log('arrayUniqueByKey', arrayUniqueByKey);

      //                     // userLogged.setPermissionUser(JSON.stringify(data.value));
      //                     // Get all RightId
      //                     const rightId: any = [];
      //                     // const listPermission: any = [];
      //                     arrayUniqueByKey.forEach((right: RoleRight) => {
      //                       // const permission = {
      //                       //   Id: right.Right.Id,
      //                       //   Name: right.Right.Name,
      //                       //   Description: right.Right.Description,
      //                       // };
      //                       // listPermission.push(permission);
      //                       rightId.push(right.RightId);
      //                     });
      //                     const unique = [...new Set(rightId)];
      //                     // userLogged.setPermissionUser(
      //                     //   JSON.stringify(listPermission)
      //                     // );

      //                     userLogged.setCurrentUser(
      //                       result.token,
      //                       result.username,
      //                       result.userid,
      //                       result.refreshToken,
      //                       JSON.stringify(result.roles),
      //                       JSON.stringify(unique)
      //                     );
      //                     this.router.navigate(['/']);
      //                   },
      //                   () => {
      //                     userLogged.setCurrentUser(
      //                       result.token,
      //                       result.username,
      //                       result.userid,
      //                       result.refreshToken,
      //                       JSON.stringify(result.roles),
      //                       JSON.stringify([])
      //                     );
      //                     this.router.navigate(['/']);
      //                   }
      //                 );
      //             } else {
      //               this.router.navigate(['/']);
      //             }
      //           } else {
      //             userLogged.logout();
      //             this.toastService.warning(
      //               'Thông tin đăng nhập không đúng. \n Vui lòng thử lại...'
      //             );
      //           }
      //         }
      //       },
      //       () => {
      //         userLogged.logout();
      //         this.toastService.warning(
      //           'Thông tin đăng nhập không đúng. \n Vui lòng thử lại...'
      //         );
      //       }
      //     );

      //     //Example result `rightQuery`: $expand=Right&$filter=RoleId eq 144 or RoleId eq 145
      //   }
      // });
    }
  }

  ngAfterViewInit() {
    const preloader = document.getElementById('preloader');
    if (preloader) {
      preloader.classList.add('hide');
    }
  }
}
