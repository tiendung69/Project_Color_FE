import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { HttpClient } from '@angular/common/http';
import { JsonConvert } from 'json2typescript';
import { ODataResponse } from '../models/odata-response.model';
import { Observable, catchError, map, throwError } from 'rxjs';
import { Team } from '../models/database/db.model';

@Injectable({
  providedIn: 'root'
})
export class TeamService extends ApiService{

  constructor(protected override http : HttpClient) { 
  super(http);
  this.jsonConvert = new JsonConvert()
  }
  getAllTeam(): Observable<ODataResponse>{
    let url = '/teams?$expand=teammembers($expand=User),Leader&$orderby=Id DESC';
    return super.get(url).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        const odataRes: ODataResponse = this.jsonConvert.deserializeObject(res,ODataResponse);
        let value: Array<Team> = this.jsonConvert.deserializeArray(odataRes.value,Team);
        odataRes.value = value;
        return odataRes;
      })
    )
  }
  UpdateTeam(formData: any, Id: any): Observable<ODataResponse> {
    let url = `/teams`;
    return super.patchEntity(url, Id, formData).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        return res;
      })
    );
  }
  DeleteTeam(id: any): Observable<Object> {
    return super.deleteEntity('/teams', id).pipe(
      catchError((err) => {
        return throwError(() => err);
      })
    );
  }

  CreateTeam(formData: any): Observable<Team> {
    let url = `/teams?$expand=teammembers($expand=User),Leader`;
    return super.postEntity(url, formData).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        return res;
      })
    );
  }
  getTeamById(Id: any): Observable<ODataResponse> {
    let url = `/teams?$filter=Id eq ${Id}&$expand=teammembers($expand=User),Leader`;
    return super.get(url).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        const odateRes: ODataResponse = this.jsonConvert.deserializeObject(
          res,
          ODataResponse
        );
        let value: Array<Team> = this.jsonConvert.deserializeArray(
          odateRes.value,
          Team
        );
        odateRes.value = value;
        return odateRes;
      })
    );
  }
}


