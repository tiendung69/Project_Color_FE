import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { HttpClient } from '@angular/common/http';
import { JsonConvert } from 'json2typescript';
import { Observable, catchError, map, throwError } from 'rxjs';
import { ODataResponse } from '../models/odata-response.model';
import { Broadcastingdocument } from '../models/database/db.model';

@Injectable({
  providedIn: 'root'
})
export class BroadCastingDocumentService extends ApiService{

  constructor(protected override http : HttpClient) { 
    super(http);
    const jsonConvert = new JsonConvert();
  }
  getAllBoardDocumentByIdBroadCasting(Id : any): Observable<ODataResponse> {
    let url = `/Broadcastingdocuments?$filter=BroadcastingId eq ${Id}&$Expand=UploadPart&$orderby=Id DESC`;
    return super.get(url).pipe(
      catchError((err) => throwError(() => new Error(err))),

      map((res) => {
        const odataRes: ODataResponse = this.jsonConvert.deserializeObject(
          res,
          ODataResponse
        );
        let value: Array<Broadcastingdocument> = this.jsonConvert.deserializeArray(
          odataRes.value,
          Broadcastingdocument
        );
        odataRes.value = value;

        return odataRes;
      })
    );
  }
  UpdateTopicDocument(formData: any, Id: any): Observable<ODataResponse> {
    let url = `/Broadcastingdocuments`;
    return super.patchEntity(url, Id, formData).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        return res;
      })
    );
  }
  DeleteTopicDocument(id: any): Observable<Object> {
    return super.deleteEntity('/Broadcastingdocuments', id).pipe(
      catchError((err) => {
        return throwError(() => err);
      })
    );
  }

  CreateTopicDocument(formData: any): Observable<Broadcastingdocument> {
    let url = `/Broadcastingdocuments`;
    return super.postEntity(url, formData).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        return res;
      })
    );
  }
}
