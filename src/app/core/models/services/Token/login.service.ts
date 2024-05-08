import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { HttpClient } from '@angular/common/http';
import { JsonConvert } from 'json2typescript';
import { Observable, catchError, map, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService extends ApiService {

  constructor(protected override http: HttpClient) {
    super(http);
    const jsonConvert = new JsonConvert();
   }
Login(formData: any): Observable<any> {
  let url = `/Authentication/Login`;
  return super.postEntity(url, formData).pipe(
    catchError((err) => throwError(() => new Error(err))),
    map((res) => {
      if (res === undefined) {
        throw new Error('Invalid response from server');
      }
      return res;
    })
  );
}

}
