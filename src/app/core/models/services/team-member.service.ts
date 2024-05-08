import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { HttpClient } from '@angular/common/http';
import { JsonConvert } from 'json2typescript';
import { Observable, catchError, map, throwError } from 'rxjs';
import { ODataResponse } from '../models/odata-response.model';
import { TeamMember } from '../models/database/db.model';

@Injectable({
  providedIn: 'root'
})
export class TeamMemberService extends ApiService{

  constructor(protected override http : HttpClient) { 
  super(http);
  this.jsonConvert = new JsonConvert()
  }
  getAllTeamMember(): Observable<ODataResponse>{
    let url = '/TeamMembers&$orderby=Id DESC';
    return super.get(url).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        const odataRes: ODataResponse = this.jsonConvert.deserializeObject(res,ODataResponse);
        let value: Array<TeamMember> = this.jsonConvert.deserializeArray(odataRes.value,TeamMember);
        odataRes.value = value;
        return odataRes;
      })
    )
  }
  UpdateTeamMember(formData: any, Id: any): Observable<ODataResponse> {
    let url = `/TeamMembers`;
    return super.patchEntity(url, Id, formData).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        return res;
      })
    );
  }
  DeleteTeamMember(id: any): Observable<Object> {
    return super.deleteEntity('/TeamMembers', id).pipe(
      catchError((err) => {
        return throwError(() => err);
      })
    );
  }

  CreateTeamMember(formData: any): Observable<TeamMember> {
    let url = `/TeamMembers`;
    return super.postEntity(url, formData).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        return res;
      })
    );
  }
  getTeamMemberById(Id: any): Observable<ODataResponse> {
    let url = `/TeamMembers?$filter=Id eq ${Id}&$orderby=Id DESC`;
    return super.get(url).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        const odateRes: ODataResponse = this.jsonConvert.deserializeObject(
          res,
          ODataResponse
        );
        let value: Array<TeamMember> = this.jsonConvert.deserializeArray(
          odateRes.value,
          TeamMember
        );
        odateRes.value = value;
        return odateRes;
      })
    );
  }
}


