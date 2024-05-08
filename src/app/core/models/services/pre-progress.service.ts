import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { HttpClient } from '@angular/common/http';
import { JsonConvert } from 'json2typescript';
import { Observable, catchError, map, throwError } from 'rxjs';
import { ODataResponse } from '../models/odata-response.model';
import { PreproductionProgress } from '../models/database/db.model';

@Injectable({
  providedIn: 'root'
})
export class PreProgressService extends ApiService {

  constructor(protected override http: HttpClient) {
    super(http);
    const jsonConvert = new JsonConvert();
  }
  getAllPreProgress(): Observable<ODataResponse> {
    let url = '/PreproductionProgress?$expand=PreProduction($expand=Estimates),PreproductionprogressMembers,Segment&$orderby=Id DESC';
    return super.get(url).pipe(
      catchError((err) => throwError(() => new Error(err))),

      map((res): ODataResponse => {
        const odataRes: ODataResponse = this.jsonConvert.deserializeObject(
          res,
          ODataResponse
        );
        let value: Array<PreproductionProgress> = this.jsonConvert.deserializeArray(
          odataRes.value,
          PreproductionProgress);
        odataRes.value = value;
        return odataRes;
      })
    );
  }
  getAllPreProgressById(Id: any): Observable<ODataResponse> {
    let url = `/PreproductionProgress?$filter=Id eq ${Id}&$expand=PreProduction($expand=Estimates),PreproductionprogressMembers,Segment&$orderby=Id DESC`;
    return super.get(url).pipe(
      catchError((err) => throwError(() => new Error(err))),

      map((res): ODataResponse => {
        const odataRes: ODataResponse = this.jsonConvert.deserializeObject(
          res,
          ODataResponse
        );
        let value: Array<PreproductionProgress> = this.jsonConvert.deserializeArray(
          odataRes.value,
          PreproductionProgress);
        odataRes.value = value;
        return odataRes;
      })
    );
  }

  getAllPreProgressByIdPlan(Id: any): Observable<ODataResponse> {
    let url = `/PreproductionProgress?$filter=PreProductionId eq ${Id}&$expand=PreProduction($expand=Estimates),PreproductionprogressMembers,Segment,ExpenseTypeNavigation&$orderby=Id DESC`;
    return super.get(url).pipe(
      catchError((err) => throwError(() => new Error(err))),

      map((res): ODataResponse => {
        const odataRes: ODataResponse = this.jsonConvert.deserializeObject(
          res,
          ODataResponse
        );
        let value: Array<PreproductionProgress> = this.jsonConvert.deserializeArray(
          odataRes.value,
          PreproductionProgress);
        odataRes.value = value;
        return odataRes;
      })
    );
  }

  getPreproductionProgressById(Id: any): Observable<ODataResponse> {
    let url = `/PreproductionProgress?$filter=Id eq ${Id}&$expand=Segment
`;
    return super.get(url).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        const odateRes: ODataResponse = this.jsonConvert.deserializeObject(
          res,
          ODataResponse
        );
        let value: Array<PreproductionProgress> = this.jsonConvert.deserializeArray(
          odateRes.value,
          PreproductionProgress
        );
        odateRes.value = value;
        return odateRes;
      })
    );
  }

  UpdateProgess(formData: any, Id: any): Observable<PreproductionProgress> {
    let url = `/PreproductionProgress`;
  return super.patchEntity(url, Id, formData).pipe(
    catchError((err) => throwError(() => new Error(err))),
    map((res) => {
      return res;
    })
  );
  }
  CreateProgess(formData: any): Observable<PreproductionProgress> {
    let url = `/PreproductionProgress`;
    return super.postEntity(url, formData).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        return res;
      })
    );
  }

  DeleteProgress(id: any): Observable<Object> {
    return super.deleteEntity('/PreproductionProgress', id).pipe(
      catchError((err) => {
        return throwError(() => err);
      })
    );
  }
}
