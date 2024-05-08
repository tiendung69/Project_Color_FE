import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import {
  EditSettingsModel,
  FilterSettingsModel,
  GridComponent,
  PageSettingsModel,
  SaveEventArgs,
  ToolbarItems,
  autoCol,
} from '@syncfusion/ej2-angular-grids';
import { finalize } from 'rxjs';
import { Commoncategory } from 'src/app/core/models/database/db.model';
import { CommoncategoryService } from 'src/app/core/services/commoncategory.service';
import { CommonCategoriesType, RequestTypeAction } from 'src/app/core/utils/constant';

@Component({
  selector: 'app-topic',
   templateUrl: './topic.component.html',
   styleUrls:['./topic.component.scss']

})
export class TopicComponent {
  listCate: Array<any> = [];

  public editSettings?: EditSettingsModel;
  public pageSettings?: PageSettingsModel;
  public filterOptions : FilterSettingsModel ={

    ignoreAccent: false,
    showFilterBarStatus: false,
  }
  public toolbarOptions: ToolbarItems[] = [
    'Add',
    'Edit',
    'Delete',

  ];
  public NameValidationRules: Object;
  public TypeValidationRules: Object;
  public DescriptionValidationRules: Object;
  public ParentIdValidationRules: Object;
  @ViewChild('grid', { static: false }) public grid: GridComponent;
  public dropdownFields = { text: 'Name', value: 'Id' };
  constructor(private service: CommoncategoryService,
    public changeDetectorRef : ChangeDetectorRef
    ) {}
  name: any;
  description: any;
  data: any = [];
  public cateDetail : Commoncategory;
  parentIdList: Array<any> = [];
  listType: Array<any> = [];
  selectedParentId: number;
  listName: Array<any> = [];
  AllList: Array<any> = [];
  ngOnInit(): void {
    this.cateDetail = new Commoncategory();
    this.loadCate();
    this.pageSettings= {pageSize:10};
    this.editSettings = {
      allowEditing: true,
      allowAdding: true,
      allowDeleting: true,
      mode: 'Dialog',
    };
    this.NameValidationRules = { required: [true, 'Vui lòng nhập loại Đề Tài.' ]};
    this.TypeValidationRules = { number: true };
    this.DescriptionValidationRules = {};
    this.ParentIdValidationRules = { number: true };
    this.loadCate();
    this.cateDetail = new Commoncategory();
  }
  changeStatus(event: any){
    this.name = event.value;
    this.cateDetail.Name = event.value;

  }
  changeStatus2(event: any){
    this.description = event.value;
    this.cateDetail.Description= event.value;
  }
  getNameByParentId(parentId: number): string {
    const topic: any = this.parentIdList.find((item) => item.Id === parentId);
    return topic ? topic.Name : '';
  }
  onchange(event: any) {
    this.selectedParentId = event.value;
    this.cateDetail.ParentId = event.value;
  }
  onChange1(args: any): void{
    this.grid.filterByColumn('Name','contains',args.value);
  }
  onChange2(args: any): void{
    this.grid.filterByColumn('Description','contains',args.value);
  }

  actionComplete(args: any) {

    if (((args as any).requestType === 'beginEdit' || (args as any).requestType === 'add')) {
        const dialog = (args as any).dialog;
        dialog.showCloseIcon = false;
        dialog.height = 300;
        dialog.width=500;
        dialog.header = (args as any).requestType === 'beginEdit' ? 'Chỉnh sửa '  : 'Thêm Chủ Đề Mới';
    }
}
  loadCate() {
    this.service.getCateById(6,7).subscribe((data: any) => {
      this.AllList = data.value;

      this.listCate = data.value.filter(
        (item: any) =>
          item.Type === 7 &&
          this.AllList.some((allItem) => item.ParentId == allItem.Id)
      );

      this.parentIdList = data.value
        .filter((item: any) => item.Type === 6)
          .map((item: any) => ({
            Id: item.Id,
            Name: item.Name,
          }));
    });
  }

  actionBegin(args: SaveEventArgs) {
    if (args.action === RequestTypeAction.ADD) {
    this.cateDetail.Type = CommonCategoriesType.TOPIC;
      this.service.CreateCommoncategory(this.cateDetail).subscribe(() => {
        this.cateDetail = new Commoncategory();
        this.loadCate();
        this.changeDetectorRef.markForCheck();
        this.cateDetail = new Commoncategory();
      });
    }
    if (args.action === RequestTypeAction.BEGINEDIT) {
      this.cateDetail = args.data as Commoncategory;
    }

    if(args.action === RequestTypeAction.EDIT){
      this.service.UpdateCommonCategory(this.cateDetail, (args.data as any).Id).subscribe(() =>{
        this.cateDetail = new Commoncategory();
        this.loadCate();
        this.changeDetectorRef.markForCheck();
      })
    }
    if (args.requestType === 'delete') {
      const x = (args.data as any)[0].Id;
      this.service.DeleteCommonCategory(x).subscribe(() => {});
    }
  }
}
