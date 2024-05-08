import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { HttpClient } from '@angular/common/http';
import { JsonConvert } from 'json2typescript';
import { Observable, catchError, map, throwError } from 'rxjs';
import { ODataResponse } from '../models/odata-response.model';
import { ElasticField } from '../models/database/db.model';

@Injectable({
  providedIn: 'root',
})
export class ElasticFieldService extends ApiService {
  constructor(protected override http: HttpClient) {
    super(http);
    this.jsonConvert = new JsonConvert();
  }

  getAllElasticField(): Observable<ODataResponse> {
    let url = '/ElasticFields?$Orderby=Id DESC';
    return super.get(url).pipe(
      catchError((err) => throwError(() => new Error(err))),

      map((res) => {
        const odataRes: ODataResponse = this.jsonConvert.deserializeObject(
          res,
          ODataResponse
        );
        let value: Array<ElasticField> = this.jsonConvert.deserializeArray(
          odataRes.value,
          ElasticField
        );
        odataRes.value = value;

        return odataRes;
      })
    );
  }

  getElasticFieldById(Id: any): Observable<ODataResponse> {
    let url = `/ElasticFields?$filter=Id eq ${Id}`;
    return super.get(url).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        const odateRes: ODataResponse = this.jsonConvert.deserializeObject(
          res,
          ODataResponse
        );
        let value: Array<ElasticField> = this.jsonConvert.deserializeArray(
          odateRes.value,
          ElasticField
        );
        odateRes.value = value;
        return odateRes;
      })
    );
  }

  CreateElasticField(formData: any): Observable<ElasticField> {
    let url = `/ElasticFields`;
    return super.postEntity(url, formData).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        return res;
      })
    );
  }

  UpdateElasticField(formData: any, Id: any): Observable<ElasticField> {
    let url = `/ElasticFields`;
    return super.patchEntity(url, Id, formData).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        return res;
      })
    );
  }

  DeleteElasticField(id: any): Observable<ElasticField> {
    return super.deleteEntity('/ElasticFields', id).pipe(
      catchError((err) => {
        return throwError(() => err);
      })
    );
  }

  getElasticFieldByQuery(queryParams?: string): Observable<ODataResponse> {
    let url = `/ElasticFields?${queryParams}`;
    return super.get(url).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        const odataRes: ODataResponse = this.jsonConvert.deserializeObject(
          res,
          ODataResponse
        );
        let value: Array<ElasticField> = this.jsonConvert.deserializeArray(
          odataRes.value,
          ElasticField
        );
        odataRes.value = value;
        return odataRes;
      })
    );
  }
  getFieldSetting(): Observable<any> {
    let url = `/MetaData/Getall`;
    return super.get(url).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        return res;
      })
    );
  }
}
