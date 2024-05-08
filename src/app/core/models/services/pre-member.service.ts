import { Injectable } from '@angular/core';
import { extend } from '@syncfusion/ej2-angular-grids';
import { ApiService } from './api.service';
import { HttpClient } from '@angular/common/http';
import { JsonConvert } from 'json2typescript';
import { Observable, catchError, map, throwError } from 'rxjs';
import { ODataResponse } from '../models/odata-response.model';
import { PreproductionMember } from '../models/database/db.model';

@Injectable({
  providedIn: 'root'
})
export class PreMemberService extends ApiService{

  constructor(protected override http : HttpClient) {
    super(http);
    this.jsonConvert = new JsonConvert();
   }

   getPreMemberbyId(Id : any): Observable<ODataResponse> {
    let url = `/PreproductionMembers?$filter=PreProductionId eq ${Id}&$expand=member&$orderby=Id DESC`;
    return super.get(url).pipe(
      catchError((err) => throwError(() => new Error(err))),

      map((res) => {
        const odataRes: ODataResponse = this.jsonConvert.deserializeObject(
          res,
          ODataResponse
        );
        let value: Array<PreproductionMember> = this.jsonConvert.deserializeArray(
          odataRes.value,
          PreproductionMember);
        odataRes.value = value;
        return odataRes;
      })
    );
  }

  
  CreatePreMember(formData: any): Observable<PreproductionMember> {
    let url = `/PreproductionMembers`;
    return super.postEntity(url, formData).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        return res;
      })
    );
  }
  UpdateMember(formData: any, Id: any): Observable<ODataResponse> {
    let url = `/PreproductionMembers`;
    return super.patchEntity(url, Id, formData).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        return res;
      })
    );
  }  
  DeleteMember(id: any): Observable<Object> {
    return super.deleteEntity('/PreproductionMembers', id).pipe(
      catchError((err) => {
        return throwError(() => err);
      })
    );
  }

}
