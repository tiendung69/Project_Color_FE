import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class ReportRepacityService {

  constructor(private httpClient:HttpClient) { }
  getAll(startDate: any, endDate : any ):Observable<any>{
    return this.httpClient.get<any>(environment.apiUrl + '/Report/General?fromdate='+startDate+'&todate='+endDate+'').pipe(
    )
  }
}
