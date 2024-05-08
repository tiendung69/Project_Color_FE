import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JsonConvert } from 'json2typescript';
import { ApiService } from './api.service';
import { Observable, catchError, map, throwError } from 'rxjs';
import { ODataResponse } from '../models/odata-response.model';
import { PreproductionSegment } from '../models/database/db.model';

@Injectable({
  providedIn: 'root'
})
export class PreSegmentService  extends ApiService{

  constructor(protected override http : HttpClient) {
    super(http);
    this.jsonConvert = new JsonConvert();
   }
   //PreproductionSegments?$expand=PreproductionsegmentMembers($expand=User)
   getAddSegmentbyIdPlan(Id: any): Observable<ODataResponse> {
    let url = `/PreproductionSegments?$filter=PreProductionId eq ${Id}&$expand=district,commune,province,PreproductionsegmentMembers($expand=User;$orderby=Id desc)&$orderby=Id desc`;
    return super.get(url).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        const odateRes: ODataResponse = this.jsonConvert.deserializeObject(
          res,
          ODataResponse
        );
        let value: Array<PreproductionSegment> = this.jsonConvert.deserializeArray(
          odateRes.value,
          PreproductionSegment
        );
        odateRes.value = value;
        return odateRes;
      })
    );
  }
  getAddSegmentbyId(Id: any): Observable<ODataResponse> {
    let url = `/PreproductionSegments?$filter=Id eq ${Id}&$expand=district,commune,province,PreproductionsegmentMembers($expand=User;$orderby=Id desc)&$orderby=Id desc`;
    return super.get(url).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        const odateRes: ODataResponse = this.jsonConvert.deserializeObject(
          res,
          ODataResponse
        );
        let value: Array<PreproductionSegment> = this.jsonConvert.deserializeArray(
          odateRes.value,
          PreproductionSegment
        );
        odateRes.value = value;
        return odateRes;
      })
    );
  }
  getbyIdPlan(Id: any): Observable<ODataResponse> {
    let url = `/PreproductionSegments?$filter=PreProductionId eq ${Id}&$orderby=Id DESC`;
    return super.get(url).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        const odateRes: ODataResponse = this.jsonConvert.deserializeObject(
          res,
          ODataResponse
        );
        let value: Array<PreproductionSegment> = this.jsonConvert.deserializeArray(
          odateRes.value,
          PreproductionSegment
        );
        odateRes.value = value;
        return odateRes;
      })
    );
  }
  getAddSegment(): Observable<ODataResponse> {
    let url = `/PreproductionSegments?$orderby=Id DESC&$expand=PreProduction`;
    return super.get(url).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        const odateRes: ODataResponse = this.jsonConvert.deserializeObject(
          res,
          ODataResponse
        );
        let value: Array<PreproductionSegment> = this.jsonConvert.deserializeArray(
          odateRes.value,
          PreproductionSegment
        );
        odateRes.value = value;
        return odateRes;
      })
    );
  }
  getAllSegmentQuery(query: any): Observable<ODataResponse> {
    let url = `/PreproductionSegments?$orderby=Id DESC&$expand=PreProduction&${query}`;
    return super.get(url).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        const odateRes: ODataResponse = this.jsonConvert.deserializeObject(
          res,
          ODataResponse
        );
        let value: Array<PreproductionSegment> = this.jsonConvert.deserializeArray(
          odateRes.value,
          PreproductionSegment
        );
        odateRes.value = value;
        return odateRes;
      })
    );
  }
  getAddSegmentById(Id : any): Observable<ODataResponse> {
    let url = `/PreproductionSegments?$filter=Id eq ${Id}&$orderby=Id DESC`;
    return super.get(url).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        const odateRes: ODataResponse = this.jsonConvert.deserializeObject(
          res,
          ODataResponse
        );
        let value: Array<PreproductionSegment> = this.jsonConvert.deserializeArray(
          odateRes.value,
          PreproductionSegment
        );
        odateRes.value = value;
        return odateRes;
      })
    );
  }
  CreateSeg(formData: any): Observable<PreproductionSegment> {
    let url = `/PreproductionSegments`;
    return super.postEntity(url, formData).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        return res;
      })
    );
  }
  UpdateSeg(formData: any, Id: any): Observable<ODataResponse> {
    let url = `/PreproductionSegments`;
    return super.patchEntity(url, Id, formData).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        return res;
      })
    );
  } 
   DeleteSeg(id: any): Observable<Object> {
    return super.deleteEntity('/PreproductionSegments', id).pipe(
      catchError((err) => {
        return throwError(() => err);
      })
    );
  }

  


}
