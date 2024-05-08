import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Fetch } from '@syncfusion/ej2-base';
import {
  ODataV4Adaptor,
  DataManager,
  Query,
  CrudOptions,
  DataOptions,
  DataResult,
} from '@syncfusion/ej2-data';
import { UserLogged } from '../utils/userLogged';
import { JwtHelperService } from '@auth0/angular-jwt';
import { isJwtToken } from '../utils/helper';

@Injectable({
  providedIn: 'root'
})
export class CustomService extends ODataV4Adaptor {
  token: string;
  private userLogged: UserLogged = new UserLogged();
  constructor(private router: Router) {
    super();
    this.token = this.userLogged.getToken();
  }
  override beforeSend(
    dm: DataManager,
    request: Request,
    settings: Fetch
  ): void {
    const helper = new JwtHelperService();
    // console.log('vaof dao', this.token);

    // if (isJwtToken(this.token) && !helper.isTokenExpired(this.token)) {
    //   request.headers.append('Authorization', 'Bearer ' + this.token);
    // } else {
    //   this.router.navigate(['/login']);
    // }
  }
}
