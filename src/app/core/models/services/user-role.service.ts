import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { HttpClient } from '@angular/common/http';
import { UserRole } from '../models/database/db.model';
import { Observable, catchError, map, throwError } from 'rxjs';
import { JsonConvert } from 'json2typescript';
import { ODataResponse } from '../models/odata-response.model';

@Injectable({
  providedIn: 'root'
})
export class UserRoleService extends ApiService {

  constructor( protected override http: HttpClient) {
    super(http);
    this.jsonConvert = new JsonConvert();
   }


   UpdateUserRole(formData: any, Id: any): Observable<UserRole> {
    let url = `/UserRoles`;
    return super.patchEntity(url, Id, formData).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        return res;
      })
    );
  }


  CreateUserRole(formData: any): Observable<ODataResponse> {
    let url = `/UserRoles`;
    return super.postEntity(url, formData).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        return res;
      })
    );
  }
  getAllRole(): Observable<ODataResponse> {
    let url = '/UserRoles?$filter=RoleId eq 145';
    return super.get(url).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        const odataRes: ODataResponse = this.jsonConvert.deserializeObject(
          res,
          ODataResponse
        );
        let value: Array<UserRole> = this.jsonConvert.deserializeArray(
          odataRes.value,
          UserRole
        );
        odataRes.value = value;
        return odataRes;
      })
    );
  }
}