import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { JsonConvert } from 'json2typescript';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { ODataResponse } from '../models/odata-response.model';
import { TopicMember } from 'src/app/core/models/database/db.model';

@Injectable({
  providedIn: 'root',
})
export class TopicMemberService extends ApiService {
  constructor(protected override http: HttpClient) {
    super(http);
    this.jsonConvert = new JsonConvert();
  }
  getAllTopicMember(): Observable<ODataResponse> {
    let url = '/TopicMembers&$orderby=Id DESC';
    return super.get(url).pipe(
      catchError((err) => throwError(() => new Error(err))),

      map((res) => {
        const odataRes: ODataResponse = this.jsonConvert.deserializeObject(
          res,
          ODataResponse
        );
        let value: Array<TopicMember> = this.jsonConvert.deserializeArray(
          odataRes.value,
          TopicMember
        );
        odataRes.value = value;

        return odataRes;
      })
    );
  }
  UpdateTopicMember(formData: any, Id: any): Observable<TopicMember> {
    let url = `/TopicMembers`;
    return super.patchEntity(url, Id, formData).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        return res;
      })
    );
  }
  getTopicMemberByIdTopic(Id: any): Observable<ODataResponse> {
    let url = `/TopicMembers?$filter=TopicId eq ${Id}`;
    return super.get(url).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        const odateRes: ODataResponse = this.jsonConvert.deserializeObject(
          res,
          ODataResponse
        );
        let value: Array<TopicMember> = this.jsonConvert.deserializeArray(
          odateRes.value,
          TopicMember
        );
        odateRes.value = value;
        return odateRes;
      })
    );
  }
  DeleteTopicMember(id: any): Observable<Object> {
    return super.deleteEntity('/TopicMembers', id).pipe(
      catchError((err) => {
        return throwError(() => err);
      })
    );
  }

  CreateTopicMember(formData: any): Observable<TopicMember> {
    let url = `/TopicMembers`;
    return super.postEntity(url, formData).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        return res;
      })
    );
  }
  getTopicMemberById(Id: any): Observable<ODataResponse> {
    let url = `/TopicMembers?$filter=Id eq ${Id}`;
    return super.get(url).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        const odateRes: ODataResponse = this.jsonConvert.deserializeObject(
          res,
          ODataResponse
        );
        let value: Array<TopicMember> = this.jsonConvert.deserializeArray(
          odateRes.value,
          TopicMember
        );
        odateRes.value = value;
        return odateRes;
      })
    );
  }
  getTopicMemberByTopicId(TopicId: any): Observable<ODataResponse> {
    let url = `/TopicMembers?$filter=TopicId eq ${TopicId}`;
    return super.get(url).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        const odateRes: ODataResponse = this.jsonConvert.deserializeObject(
          res,
          ODataResponse
        );
        let value: Array<TopicMember> = this.jsonConvert.deserializeArray(
          odateRes.value,
          TopicMember
        );
        odateRes.value = value;
        return odateRes;
      })
    );
  }
}
