import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { HttpClient } from '@angular/common/http';
import { JsonConvert } from 'json2typescript';
import { Observable, catchError, map, throwError } from 'rxjs';
import { ODataResponse } from '../models/odata-response.model';
import { Video } from '../models/database/db.model';

@Injectable({
  providedIn: 'root',
})
export class VideoService extends ApiService {
  constructor(protected override http: HttpClient) {
    super(http);
    this.jsonConvert = new JsonConvert();
  }

  getAllVideo(): Observable<ODataResponse> {
    let url = '/Videos?$Orderby=Id DESC';
    return super.get(url).pipe(
      catchError((err) => throwError(() => new Error(err))),

      map((res) => {
        const odataRes: ODataResponse = this.jsonConvert.deserializeObject(
          res,
          ODataResponse
        );
        let value: Array<Video> = this.jsonConvert.deserializeArray(
          odataRes.value,
          Video
        );
        odataRes.value = value;

        return odataRes;
      })
    );
  }

  getVideoById(Id: any): Observable<ODataResponse> {
    let url = `/Videos?$filter=Id eq ${Id}`;
    return super.get(url).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        const odateRes: ODataResponse = this.jsonConvert.deserializeObject(
          res,
          ODataResponse
        );
        let value: Array<Video> = this.jsonConvert.deserializeArray(
          odateRes.value,
          Video
        );
        odateRes.value = value;
        return odateRes;
      })
    );
  }
  getVideoByName(Name: any): Observable<ODataResponse> {
    let url = `/Videos?$filter=startswith(VideoName,'${Name}')`;
    return super.get(url).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        const odateRes: ODataResponse = this.jsonConvert.deserializeObject(
          res,
          ODataResponse
        );
        let value: Array<Video> = this.jsonConvert.deserializeArray(
          odateRes.value,
          Video
        );
        odateRes.value = value;
        return odateRes;
      })
    );
  }

  CreateVideo(formData: any): Observable<Video> {
    let url = `/Videos`;
    return super.postEntity(url, formData).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        return res;
      })
    );
  }

  UpdateVideo(formData: any, Id: any): Observable<Video> {
    let url = `/Videos`;
  return super.patchEntity(url, Id, formData).pipe(
    catchError((err) => throwError(() => new Error(err))),
    map((res) => {
      return res;
    })
  );
  }

  DeleteVideo(id: any): Observable<Video> {
    return super.deleteEntity('/Videos', id).pipe(
      catchError((err) => {
        return throwError(() => err);
      })
    );
  }

  getVideoByQuery(queryParams?: string): Observable<ODataResponse> {
    let url = `/Videos?${queryParams}`;
    return super.get(url).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        const odataRes: ODataResponse = this.jsonConvert.deserializeObject(
          res,
          ODataResponse
        );
        let value: Array<Video> = this.jsonConvert.deserializeArray(
          odataRes.value,
          Video
        );
        odataRes.value = value;
        return odataRes;
      })
    );
  }
}
