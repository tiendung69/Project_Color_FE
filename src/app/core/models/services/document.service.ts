import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { HttpClient } from '@angular/common/http';
import { JsonConvert } from 'json2typescript';
import { Observable, catchError, map, throwError } from 'rxjs';
import { ODataResponse } from '../models/odata-response.model';
import { Document } from '../models/database/db.model';

@Injectable({
  providedIn: 'root',
})
export class DocumentService extends ApiService {
  constructor(protected override http: HttpClient) {
    super(http);
    this.jsonConvert = new JsonConvert();
  }

  getAllDocument(): Observable<ODataResponse> {
    let url = '/Documents?$Orderby=Id DESC';
    return super.get(url).pipe(
      catchError((err) => throwError(() => new Error(err))),

      map((res) => {
        const odataRes: ODataResponse = this.jsonConvert.deserializeObject(
          res,
          ODataResponse
        );
        let value: Array<Document> = this.jsonConvert.deserializeArray(
          odataRes.value,
          Document
        );
        odataRes.value = value;

        return odataRes;
      })
    );
  }

  getDocumentById(Id: any): Observable<ODataResponse> {
    let url = `/Documents?$filter=Id eq ${Id}&$expand=DocTypeNavigation
&$expand=DocumentFiles
&$expand=User
`;
    return super.get(url).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        const odateRes: ODataResponse = this.jsonConvert.deserializeObject(
          res,
          ODataResponse
        );
        let value: Array<Document> = this.jsonConvert.deserializeArray(
          odateRes.value,
          Document
        );
        odateRes.value = value;
        return odateRes;
      })
    );
  }

  CreateDocument(formData: any): Observable<Document> {
    let url = `/Documents`;
    return super.postEntity(url, formData).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        return res;
      })
    );
  }

  UpdateDocument(formData: any, Id: any): Observable<Document> {
    let url = `/Documents`;
  return super.patchEntity(url, Id, formData).pipe(
    catchError((err) => throwError(() => new Error(err))),
    map((res) => {
      return res;
    })
  );
  }

  DeleteDocument(id: any): Observable<Document> {
    return super.deleteEntity('/Documents', id).pipe(
      catchError((err) => {
        return throwError(() => err);
      })
    );
  }

  getDocumentByQuery(queryParams?: string): Observable<ODataResponse> {
    let url = `/Documents?${queryParams}`;
    return super.get(url).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        const odataRes: ODataResponse = this.jsonConvert.deserializeObject(
          res,
          ODataResponse
        );
        let value: Array<Document> = this.jsonConvert.deserializeArray(
          odataRes.value,
          Document
        );
        odataRes.value = value;
        return odataRes;
      })
    );
  }
}
