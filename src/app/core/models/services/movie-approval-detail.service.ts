import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { HttpClient } from '@angular/common/http';
import { JsonConvert } from 'json2typescript';
import { ODataResponse } from '../models/odata-response.model';
import { Observable, catchError, map, throwError } from 'rxjs';
import { MovieapprovalDetail } from '../models/database/db.model';

@Injectable({
  providedIn: 'root'
})
export class MovieApprovalDetailService extends ApiService{

  constructor(protected override http : HttpClient) {
    super(http);
    const jsonConvert = new JsonConvert()
   }
   getAllMovieApprovalDetailById(Id: any): Observable<ODataResponse> {
    let url = `/MovieapprovalDetails?$filter=MovieApprovalId eq ${Id} &$expand=MovieApproval,User&$orderby=Id DESC`;
    return super.get(url).pipe(
      catchError((err) => throwError(() => new Error(err))),

      map((res) => {
        const odataRes: ODataResponse = this.jsonConvert.deserializeObject(
          res,
          ODataResponse
        );
        let value: Array<MovieapprovalDetail> = this.jsonConvert.deserializeArray(
          odataRes.value,
          MovieapprovalDetail);
        odataRes.value = value;
        return odataRes;
      })
    );
  }
  getAllMovieApprovalDetail(): Observable<ODataResponse> {
    let url = `/MovieapprovalDetails?$expand=MovieApproval,User&$orderby=Id DESC`;
    return super.get(url).pipe(
      catchError((err) => throwError(() => new Error(err))),

      map((res) => {
        const odataRes: ODataResponse = this.jsonConvert.deserializeObject(
          res,
          ODataResponse
        );
        let value: Array<MovieapprovalDetail> = this.jsonConvert.deserializeArray(
          odataRes.value,
          MovieapprovalDetail);
        odataRes.value = value;
        return odataRes;
      })
    );
  }
  getAllMovieApprovalDetailById2(Id : any): Observable<ODataResponse> {
    let url = `/MovieapprovalDetails?$filter=Id eq ${Id}expand=MovieApproval,User&$orderby=Id DESC`;
    return super.get(url).pipe(
      catchError((err) => throwError(() => new Error(err))),

      map((res) => {
        const odataRes: ODataResponse = this.jsonConvert.deserializeObject(
          res,
          ODataResponse
        );
        let value: Array<MovieapprovalDetail> = this.jsonConvert.deserializeArray(
          odataRes.value,
          MovieapprovalDetail);
        odataRes.value = value;
        return odataRes;
      })
    );
  }
  // getAllMovieApprovalDetailByMovieApproval(Id: any): Observable<ODataResponse> {
  //   let url = `/MovieapprovalDetails?$filter=MovieApprovalId eq ${Id} &$expand=MovieApproval, User&$orderby=Id DESC`;
  //   return super.get(url).pipe(
  //     catchError((err) => throwError(() => new Error(err))),

  //     map((res) => {
  //       const odataRes: ODataResponse = this.jsonConvert.deserializeObject(
  //         res,
  //         ODataResponse
  //       );
  //       let value: Array<MovieapprovalDetail> = this.jsonConvert.deserializeArray(
  //         odataRes.value,
  //         MovieapprovalDetail);
  //       odataRes.value = value;
  //       return odataRes;
  //     })
  //   );
  // }
  getAllMovieApprovalDetailByIdUser(Id: any): Observable<ODataResponse> {
    let url = `/MovieapprovalDetails?$filter=UserId eq ${Id} &$expand=MovieApproval,User&$orderby=Id DESC`;
    return super.get(url).pipe(
      catchError((err) => throwError(() => new Error(err))),

      map((res) => {
        const odataRes: ODataResponse = this.jsonConvert.deserializeObject(
          res,
          ODataResponse
        );
        let value: Array<MovieapprovalDetail> = this.jsonConvert.deserializeArray(
          odataRes.value,
          MovieapprovalDetail);
        odataRes.value = value;
        return odataRes;
      })
    );
  }
  CreateMovieApprovalDetail(formData: any): Observable<MovieapprovalDetail> {
    let url = `/MovieapprovalDetails`;
    return super.postEntity(url, formData).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        return res;
      })
    );
  }
  UpdateMovieApprovalDetail(formData: any, Id: any): Observable<MovieapprovalDetail> {
    let url = `/MovieapprovalDetails`;
  return super.patchEntity(url, Id, formData).pipe(
    catchError((err) => throwError(() => new Error(err))),
    map((res) => {
      return res;
    })
  );
  }
  DeleteMovieApprovalDetail(id: any): Observable<Object> {
    return super.deleteEntity('/MovieapprovalDetails', id).pipe(
      catchError((err) => {
        return throwError(() => err);
      })
    );
  }
}
