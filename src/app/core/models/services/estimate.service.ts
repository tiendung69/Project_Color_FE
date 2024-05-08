import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { HttpClient } from '@angular/common/http';
import { JsonConvert } from 'json2typescript';
import { Observable, catchError, map, throwError } from 'rxjs';
import { ODataResponse } from '../models/odata-response.model';
import { Estimate } from '../models/database/db.model';

@Injectable({
  providedIn: 'root'
})
export class EstimateService extends ApiService {

  constructor(protected override http : HttpClient) {
    super(http);
    const jsonConvert = new JsonConvert();
   }
  getEstimate(): Observable<ODataResponse> {
    let url = '/Estimates?$expand=PreProductPlaning&$orderby=Id DESC';
    return super.get(url).pipe(
      catchError((err) => throwError(() => new Error(err))),

      map((res) => {
        const odataRes: ODataResponse = this.jsonConvert.deserializeObject(
          res,
          ODataResponse
        );
        let value: Array<Estimate> = this.jsonConvert.deserializeArray(
          odataRes.value,
          Estimate
        );
        odataRes.value = value;

        return odataRes;
      })
    );
  }
  getEstimateByPlan(Id: any): Observable<ODataResponse> {
    let url = `/Estimates?$filter=PreProductPlaningId eq ${Id}&$expand=PreProductPlaning,CreatedByNavigation&$orderby=Id DESC`;
    return super.get(url).pipe(
      catchError((err) => throwError(() => new Error(err))),

      map((res) => {
        const odataRes: ODataResponse = this.jsonConvert.deserializeObject(
          res,
          ODataResponse
        );
        let value: Array<Estimate> = this.jsonConvert.deserializeArray(
          odataRes.value,
          Estimate
        );
        odataRes.value = value;

        return odataRes;
      })
    );
  }
  CreateEstimate(formData: any): Observable<Estimate> {
    let url = `/Estimates`;
    return super.postEntity(url, formData).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        return res;
      })
    );
  }
  UpdateEstimate(formData: any, Id: any): Observable<Estimate> {
    let url = `/Estimates`;
  return super.patchEntity(url, Id, formData).pipe(
    catchError((err) => throwError(() => new Error(err))),
    map((res) => {
      return res;
    })
  );
  }
  getEstimateById(Id: any): Observable<ODataResponse> {
    let url = `/Estimates?$filter=Id eq ${Id}&$expand=PreProductPlaning,CreatedByNavigation&$orderby=Id DESC`;
    return super.get(url).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        const odateRes: ODataResponse = this.jsonConvert.deserializeObject(
          res,
          ODataResponse
        );
        let value: Array<Estimate> = this.jsonConvert.deserializeArray(
          odateRes.value,
          Estimate
        );
        odateRes.value = value;
        return odateRes;
      })
    );
  }
  DeleteEstimate(id: any): Observable<Object> {
    return super.deleteEntity('/Estimates', id).pipe(
      catchError((err) => {
        return throwError(() => err);
      })
    );
  }
}
