import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { HttpClient } from '@angular/common/http';
import { JsonConvert } from 'json2typescript';
import { Observable, catchError, map, throwError } from 'rxjs';
import { ODataResponse } from '../models/odata-response.model';
import { Approved } from '../models/database/db.model';

@Injectable({
  providedIn: 'root',
})
export class ApprovedService extends ApiService {
  constructor(protected override http: HttpClient) {
    super(http);
    this.jsonConvert = new JsonConvert();
  }
  CreateApprove(formData: any): Observable<ODataResponse> {
    let url = `/Approveds`;
    return super.postEntity(url, formData).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        return res;
      })
    );
  }
  getListApprovedByQuery(queryParams: string): Observable<ODataResponse> {
    let url = `/Approveds?${queryParams}`;
    return super.get(url).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        const odataRes: ODataResponse = this.jsonConvert.deserializeObject(
          res,
          ODataResponse
        );
        let value: Array<Approved> = this.jsonConvert.deserializeArray(
          odataRes.value,
          Approved
        );
        odataRes.value = value;
        return odataRes;
      })
    );
  }
  getApprovedByIdTopic(Id: any): Observable<ODataResponse> {
    let url = `/Approveds?$filter=ObjectId eq ${Id}`;
    return super.get(url).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        const odateRes: ODataResponse = this.jsonConvert.deserializeObject(
          res,
          ODataResponse
        );
        let value: Array<Approved> = this.jsonConvert.deserializeArray(
          odateRes.value,
          Approved
        );
        odateRes.value = value;
        return odateRes;
      })
    );
  }
}
