import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { HttpClient } from '@angular/common/http';
import { JsonConvert } from 'json2typescript';
import { ODataResponse } from '../models/odata-response.model';
import { Observable, catchError, map, throwError } from 'rxjs';
import { User, UserRole } from '../models/database/db.model';

@Injectable({
  providedIn: 'root',
})
export class UserService extends ApiService {
  constructor(protected override http: HttpClient) {
    super(http);
    this.jsonConvert = new JsonConvert();
  }

  getAllUser(): Observable<ODataResponse> {
    let url = '/Users';
    return super.get(url).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        const odataRes: ODataResponse = this.jsonConvert.deserializeObject(
          res,
          ODataResponse
        );
        let value: Array<User> = this.jsonConvert.deserializeArray(
          odataRes.value,
          User
        );
        odataRes.value = value;
        return odataRes;
      })
    );
  }
  getAllUserCheckStatus(): Observable<ODataResponse> {
    let url = '/Users?$filter=Status eq 1';
    return super.get(url).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        const odataRes: ODataResponse = this.jsonConvert.deserializeObject(
          res,
          ODataResponse
        );
        let value: Array<User> = this.jsonConvert.deserializeArray(
          odataRes.value,
          User
        );
        odataRes.value = value;
        return odataRes;
      })
    );
  }
  // getAllUserbyEmail(): Observable<ODataResponse> {
  //   let url = '/Users';
  //   return super.get(url).pipe(
  //     catchError((err) => throwError(() => new Error(err))),
  //     map((res) => {
  //       const odataRes: ODataResponse = this.jsonConvert.deserializeObject(
  //         res,
  //         ODataResponse
  //       );
  //       let value: Array<User> = this.jsonConvert.deserializeArray(
  //         odataRes.value,
  //         User
  //       );
  //       odataRes.value = value;
  //       return odataRes;
  //     })
  //   );
  // }
  UpdateUser(formData: any, Id: any): Observable<User> {
    let url = `/Users`;
    return super.patchEntity(url, Id, formData).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        return res;
      })
    );
  }
  UpdateUser2(formData: any, Id: any): Observable<User> {
    let url = `/Users?$expand=UserRoles,Depart`;
    return super.patchEntity(url, Id, formData).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        return res;
      })
    );
  }
  DeleteUser(id: any): Observable<Object> {
    return super.deleteEntity('/Users', id).pipe(
      catchError((err) => {
        return throwError(() => err);
      })
    );
  }

  CreateUser(formData: any): Observable<User> {
    let url = `/Users?$expand=UserRoles,Depart`;
    return super.postEntity(url, formData).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        return res;
      })
    );
  }
  getUserById(Id: any): Observable<ODataResponse> {
    let url = `/Users?$filter=Id eq ${Id}&$expand=Depart,UserRoles,Teammembers($expand=Team)&$orderby=Id DESC`;
    return super.get(url).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        const odateRes: ODataResponse = this.jsonConvert.deserializeObject(
          res,
          ODataResponse
        );
        let value: Array<User> = this.jsonConvert.deserializeArray(
          odateRes.value,
          User
        );
        odateRes.value = value;
        return odateRes;
      })
    );
  }

  getUserByIds(Id: any): Observable<ODataResponse> {
    let url = `/Users?$filter=Id eq ${Id}`;
    return super.get(url).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        const odateRes: ODataResponse = this.jsonConvert.deserializeObject(
          res,
          ODataResponse
        );
        let value: Array<User> = this.jsonConvert.deserializeArray(
          odateRes.value,
          User
        );
        odateRes.value = value;
        return odateRes;
      })
    );
  }


  getAllUserRole(): Observable<ODataResponse> {
    let url = '/Users?$expand=UserRoles';
    return super.get(url).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        const odataRes: ODataResponse = this.jsonConvert.deserializeObject(
          res,
          ODataResponse
        );
        let value: Array<User> = this.jsonConvert.deserializeArray(
          odataRes.value,
          User
        );
        odataRes.value = value;
        return odataRes;
      })
    );
  }
  getAllUserDepart(): Observable<ODataResponse> {
    let url = '/users?$expand=UserRoles($Expand=Role($Select=Name)),Depart($Select=Name),Teammembers';
    return super.get(url).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        const odataRes: ODataResponse = this.jsonConvert.deserializeObject(
          res,
          ODataResponse
        );
        let value: Array<User> = this.jsonConvert.deserializeArray(
          odataRes.value,
          User
        );
        odataRes.value = value;
        return odataRes;
      })
    );
  }
  getListUserByQuery(queryParams: string): Observable<ODataResponse> {
    let url = `/Users?${queryParams}`;
    return super.get(url).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        const odataRes: ODataResponse = this.jsonConvert.deserializeObject(
          res,
          ODataResponse
        );
        let value: Array<User> = this.jsonConvert.deserializeArray(
          odataRes.value,
          User
        );
        odataRes.value = value;
        return odataRes;
      })
    );
  }
  getListUserByQueryId(queryParams: string,Id : any): Observable<ODataResponse> {
    let url = `/Users?$filter=Id eq ${Id}&${queryParams}`;
    return super.get(url).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        const odataRes: ODataResponse = this.jsonConvert.deserializeObject(
          res,
          ODataResponse
        );
        let value: Array<User> = this.jsonConvert.deserializeArray(
          odataRes.value,
          User
        );
        odataRes.value = value;
        return odataRes;
      })
    );
  }
  UpdateUserRole(formData: any, Id: any): Observable<UserRole> {
    let url = `/UserRoles`;
    return super.patchEntity(url, Id, formData).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        return res;
      })
    );
  }
  CreateUser2(formData: any): Observable<ODataResponse> {
    let url = `/UserRoles`;
    return super.postEntity(url, formData).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        return res;
      })
    );
  }

  getUserIdByRole(Id: any): Observable<ODataResponse> {
    let url = `/UserRoles?$filter=userid eq ${Id}`;
    return super.get(url).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        const odateRes: ODataResponse = this.jsonConvert.deserializeObject(
          res,
          ODataResponse
        );
        let value: Array<User> = this.jsonConvert.deserializeArray(
          odateRes.value,
          User
        );
        odateRes.value = value;
        return odateRes;
      })
    );
  }
  CreateUserRole(formData: any): Observable<ODataResponse> {
    let url = `/UserRoles`;
    return super.postEntity(url, formData).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        return res;
      })
    );
  }

  DeleteUserRole(id: any): Observable<Object> {
    return super.deleteEntity('/UserRoles', id).pipe(
      catchError((err) => {
        return throwError(() => err);
      })
    );
  }
 
  
}
