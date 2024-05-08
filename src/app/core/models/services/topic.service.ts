import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { HttpClient } from '@angular/common/http';
import { JsonConvert } from 'json2typescript';
import { Observable, catchError, map, throwError } from 'rxjs';
import { ODataResponse } from '../models/odata-response.model';
import { Topic } from 'src/app/core/models/database/db.model';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class TopicService extends ApiService {
  constructor(
    protected override http: HttpClient,
    private readonly toastService: ToastrService
  ) {
    super(http);
    this.jsonConvert = new JsonConvert();
  }
  getAllTopic(): Observable<ODataResponse> {
    let url = '/topics?$expand=Category&$orderby=Id DESC';
    return super.get(url).pipe(
      catchError((err) => throwError(() => new Error(err))),

      map((res) => {
        const odataRes: ODataResponse = this.jsonConvert.deserializeObject(
          res,
          ODataResponse
        );
        let value: Array<Topic> = this.jsonConvert.deserializeArray(
          odataRes.value,
          Topic
        );
        odataRes.value = value;

        return odataRes;
      })
    );
  }
  UpdateTopic(formData: any, Id: any): Observable<Topic> {
    let url = `/topics`;
    return super.patchEntity(url, Id, formData).pipe(
      catchError((err) =>
        throwError(() => {
          new Error(err);
        })
      ),
      map((res) => {
       
        return res;
      })
    );
  }

  DeleteTopic(id: any): Observable<Object> {
    return super.deleteEntity('/topics', id).pipe(
      catchError((err) => {
        return throwError(() => err);
      }), map((res)=> {
        return res
      })
    );
  }

  CreateTopic(formData: any): Observable<Topic> {
    let url = `/topics`;
    return super.postEntity(url, formData).pipe(
      catchError((err) => throwError(() => {
       
        return new Error(err)
        
      })),
      map((res) => {
        return res;
      })
    );
  }
  getTopicById(Id: any): Observable<ODataResponse> {
    let url = `/topics?$filter=Id eq ${Id}&$expand=TopicDocuments,TopicMembers,Category&$orderby=Id DESC`;
    return super.get(url).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        const odateRes: ODataResponse = this.jsonConvert.deserializeObject(
          res,
          ODataResponse
        );
        let value: Array<Topic> = this.jsonConvert.deserializeArray(
          odateRes.value,
          Topic
        );
        odateRes.value = value;
        return odateRes;
      })
    );
  }
  getAllTopicDangky(): Observable<ODataResponse> {
    let url = '/Topics?$expand=TopicDocuments,TopicMembers,Category&$orderby=Id DESC';
    return super.get(url).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        const odataRes: ODataResponse = this.jsonConvert.deserializeObject(
          res,
          ODataResponse
        );
        let value: Array<Topic> = this.jsonConvert.deserializeArray(
          odataRes.value,
          Topic
        );
        odataRes.value = value;
        return odataRes;
      })
    );
  }
  getTopicByQuery(queryParams: string): Observable<ODataResponse> {
    let url = `/Topics?${queryParams}`;
    return super.get(url).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        const odateRes: ODataResponse = this.jsonConvert.deserializeObject(
          res,
          ODataResponse
        );
        let value: Array<Topic> = this.jsonConvert.deserializeArray(
          odateRes.value,
          Topic
        );
        odateRes.value = value;
        return odateRes;
      })
    );
  }
}
