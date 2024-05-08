import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { HttpClient } from '@angular/common/http';
import { JsonConvert } from 'json2typescript';
import { PreproductionsegmentMember } from '../models/database/db.model';
import { Observable, catchError, map, throwError } from 'rxjs';
import { ODataResponse } from '../models/odata-response.model';

@Injectable({
  providedIn: 'root'
})
export class PreSegmentMemberService extends ApiService{

  constructor(protected override http: HttpClient) {
    super(http);
    const jsonConvert = new JsonConvert();
   }
   CreateSegmentMember(formData: any): Observable<PreproductionsegmentMember> {
    let url = `/PreproductionSegmentMembers`;
    return super.postEntity(url, formData).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        return res;
      })
    );
  }

  UpdateSegmentMember(formData: any, Id: any): Observable<PreproductionsegmentMember> {
    let url = `/PreproductionSegmentMembers`;
  return super.patchEntity(url, Id, formData).pipe(
    catchError((err) => throwError(() => new Error(err))),
    map((res) => {
      return res;
    })
  );
  }
  getSegmentMemberByPreSegmentId(Id: any): Observable<ODataResponse>{
    let url = `/PreproductionSegmentMembers?$filter=PreProductionSegmentId eq ${Id}&$orderby=Id DESC`;
    return super.get(url).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        const odataRes: ODataResponse = this.jsonConvert.deserializeObject(res,ODataResponse);
        let value: Array<PreproductionsegmentMember> = this.jsonConvert.deserializeArray(odataRes.value,PreproductionsegmentMember);
        odataRes.value = value;
        return odataRes;
      })
    )
  }
  getSegmentMemberByPreSegment(): Observable<ODataResponse>{
    let url = `/PreproductionSegmentMembers&$orderby=Id DESC`;
    return super.get(url).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        const odataRes: ODataResponse = this.jsonConvert.deserializeObject(res,ODataResponse);
        let value: Array<PreproductionsegmentMember> = this.jsonConvert.deserializeArray(odataRes.value,PreproductionsegmentMember);
        odataRes.value = value;
        return odataRes;
      })
    )
  }
  DeleteSegmentMember(id: any): Observable<Object> {
    return super.deleteEntity('/PreproductionSegmentMembers', id).pipe(
      catchError((err) => {
        return throwError(() => err);
      })
    );
  }
}
