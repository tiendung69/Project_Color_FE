import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { HttpClient } from '@angular/common/http';
import { JsonConvert } from 'json2typescript';
import { RoleRight } from '../models/database/db.model';
import { Observable, catchError, map, throwError } from 'rxjs';
import { ODataResponse } from '../models/odata-response.model';

@Injectable({
  providedIn: 'root',
})
export class RoleRightService extends ApiService {
  constructor(protected override http: HttpClient) {
    super(http);
    this.jsonConvert = new JsonConvert();
  }
  CreateRoleRight(formData: any): Observable<RoleRight> {
    let url = `/RoleRights`;
    return super.postEntity(url, formData).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        return res;
      })
    );
  }
  UpdateRoleRight(formData: any, Id: any): Observable<RoleRight> {
    let url = `/RoleRights`;
    return super.patchEntity(url, Id, formData).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        return res;
      })
    );
  }
  DeleteRole(id: any): Observable<Object> {
    return super.deleteEntity('/RoleRights', id).pipe(
      catchError((err) => {
        return throwError(() => err);
      })
    );
  }

  GetRoleRightByQuery(query: string): Observable<ODataResponse> {
    let url = `/RoleRights?${query}`;
    return super.get(url).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        const odataRes: ODataResponse = this.jsonConvert.deserializeObject(
          res,
          ODataResponse
        );
        let value: Array<RoleRight> = this.jsonConvert.deserializeArray(
          odataRes.value,
          RoleRight
        );
        odataRes.value = value;

        return odataRes;
      })
    );
  }
}
