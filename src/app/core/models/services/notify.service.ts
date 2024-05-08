import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { HttpClient } from '@angular/common/http';
import { JsonConvert } from 'json2typescript';
import { Observable, catchError, map, throwError } from 'rxjs';
import { ODataResponse } from '../models/odata-response.model';
import { Notify } from '../models/database/db.model';
import {
  NotifyActionType,
  NotifyObjectType,
  NotifyStatus,
} from '../utils/constant';
import { UserLogged } from '../utils/userLogged';

@Injectable({
  providedIn: 'root',
})
export class NotifyService extends ApiService {
  private userLogged = new UserLogged();
  constructor(protected override http: HttpClient) {
    super(http);
    this.jsonConvert = new JsonConvert();
  }

  getAllNotify(): Observable<ODataResponse> {
    let url = '/Notifies?$Orderby=Id DESC';
    return super.get(url).pipe(
      catchError((err) => throwError(() => new Error(err))),

      map((res) => {
        const odataRes: ODataResponse = this.jsonConvert.deserializeObject(
          res,
          ODataResponse
        );
        let value: Array<Notify> = this.jsonConvert.deserializeArray(
          odataRes.value,
          Notify
        );
        odataRes.value = value;

        return odataRes;
      })
    );
  }

  getNotifyById(Id: any): Observable<ODataResponse> {
    let url = `/Notifies?$filter=Id eq ${Id}&$expand=Sender
&$expand=User
`;
    return super.get(url).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        const odateRes: ODataResponse = this.jsonConvert.deserializeObject(
          res,
          ODataResponse
        );
        let value: Array<Notify> = this.jsonConvert.deserializeArray(
          odateRes.value,
          Notify
        );
        odateRes.value = value;
        return odateRes;
      })
    );
  }

  CreateNotify(
    userId: number,
    actionType: NotifyActionType,
    objectType: NotifyObjectType,
    objectId: number,
    title: string,
    detail: string,
    senderId: number = parseInt(this.userLogged.getCurrentUser().userId),
    createdAt: Date = new Date(),
    status: NotifyStatus = NotifyStatus.NEW
  ): Observable<Notify> {
    const formData = new Notify();
    formData.ActionType = actionType;
    formData.CreatedAt = createdAt;
    formData.Detail = detail;
    formData.ObjectId = objectId;
    formData.ObjectType = objectType;
    formData.SenderId = senderId;
    formData.Status = status;
    formData.Title = title;
    formData.UserId = userId;

    let url = `/Notifies`;
    return super.postEntity(url, formData).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        return res;
      })
    );
  }

  UpdateNotify(formData: any, Id: any): Observable<Notify> {
    let url = `/Notifies`;
    return super.patchEntity(url, Id, formData).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        return res;
      })
    );
  }

  DeleteNotify(id: any): Observable<Notify> {
    return super.deleteEntity('/Notifies', id).pipe(
      catchError((err) => {
        return throwError(() => err);
      })
    );
  }

  getNotifyByQuery(queryParams?: string): Observable<ODataResponse> {
    let url = `/Notifies?${queryParams}`;
    return super.get(url).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        const odataRes: ODataResponse = this.jsonConvert.deserializeObject(
          res,
          ODataResponse
        );
        let value: Array<Notify> = this.jsonConvert.deserializeArray(
          odataRes.value,
          Notify
        );
        odataRes.value = value;
        return odataRes;
      })
    );
  }
}
