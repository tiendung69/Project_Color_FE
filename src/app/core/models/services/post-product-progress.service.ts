import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { HttpClient } from '@angular/common/http';
import { JsonConvert } from 'json2typescript';
import { Observable, catchError, map, throwError } from 'rxjs';
import { ODataResponse } from '../models/odata-response.model';
import { PostproductionProgress } from '../models/database/db.model';

@Injectable({
  providedIn: 'root'
})
export class PostProductProgressService extends ApiService {

  constructor(protected override http: HttpClient) { 
    super(http);
    const jsonConvert = new JsonConvert();
  }

  getPostProgressByIdPlan(Id: any): Observable<ODataResponse> {
    let url = `/PostproductionProgress?$filter=PostProductionId eq ${Id}&$expand=PostProduction,ExpenseTypeNavigation&$orderby=Id DESC`;
    return super.get(url).pipe(
      catchError((err) => throwError(() => new Error(err))),

      map((res) => {
        const odataRes: ODataResponse = this.jsonConvert.deserializeObject(
          res,
          ODataResponse
        );
        let value: Array<PostproductionProgress> = this.jsonConvert.deserializeArray(
          odataRes.value,
          PostproductionProgress);
        odataRes.value = value;
        return odataRes;
      })
    );
  }
  getPostProgressById(Id: any): Observable<ODataResponse> {
    let url = `/PostproductionProgress?$filter=Id eq ${Id}&$expand=PostProduction`;
    return super.get(url).pipe(
      catchError((err) => throwError(() => new Error(err))),

      map((res) => {
        const odataRes: ODataResponse = this.jsonConvert.deserializeObject(
          res,
          ODataResponse
        );
        let value: Array<PostproductionProgress> = this.jsonConvert.deserializeArray(
          odataRes.value,
          PostproductionProgress);
        odataRes.value = value;
        return odataRes;
      })
    );
  }

  createPostProgresss(formData: any): Observable<PostproductionProgress> {
    let url = `/PostproductionProgress`;
    return super.postEntity(url, formData).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        return res;
      })
    );
  }
  UpdatePostProgress(formData: any, Id: any): Observable<PostproductionProgress> {
    let url = `/PostproductionProgress`;
    return super.patchEntity(url, Id, formData).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        return res;
      })
    );
  } 
  DeletePostProgress(id: any): Observable<Object> {
    return super.deleteEntity('/PostproductionProgress', id).pipe(
      catchError((err) => {
        return throwError(() => err);
      })
    );
  }
}
