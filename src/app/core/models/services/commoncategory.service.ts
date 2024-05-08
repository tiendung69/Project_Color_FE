import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable, catchError, map, throwError } from 'rxjs';
import { ODataResponse } from '../models/odata-response.model';
import { JsonConvert } from 'json2typescript';
import { HttpClient } from '@angular/common/http';
import { Commoncategory } from 'src/app/core/models/database/db.model';
import { CommonCategoriesType } from '../utils/constant';

@Injectable({
  providedIn: 'root',
})
export class CommoncategoryService extends ApiService {
  constructor(protected override http: HttpClient) {
    super(http);
    this.jsonConvert = new JsonConvert();
  }
  getAllCommonCategory(): Observable<ODataResponse> {
    let url = '/commoncategories?$orderby=Id DESC';
    return super.get(url).pipe(
      catchError((err) => throwError(() => new Error(err))),

      map((res) => {
        const odataRes: ODataResponse = this.jsonConvert.deserializeObject(
          res,
          ODataResponse
        );
        let value: Array<Commoncategory> = this.jsonConvert.deserializeArray(
          odataRes.value,
          Commoncategory
        );
        odataRes.value = value;

        return odataRes;
      })
    );
  }
  UpdateCommonCategory(formData: any, Id: any): Observable<Commoncategory> {
    let url = `/commoncategories`;
    return super.patchEntity(url, Id, formData).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        return res;
      })
    );
  }
  DeleteCommonCategory(id: any): Observable<Commoncategory> {
    return super.deleteEntity('/commoncategories', id).pipe(
      catchError((err) => {
        return throwError(() => err);
      })
    );
  }

  CreateCommoncategory(formData: any): Observable<Commoncategory> {
    let url = `/commoncategories`;
    return super.postEntity(url, formData).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        return res;
      })
    );
  }
  getCateById(Id: any, Id2: any): Observable<ODataResponse> {
    let url = `/commonCategories?$filter=Type eq ${Id} or Type eq ${Id2}&$orderby=Id DESC`;
    return super.get(url).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        const odateRes: ODataResponse = this.jsonConvert.deserializeObject(
          res,
          ODataResponse
        );
        let value: Array<Commoncategory> = this.jsonConvert.deserializeArray(
          odateRes.value,
          Commoncategory
        );
        odateRes.value = value;
        return odateRes;
      })
    );
  }
  getCateByIds(Id: any): Observable<ODataResponse> {
    let url = `/commonCategories?$filter=Id eq ${Id}`;
    return super.get(url).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        const odateRes: ODataResponse = this.jsonConvert.deserializeObject(
          res,
          ODataResponse
        );
        let value: Array<Commoncategory> = this.jsonConvert.deserializeArray(
          odateRes.value,
          Commoncategory
        );
        odateRes.value = value;
        return odateRes;
      })
    );
  }
  getCateByType(type: CommonCategoriesType): Observable<ODataResponse> {
    let url = `/commonCategories?$filter=Type eq ${type}&$expand=RoleRightRights&$orderby=Id DESC`;
    return super.get(url).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        const odateRes: ODataResponse = this.jsonConvert.deserializeObject(
          res,
          ODataResponse
        );
        let value: Array<Commoncategory> = this.jsonConvert.deserializeArray(
          odateRes.value,
          Commoncategory
        );
        odateRes.value = value;
        return odateRes;
      })
    );
  }
  getCateByType2(type: CommonCategoriesType): Observable<ODataResponse> {
    let url = `/commonCategories?$filter=Type eq ${type}&$expand=RoleRightRights,RoleRightRoles($expand=Role,Right)&$orderby=Id DESC`;
    return super.get(url).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        const odateRes: ODataResponse = this.jsonConvert.deserializeObject(
          res,
          ODataResponse
        );
        let value: Array<Commoncategory> = this.jsonConvert.deserializeArray(
          odateRes.value,
          Commoncategory
        );
        odateRes.value = value;
        return odateRes;
      })
    );
  }
  getCateByTypeAndParentId(type: CommonCategoriesType, Id : any): Observable<ODataResponse> {
    let url = `/commonCategories?$filter=Type eq ${type} and ParentId eq ${Id}&$expand=RoleRightRights,RoleRightRoles($expand=Role,Right)&$orderby=Id DESC`;
    return super.get(url).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        const odateRes: ODataResponse = this.jsonConvert.deserializeObject(
          res,
          ODataResponse
        );
        let value: Array<Commoncategory> = this.jsonConvert.deserializeArray(
          odateRes.value,
          Commoncategory
        );
        odateRes.value = value;
        return odateRes;
      })
    );
  }
}
