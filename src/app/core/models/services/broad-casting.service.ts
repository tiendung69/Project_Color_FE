import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { HttpClient } from '@angular/common/http';
import { JsonConvert } from 'json2typescript';
import { Observable, catchError, map, throwError } from 'rxjs';
import { ODataResponse } from '../models/odata-response.model';
import { Broadcasting } from '../models/database/db.model';

@Injectable({
  providedIn: 'root'
})
export class BroadCastingService extends ApiService{

  constructor(protected override http: HttpClient) {
    super(http);
    const jsonConvert = new JsonConvert();
  }
  getAllBroadCasting(): Observable<ODataResponse> {
    let url = '/Broadcastings?$expand=PostProductionPlaning($expand=PreProduction),Channel';
    return super.get(url).pipe(
      catchError((err) => throwError(() => new Error(err))),

      map((res) => {
        const odataRes: ODataResponse = this.jsonConvert.deserializeObject(
          res,
          ODataResponse
        );
        let value: Array<Broadcasting> = this.jsonConvert.deserializeArray(
          odataRes.value,
          Broadcasting
        );
        odataRes.value = value;

        return odataRes;
      })
    );
  }
  getBroadCastingByIdPlan(Id: any): Observable<ODataResponse> {
    let url = `/Broadcastings?$filter=PostProductionPlaningId eq ${Id}&$expand=PostProductionPlaning($expand=PreProduction),Channel`;
    return super.get(url).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        const odateRes: ODataResponse = this.jsonConvert.deserializeObject(
          res,
          ODataResponse
        );
        let value: Array<Broadcasting> = this.jsonConvert.deserializeArray(
          odateRes.value,
          Broadcasting
        );
        odateRes.value = value;
        return odateRes;
      })
    );
  }
  getBroadCastingById(Id: any): Observable<ODataResponse> {
    let url = `/Broadcastings?$filter=Id eq ${Id}&$expand=PostProductionPlaning($expand=PreProduction),Channel&$orderby=Id DESC`;
    return super.get(url).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        const odateRes: ODataResponse = this.jsonConvert.deserializeObject(
          res,
          ODataResponse
        );
        let value: Array<Broadcasting> = this.jsonConvert.deserializeArray(
          odateRes.value,
          Broadcasting
        );
        odateRes.value = value;
        return odateRes;
      })
    );
  }
  DeleteBroadCasting(id: any): Observable<Broadcasting> {
    return super.deleteEntity('/Broadcastings', id).pipe(
      catchError((err) => {
        return throwError(() => err);
      })
    );
  }
    CreateBroadCasting(formData: any): Observable<Broadcasting> {
    let url = `/Broadcastings`;
    return super.postEntity(url, formData).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        return res;
      })
    );
  }
  UpdateBroadCasting(formData: any, Id: any): Observable<Broadcasting> {
    let url = `/Broadcastings`;
    return super.patchEntity(url, Id, formData).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        return res;
      })
    );
  }
}
