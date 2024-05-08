import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { HttpClient } from '@angular/common/http';
import { JsonConvert } from 'json2typescript';
import { Observable, catchError, map, throwError } from 'rxjs';
import { ODataResponse } from '../models/odata-response.model';
import { PreproductionprogressMember } from '../models/database/db.model';

@Injectable({
  providedIn: 'root'
})
export class PreProgressMemberService extends ApiService {

  constructor(protected override http: HttpClient) { 
    super(http);
    const jsonConvert = new JsonConvert();
  }
  getMemberbyProgressId(Id: any): Observable<ODataResponse> {
    let url = `/PreproductionprogressMembers?$filter=PreproductionProgressId eq ${Id}&$expand=User&$orderby=Id DESC`;
    return super.get(url).pipe(
      catchError((err) => throwError(() => new Error(err))),

      map((res) => {
        const odataRes: ODataResponse = this.jsonConvert.deserializeObject(
          res,
          ODataResponse
        );
        let value: Array<PreproductionprogressMember> = this.jsonConvert.deserializeArray(
          odataRes.value,
          PreproductionprogressMember);
        odataRes.value = value;
        return odataRes;
      })
    );
  }
  UpdateProgessMember(formData: any, Id: any): Observable<PreproductionprogressMember> {
    let url = `/PreproductionprogressMembers`;
  return super.patchEntity(url, Id, formData).pipe(
    catchError((err) => throwError(() => new Error(err))),
    map((res) => {
      return res;
    })
  );
  }
  CreateProgessMember(formData: any): Observable<ODataResponse> {
    let url = `/PreproductionprogressMembers`;
    return super.postEntity(url, formData).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        return res;
      })
    );
  }

  DeleteProgressMember(id: any): Observable<Object> {
    return super.deleteEntity('/PreproductionprogressMembers', id).pipe(
      catchError((err) => {
        return throwError(() => err);
      })
    );
  }
}
