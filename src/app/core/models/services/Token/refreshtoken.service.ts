import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {JsonConvert} from 'json2typescript';
import {catchError, map} from 'rxjs/operators';
import {Observable, throwError} from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';
import { environment } from 'src/environments/environment';

@Injectable()
export class RefreshTokenService {
  public jsonConvert: JsonConvert;
  constructor(private apiSrv: ApiService,   private http: HttpClient

    ) {
    this.jsonConvert = new JsonConvert();
  }
  // postRefreshToken(refreshtoken: any) {
  //   let datapost = "refresh_token=" + encodeURIComponent(refreshtoken) + "&grant_type=" +  encodeURIComponent('refresh_token');
  //   const options : any = {};
  //   options['headers'] = { 'Content-Type': 'application/x-www-form-urlencoded' }
  //   return this.http.post(`${environment.refresh_token}/token?key=AIzaSyBTSsXhNs8Cq1eE2cKxXNxN3-rH5e93nWY`, datapost, options);
  // }
}
