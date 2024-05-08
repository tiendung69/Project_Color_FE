import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { HttpClient } from '@angular/common/http';
import { JsonConvert } from 'json2typescript';
import { Observable, catchError, map, throwError } from 'rxjs';
import { ODataResponse } from '../models/odata-response.model';
import { Log } from '../models/database/db.model';

@Injectable({
  providedIn: 'root',
})
export class LogService extends ApiService {
  constructor(protected override http: HttpClient) {
    super(http);
    this.jsonConvert = new JsonConvert();
  }

  getAllLog(): Observable<ODataResponse> {
    let url = '/Logs?$Orderby=Id DESC';
    return super.get(url).pipe(
      catchError((err) => throwError(() => new Error(err))),

      map((res) => {
        const odataRes: ODataResponse = this.jsonConvert.deserializeObject(
          res,
          ODataResponse
        );
        let value: Array<Log> = this.jsonConvert.deserializeArray(
          odataRes.value,
          Log
        );
        odataRes.value = value;

        return odataRes;
      })
    );
  }

  getLogById(Id: any): Observable<ODataResponse> {
    let url = `/Logs?$filter=Id eq ${Id}`;
    return super.get(url).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        const odateRes: ODataResponse = this.jsonConvert.deserializeObject(
          res,
          ODataResponse
        );
        let value: Array<Log> = this.jsonConvert.deserializeArray(
          odateRes.value,
          Log
        );
        odateRes.value = value;
        return odateRes;
      })
    );
  }

  CreateLog(formData: any): Observable<Log> {
    let url = `/Logs`;
    return super.postEntity(url, formData).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        return res;
      })
    );
  }

  UpdateLog(formData: any, Id: any): Observable<Log> {
    let url = `/Logs`;
  return super.patchEntity(url, Id, formData).pipe(
    catchError((err) => throwError(() => new Error(err))),
    map((res) => {
      return res;
    })
  );
  }

  DeleteLog(id: any): Observable<Log> {
    return super.deleteEntity('/Logs', id).pipe(
      catchError((err) => {
        return throwError(() => err);
      })
    );
  }

  getLogByQuery(queryParams?: string): Observable<ODataResponse> {
    let url = `/Logs?${queryParams}`;
    return super.get(url).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        const odataRes: ODataResponse = this.jsonConvert.deserializeObject(
          res,
          ODataResponse
        );
        let value: Array<Log> = this.jsonConvert.deserializeArray(
          odataRes.value,
          Log
        );
        odataRes.value = value;
        return odataRes;
      })
    );
  }
}
