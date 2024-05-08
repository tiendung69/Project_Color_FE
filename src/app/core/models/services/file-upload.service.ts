import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { HttpClient } from '@angular/common/http';
import { JsonConvert } from 'json2typescript';
import { Observable, catchError, map, throwError } from 'rxjs';
import { ODataResponse } from '../models/odata-response.model';
import { DBType } from '../utils/constant';

@Injectable({
  providedIn: 'root',
})
export class UploadService extends ApiService {
  constructor(protected override http: HttpClient) {
    super(http);
    this.jsonConvert = new JsonConvert();
  }
  getVideoSizes(): Observable<any> {
    let url = `/Video/GetVideoSizes`;
    return super.getFile(url).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        return res;
      })
    );
  }
  CompressorVideo(
    uploadPartId: number,
    dbType: DBType,
    videoSize: number,
    userId: number
  ): Observable<any> {
    let url = `/Video/Compressor?uploadPartId=${uploadPartId}&dbType=${dbType}&videoSize=${videoSize}&userId=${userId}`;
    return super.getFile(url).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        return res;
      })
    );
  }

  StartUpload(dbType: number): Observable<any> {
    let url = `/custom/StartUpload?dbType=${dbType}`;
    return super.getFile(url).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        return res;
      })
    );
  }
  ChunkUpload(chunkForm: any, start: any, chunkEnd: any): Observable<any> {
    let url = '/custom/Upload';
    const body = {};
    return super.postFile(url, body).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        return res;
      })
    );
  }
  FinishUpload(
    videoId: string,
    fileName: string,
    fileSize: number,
    numberOfChunks: number,
    title: string,
    des: string,
    dbType: number,
    createdById: number
  ): Observable<any> {
    let url = `/custom/FinishUpload?videoId=${videoId}&fileName=${fileName}&fileSize=${fileSize}&numberOfChunks=${numberOfChunks}&title=${title}&des=${des}&dbType=${dbType}&createdById=${createdById}`;
    return super.getFile(url).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        return res;
      })
    );
  }
}
