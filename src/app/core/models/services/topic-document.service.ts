import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { HttpClient } from '@angular/common/http';
import { JsonConvert } from 'json2typescript';
import { ODataResponse } from '../models/odata-response.model';
import { Observable, catchError, map, throwError } from 'rxjs';
import { TopicDocument } from 'src/app/core/models/database/db.model';

@Injectable({
  providedIn: 'root',
})
export class TopicDocumentService extends ApiService {
  constructor(protected override http: HttpClient) {
    super(http);
    this.jsonConvert = new JsonConvert();
  }
  getAllTopicDocument(): Observable<ODataResponse> {
    let url = '/TopicDocuments';
    return super.get(url).pipe(
      catchError((err) => throwError(() => new Error(err))),

      map((res) => {
        const odataRes: ODataResponse = this.jsonConvert.deserializeObject(
          res,
          ODataResponse
        );
        let value: Array<TopicDocument> = this.jsonConvert.deserializeArray(
          odataRes.value,
          TopicDocument
        );
        odataRes.value = value;

        return odataRes;
      })
    );
  }
  UpdateTopicDocument(formData: any, Id: any): Observable<ODataResponse> {
    let url = `/TopicDocuments`;
    return super.patchEntity(url, Id, formData).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        return res;
      })
    );
  }
  DeleteTopicDocument(id: any): Observable<Object> {
    return super.deleteEntity('/TopicDocuments', id).pipe(
      catchError((err) => {
        return throwError(() => err);
      })
    );
  }

  CreateTopicDocument(formData: any): Observable<TopicDocument> {
    let url = `/TopicDocuments`;
    return super.postEntity(url, formData).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        return res;
      })
    );
  }
  getTopicDocumentById(Id: any): Observable<ODataResponse> {
    let url = `/TopicDocuments?$filter=Id eq ${Id}`;
    return super.get(url).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        const odateRes: ODataResponse = this.jsonConvert.deserializeObject(
          res,
          ODataResponse
        );
        let value: Array<TopicDocument> = this.jsonConvert.deserializeArray(
          odateRes.value,
          TopicDocument
        );
        odateRes.value = value;
        return odateRes;
      })
    );
  }

  getTopicDocumentByIdTopic(Id: any): Observable<ODataResponse> {
    let url = `/TopicDocuments?$filter=TopicId eq ${Id}`;
    return super.get(url).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        const odateRes: ODataResponse = this.jsonConvert.deserializeObject(
          res,
          ODataResponse
        );
        let value: Array<TopicDocument> = this.jsonConvert.deserializeArray(
          odateRes.value,
          TopicDocument
        );
        odateRes.value = value;
        return odateRes;
      })
    );
  }

  getTopicDocumentByQuery(queryParams: string): Observable<ODataResponse> {
    let url = `/TopicDocuments?${queryParams}`;
    return super.get(url).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        const odateRes: ODataResponse = this.jsonConvert.deserializeObject(
          res,
          ODataResponse
        );
        let value: Array<TopicDocument> = this.jsonConvert.deserializeArray(
          odateRes.value,
          TopicDocument
        );
        odateRes.value = value;
        return odateRes;
      })
    );
  }
}
