import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { HttpClient } from '@angular/common/http';
import { JsonConvert } from 'json2typescript';
import { Observable, catchError, map, throwError } from 'rxjs';
import { ODataResponse } from '../models/odata-response.model';
import { DocumentFile } from '../models/database/db.model';

@Injectable({
  providedIn: 'root',
})
export class DocumentFileService extends ApiService {
  constructor(protected override http: HttpClient) {
    super(http);
    this.jsonConvert = new JsonConvert();
  }

  getAllDocumentFile(): Observable<ODataResponse> {
    let url = '/DocumentFiles?$Orderby=Id DESC';
    return super.get(url).pipe(
      catchError((err) => throwError(() => new Error(err))),

      map((res) => {
        const odataRes: ODataResponse = this.jsonConvert.deserializeObject(
          res,
          ODataResponse
        );
        let value: Array<DocumentFile> = this.jsonConvert.deserializeArray(
          odataRes.value,
          DocumentFile
        );
        odataRes.value = value;

        return odataRes;
      })
    );
  }

  getDocumentFileById(Id: any): Observable<ODataResponse> {
    let url = `/DocumentFiles?$filter=Id eq ${Id}&$expand=Document
&$expand=UploadPart
`;
    return super.get(url).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        const odateRes: ODataResponse = this.jsonConvert.deserializeObject(
          res,
          ODataResponse
        );
        let value: Array<DocumentFile> = this.jsonConvert.deserializeArray(
          odateRes.value,
          DocumentFile
        );
        odateRes.value = value;
        return odateRes;
      })
    );
  }

  CreateDocumentFile(formData: any): Observable<DocumentFile> {
    let url = `/DocumentFiles`;
    return super.postEntity(url, formData).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        return res;
      })
    );
  }

  UpdateDocumentFile(formData: any, Id: any): Observable<DocumentFile> {
    let url = `/DocumentFiles`;
  return super.patchEntity(url, Id, formData).pipe(
    catchError((err) => throwError(() => new Error(err))),
    map((res) => {
      return res;
    })
  );
  }

  DeleteDocumentFile(id: any): Observable<DocumentFile> {
    return super.deleteEntity('/DocumentFiles', id).pipe(
      catchError((err) => {
        return throwError(() => err);
      })
    );
  }

  getDocumentFileByQuery(queryParams?: string): Observable<ODataResponse> {
    let url = `/DocumentFiles?${queryParams}`;
    return super.get(url).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        const odataRes: ODataResponse = this.jsonConvert.deserializeObject(
          res,
          ODataResponse
        );
        let value: Array<DocumentFile> = this.jsonConvert.deserializeArray(
          odataRes.value,
          DocumentFile
        );
        odataRes.value = value;
        return odataRes;
      })
    );
  }
}
