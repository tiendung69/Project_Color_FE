import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { HttpClient } from '@angular/common/http';
import { JsonConvert } from 'json2typescript';
import { Observable, catchError, map, throwError } from 'rxjs';
import { ODataResponse } from '../models/odata-response.model';
import { Movieapproval } from '../models/database/db.model';

@Injectable({
  providedIn: 'root'
})
export class MovieApprovalService extends ApiService {

  constructor(protected override http : HttpClient) {
    super(http);
    const jsonConvert = new JsonConvert();
   }
   getApproval(): Observable<ODataResponse> {
    let url = '/Movieapprovals?$expand=PostProductionPlaning($expand=PreProduction)&$orderby=Id DESC';
    return super.get(url).pipe(
      catchError((err) => throwError(() => new Error(err))),

      map((res) => {
        const odataRes: ODataResponse = this.jsonConvert.deserializeObject(
          res,
          ODataResponse
        );
        let value: Array<Movieapproval> = this.jsonConvert.deserializeArray(
          odataRes.value,
          Movieapproval
        );
        odataRes.value = value;

        return odataRes;
      })
    );
  }
  getMovieApprovalbyId(Id: any): Observable<ODataResponse> {
    let url = `/Movieapprovals?$filter=Id eq ${Id}&$expand=MovieapprovalDetails,PostProductionPlaning($expand=PreProduction)&$orderby=Id DESC`;
    return super.get(url).pipe(
      catchError((err) => throwError(() => new Error(err))),

      map((res) => {
        const odataRes: ODataResponse = this.jsonConvert.deserializeObject(
          res,
          ODataResponse
        );
        let value: Array<Movieapproval> = this.jsonConvert.deserializeArray(
          odataRes.value,
          Movieapproval);
        odataRes.value = value;
        return odataRes;
      })
    );
  }
  getMovieApprovalbyIdAndMember(IdUser: any, Id : any): Observable<ODataResponse> {
    let url = `/Movieapprovals?$filter=Id eq ${Id}&$expand=MovieapprovalDetails($filter=UserId eq ${IdUser}),PostProductionPlaning($expand=PreProduction)&$orderby=Id DESC
    `;
    return super.get(url).pipe(
      catchError((err) => throwError(() => new Error(err))),

      map((res) => {
        const odataRes: ODataResponse = this.jsonConvert.deserializeObject(
          res,
          ODataResponse
        );
        let value: Array<Movieapproval> = this.jsonConvert.deserializeArray(
          odataRes.value,
          Movieapproval);
        odataRes.value = value;
        return odataRes;
      })
    );
  }
  getMovieApprovalbyMember(Id: any): Observable<ODataResponse> {
    let url = `/Movieapprovals?$expand=MovieapprovalDetails($filter=UserId eq ${Id}),PostProductionPlaning($expand=PreProduction)&$filter=MovieapprovalDetails/any(d:d/UserId eq ${Id})&$orderby=Id DESC`;
    return super.get(url).pipe(
      catchError((err) => throwError(() => new Error(err))),

      map((res) => {
        const odataRes: ODataResponse = this.jsonConvert.deserializeObject(
          res,
          ODataResponse
        );
        let value: Array<Movieapproval> = this.jsonConvert.deserializeArray(
          odataRes.value,
          Movieapproval);
        odataRes.value = value;
        return odataRes;
      })
    );
  }

  getMovieApprovalbyIdMovieapprovalDetails(Id: any): Observable<ODataResponse> {
    let url = `/MovieapprovalDetails?$filter=MovieApprovalId eq ${Id}&$expand=Movieapproval&$orderby=Id DESC`;
    return super.get(url).pipe(
      catchError((err) => throwError(() => new Error(err))),

      map((res) => {
        const odataRes: ODataResponse = this.jsonConvert.deserializeObject(
          res,
          ODataResponse
        );
        let value: Array<Movieapproval> = this.jsonConvert.deserializeArray(
          odataRes.value,
          Movieapproval);
        odataRes.value = value;
        return odataRes;
      })
    );
  }
  CreateMovieApproval(formData: any): Observable<Movieapproval> {
    let url = `/Movieapprovals`;
    return super.postEntity(url, formData).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        return res;
      })
    );
  }
  UpdateMovieApproval(formData: any, Id: any): Observable<Movieapproval> {
    let url = `/Movieapprovals`;
    return super.patchEntity(url, Id, formData).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        return res;
      })
    );
  } 
  getMovieApprovalbyIdUser(Id: any): Observable<ODataResponse> {
    let url = `/Movieapprovals?
    $expand=MovieapprovalDetails,PostProductionPlaning($expand=PreProduction)&$filter=PostProductionPlaning/PreProduction/CreatedBy eq  ${Id}&$orderby=Id desc`;
    return super.get(url).pipe(
      catchError((err) => {
        return throwError(new Error(err));
      }),
  
      map((res) => {
        const odataRes: ODataResponse = this.jsonConvert.deserializeObject(
          res,
          ODataResponse
        );
        let value: Array<Movieapproval> = this.jsonConvert.deserializeArray(
          odataRes.value,
          Movieapproval
        );
        odataRes.value = value;
        return odataRes;
      })
    );
  }
  DeleteMovieApproved(id: any): Observable<Object> {
    return super.deleteEntity('/Movieapprovals', id).pipe(
      catchError((err) => {
        return throwError(() => err);
      })
    );
  }
}

