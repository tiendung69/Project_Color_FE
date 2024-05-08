import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { JsonConvert } from 'json2typescript';
import { ODataResponse } from '../models/odata-response.model';
import { Observable, catchError, map, throwError } from 'rxjs';
import { PostproductionPlaning } from '../models/database/db.model';

@Injectable({
  providedIn: 'root'
})
export class PostProPlanService extends ApiService {

  constructor(protected override http : HttpClient) { 
    super(http);
    const jsonConvert = new JsonConvert();
  }
  getAllPostPlan(): Observable<ODataResponse> {
    let url = '/PostproductionPlanings?$expand=PreProduction&$orderby=Id DESC';
    return super.get(url).pipe(
      catchError((err) => throwError(() => new Error(err))),

      map((res) => {
        const odataRes: ODataResponse = this.jsonConvert.deserializeObject(
          res,
          ODataResponse
        );
        let value: Array<PostproductionPlaning> = this.jsonConvert.deserializeArray(
          odataRes.value,
          PostproductionPlaning);
        odataRes.value = value;
        return odataRes;
      })
    );
  }
  getAllPostPlanByIdUser(Id : any): Observable<ODataResponse> {
    let url = `/PostproductionPlanings?$expand=PreProduction&$filter=PreProduction/CreatedBy eq ${Id}&$orderby=Id desc`;
    return super.get(url).pipe(
      catchError((err) => throwError(() => new Error(err))),

      map((res) => {
        const odataRes: ODataResponse = this.jsonConvert.deserializeObject(
          res,
          ODataResponse
        );
        let value: Array<PostproductionPlaning> = this.jsonConvert.deserializeArray(
          odataRes.value,
          PostproductionPlaning);
        odataRes.value = value;
        return odataRes;
      })
    );
  }
  getAllPostPlanById(Id: any): Observable<ODataResponse> {
    let url = `/PostproductionPlanings?$filter=Id eq ${Id}&$expand=PreProduction,Broadcastings($expand=Channel)`;
    return super.get(url).pipe(
      catchError((err) => throwError(() => new Error(err))),

      map((res) => {
        const odataRes: ODataResponse = this.jsonConvert.deserializeObject(
          res,
          ODataResponse
        );
        let value: Array<PostproductionPlaning> = this.jsonConvert.deserializeArray(
          odataRes.value,
          PostproductionPlaning);
        odataRes.value = value;
        return odataRes;
      })
    );
  }

  getAllPostPlanByIdBroadCasting(Id: any): Observable<ODataResponse> {
    let url = `/PostproductionPlanings?$filter=Id eq ${Id}&$expand=PreProduction,Broadcastings($expand=Channel)`;
    return super.get(url).pipe(
      catchError((err) => throwError(() => new Error(err))),

      map((res) => {
        const odataRes: ODataResponse = this.jsonConvert.deserializeObject(
          res,
          ODataResponse
        );
        let value: Array<PostproductionPlaning> = this.jsonConvert.deserializeArray(
          odataRes.value,
          PostproductionPlaning);
        odataRes.value = value;
        return odataRes;
      })
    );
  }

  createPostPlan(formData: any): Observable<PostproductionPlaning> {
    let url = `/PostproductionPlanings?$expand=Preproduction`;
    return super.postEntity(url, formData).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        return res;
      })
    );
  }
  UpdatePostPlan(formData: any, Id: any): Observable<PostproductionPlaning> {
    let url = `/PostproductionPlanings`;
    return super.patchEntity(url, Id, formData).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        return res;
      })
    );
  } 
  DeletePostPlan(id: any): Observable<Object> {
    return super.deleteEntity('/PostproductionPlanings', id).pipe(
      catchError((err) => {
        return throwError(() => err);
      })
    );
  }
  getAllPostPlanByIdPrePlan(Id: any): Observable<ODataResponse> {
    let url = `/PostproductionPlanings?$filter=PreProductionId eq ${Id}&$expand=PreProduction`;
    return super.get(url).pipe(
      catchError((err) => throwError(() => new Error(err))),

      map((res) => {
        const odataRes: ODataResponse = this.jsonConvert.deserializeObject(
          res,
          ODataResponse
        );
        let value: Array<PostproductionPlaning> = this.jsonConvert.deserializeArray(
          odataRes.value,
          PostproductionPlaning);
        odataRes.value = value;
        return odataRes;
      })
    );
  } 
  getPostAndBroadCasting(){
    let url = `/PostproductionPlanings?$expand=Broadcastings($expand=Channel),PreProduction&$filter=Status eq 5`;
    return super.get(url).pipe(
      catchError((err) => throwError(() => new Error(err))),

      map((res) => {
        const odataRes: ODataResponse = this.jsonConvert.deserializeObject(
          res,
          ODataResponse
        );
        let value: Array<PostproductionPlaning> = this.jsonConvert.deserializeArray(
          odataRes.value,
          PostproductionPlaning);
        odataRes.value = value;
        return odataRes;
      })
    );
  }
  getPostAndBroadCastingUserId(Id : any){
    let url = `/PostproductionPlanings?$expand=Broadcastings($expand=Channel),PreProduction&$filter=PreProduction/CreatedBy eq ${Id} and Status eq 5`;
    return super.get(url).pipe(
      catchError((err) => throwError(() => new Error(err))),

      map((res) => {
        const odataRes: ODataResponse = this.jsonConvert.deserializeObject(
          res,
          ODataResponse
        );
        let value: Array<PostproductionPlaning> = this.jsonConvert.deserializeArray(
          odataRes.value,
          PostproductionPlaning);
        odataRes.value = value;
        return odataRes;
      })
    );
  }
  getPostAndBroadCastingById(){
    let url = `/PostproductionPlanings?$expand=Broadcastings($expand=Channel),PreProduction`;
    return super.get(url).pipe(
      catchError((err) => throwError(() => new Error(err))),

      map((res) => {
        const odataRes: ODataResponse = this.jsonConvert.deserializeObject(
          res,
          ODataResponse
        );
        let value: Array<PostproductionPlaning> = this.jsonConvert.deserializeArray(
          odataRes.value,
          PostproductionPlaning);
        odataRes.value = value;
        return odataRes;
      })
    );
  }
}
