import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs';
interface dataTest {
  fact: string;
  length: number;
}
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit{
  public onGetData : dataTest ={fact : '' ,length:0};
  constructor(private httpClient:HttpClient) { }
  ngOnInit(): void {
    this.loadData();
  }
  getAll():Observable<dataTest>{
    return this.httpClient.get<dataTest>('https://catfact.ninja/fact').pipe(
    )
  }
  loadData(){
    this.getAll().subscribe((data) =>{
      console.log(data);
      this.calculate(data)
      this.onGetData = data;
    })
  }
  calculate(args : any){
    if(args.length > 0){
      args.length = args.length * 11
    }
  }
}
