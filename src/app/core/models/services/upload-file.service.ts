import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { HttpClient } from '@angular/common/http';
import { JsonConvert } from 'json2typescript';
import { ODataResponse } from '../models/odata-response.model';
import { Observable, catchError, map, throwError } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class UploadFileService extends ApiService {
  constructor(protected override http: HttpClient) {
    super(http);
    this.jsonConvert = new JsonConvert();
  }

  upLoadFile(formData: any): Observable<any> {
    let url = `/custom/Upload`;
    return super.postFile(url, formData).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        return res;
      })
    );
  }
}
