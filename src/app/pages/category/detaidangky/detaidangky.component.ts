import { Component, OnInit } from '@angular/core';
import { CommoncategoryService } from 'src/app/core/services/commoncategory.service';

@Component({
  selector: 'app-detaidangky',
  templateUrl: './detaidangky.component.html',
  styleUrls: ['./detaidangky.component.scss'],
})
export class DetaidangkyComponent implements OnInit {
  ngOnInit(): void {}
  constructor(public service: CommoncategoryService) {}
  listInfor: Array<any> = [];
  loadList() {}
}
