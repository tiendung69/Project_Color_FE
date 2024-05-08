import { Injectable } from '@angular/core';
import { extend } from '@syncfusion/ej2-angular-grids';
import { ApiService } from './api.service';
import { HttpClient } from '@angular/common/http';
import { JsonConvert } from 'json2typescript';
import { Observable, catchError, map, throwError } from 'rxjs';
import { ODataResponse } from '../models/odata-response.model';
import { PreproductionPlaning } from '../models/database/db.model';

@Injectable({
  providedIn: 'root'
})
export class PrePlanService extends ApiService {

  constructor(protected override http : HttpClient) 
  {
    super(http);
    this.jsonConvert = new JsonConvert();
   }
   getAllPlan(): Observable<ODataResponse> {
    let url = '/PreproductionPlanings?$expand=topic,PreproductionSegments,Team,PreproductionProgresses,Category&$orderby=Id DESC';
    return super.get(url).pipe(
      catchError((err) => throwError(() => new Error(err))),

      map((res) => {
        const odataRes: ODataResponse = this.jsonConvert.deserializeObject(
          res,
          ODataResponse
        );
        let value: Array<PreproductionPlaning> = this.jsonConvert.deserializeArray(
          odataRes.value,
          PreproductionPlaning);
        odataRes.value = value;
        return odataRes;
      })
    );
  }  
   getAllPlanByUser(Id : any): Observable<ODataResponse> {
    let url = `/PreproductionPlanings?$expand=topic,PreproductionSegments,Team,PreproductionProgresses,Category&$filter=CreatedBy eq ${Id}&$orderby=Id DESC`;
    return super.get(url).pipe(
      catchError((err) => throwError(() => new Error(err))),

      map((res) => {
        const odataRes: ODataResponse = this.jsonConvert.deserializeObject(
          res,
          ODataResponse
        );
        let value: Array<PreproductionPlaning> = this.jsonConvert.deserializeArray(
          odataRes.value,
          PreproductionPlaning);
        odataRes.value = value;
        return odataRes;
      })
    );
  }
  getAllPlanWithEstimate(): Observable<ODataResponse> {
    let url = '/PreproductionPlanings?$expand=Estimates,PreproductionProgresses&$orderby=Id DESC';
    return super.get(url).pipe(
      catchError((err) => throwError(() => new Error(err))),

      map((res) => {
        const odataRes: ODataResponse = this.jsonConvert.deserializeObject(
          res,
          ODataResponse
        );
        let value: Array<PreproductionPlaning> = this.jsonConvert.deserializeArray(
          odataRes.value,
          PreproductionPlaning);
        odataRes.value = value;
        return odataRes;
      })
    );
  }
  getPlanFlowbyStatus(): Observable<ODataResponse> {
    let url = '/PreproductionPlanings?$filter=status eq 5';
    return super.get(url).pipe(
      catchError((err) => throwError(() => new Error(err))),

      map((res) => {
        const odataRes: ODataResponse = this.jsonConvert.deserializeObject(
          res,
          ODataResponse
        );
        let value: Array<PreproductionPlaning> = this.jsonConvert.deserializeArray(
          odataRes.value,
          PreproductionPlaning);
        odataRes.value = value;
        return odataRes;
      })
    );
  }
  getPlanQuery(query : any): Observable<ODataResponse> {
    let url = `/PreproductionPlanings?$filter=status eq 5 ${query}`;
    return super.get(url).pipe(
      catchError((err) => throwError(() => new Error(err))),

      map((res) => {
        const odataRes: ODataResponse = this.jsonConvert.deserializeObject(
          res,
          ODataResponse
        );
        let value: Array<PreproductionPlaning> = this.jsonConvert.deserializeArray(
          odataRes.value,
          PreproductionPlaning);
        odataRes.value = value;
        return odataRes;
      })
    );
  }
  getPlanById(Id: any): Observable<ODataResponse> {
    let url = `/PreproductionPlanings?$filter=Id eq ${Id}&$expand=topic,PreproductionSegments,Team,Category&$orderby=Id DESC`;
    return super.get(url).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        const odateRes: ODataResponse = this.jsonConvert.deserializeObject(
          res,
          ODataResponse
        );
        let value: Array<PreproductionPlaning> = this.jsonConvert.deserializeArray(
          odateRes.value,
          PreproductionPlaning
        );
        odateRes.value = value;
        return odateRes;
      })
    );
  }
  
  getPlanByUser(Id: any): Observable<ODataResponse> {
    let url = `/PreproductionPlanings?$filter=CreatedBy eq ${Id}&$expand=topic,PreproductionSegments,Team,Category&$orderby=Id DESC`;
    return super.get(url).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        const odateRes: ODataResponse = this.jsonConvert.deserializeObject(
          res,
          ODataResponse
        );
        let value: Array<PreproductionPlaning> = this.jsonConvert.deserializeArray(
          odateRes.value,
          PreproductionPlaning
        );
        odateRes.value = value;
        return odateRes;
      })
    );
  }
  CreatePlan(formData: any): Observable<PreproductionPlaning> {
    let url = `/PreproductionPlanings`;
    return super.postEntity(url, formData).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        return res;
      })
    );
  }

  UpdatePlan(formData: any, Id: any): Observable<PreproductionPlaning> {
    let url = `/PreproductionPlanings`;
  return super.patchEntity(url, Id, formData).pipe(
    catchError((err) => throwError(() => new Error(err))),
    map((res) => {
      return res;
    })
  );
  }
  DeletePlan(id: any): Observable<Object> {
    return super.deleteEntity('/PreproductionPlanings', id).pipe(
      catchError((err) => {
        return throwError(() => err);
      })
    );
  }
}
