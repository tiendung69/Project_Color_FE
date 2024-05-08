import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { HttpClient } from '@angular/common/http';
import { JsonConvert } from 'json2typescript';
import { Observable, catchError, map, throwError } from 'rxjs';
import { ODataResponse } from '../models/odata-response.model';
import { VideoCompress } from '../models/database/db.model';

@Injectable({
  providedIn: 'root',
})
export class VideoCompressService extends ApiService {
  constructor(protected override http: HttpClient) {
    super(http);
    this.jsonConvert = new JsonConvert();
  }

  getAllVideoCompress(): Observable<ODataResponse> {
    let url = '/VideoCompresses?$Orderby=Id DESC';
    return super.get(url).pipe(
      catchError((err) => throwError(() => new Error(err))),

      map((res) => {
        const odataRes: ODataResponse = this.jsonConvert.deserializeObject(
          res,
          ODataResponse
        );
        let value: Array<VideoCompress> = this.jsonConvert.deserializeArray(
          odataRes.value,
          VideoCompress
        );
        odataRes.value = value;

        return odataRes;
      })
    );
  }

  getVideoCompressById(Id: any): Observable<ODataResponse> {
    let url = `/VideoCompresses?$filter=Id eq ${Id}&$expand=UploadPart
`;
    return super.get(url).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        const odateRes: ODataResponse = this.jsonConvert.deserializeObject(
          res,
          ODataResponse
        );
        let value: Array<VideoCompress> = this.jsonConvert.deserializeArray(
          odateRes.value,
          VideoCompress
        );
        odateRes.value = value;
        return odateRes;
      })
    );
  }

  CreateVideoCompress(formData: any): Observable<VideoCompress> {
    let url = `/VideoCompresses`;
    return super.postEntity(url, formData).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        return res;
      })
    );
  }

  UpdateVideoCompress(formData: any, Id: any): Observable<VideoCompress> {
    let url = `/VideoCompresses`;
    return super.patchEntity(url, Id, formData).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        return res;
      })
    );
  }

  DeleteVideoCompress(id: any): Observable<VideoCompress> {
    return super.deleteEntity('/VideoCompresses', id).pipe(
      catchError((err) => {
        return throwError(() => err);
      })
    );
  }

  getVideoCompressByQuery(queryParams?: string): Observable<ODataResponse> {
    let url = `/VideoCompresses?${queryParams}`;
    return super.get(url).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        const odataRes: ODataResponse = this.jsonConvert.deserializeObject(
          res,
          ODataResponse
        );
        let value: Array<VideoCompress> = this.jsonConvert.deserializeArray(
          odataRes.value,
          VideoCompress
        );
        odataRes.value = value;
        return odataRes;
      })
    );
  }
}
