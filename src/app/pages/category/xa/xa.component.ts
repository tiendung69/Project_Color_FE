import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { CommoncategoryService } from 'src/app/core/services/commoncategory.service';
import {
  EditSettingsModel,
  GridComponent,
  ToolbarItems,
  SaveEventArgs,
  PageSettingsModel,
  autoCol,
  TextWrapSettingsModel,
} from '@syncfusion/ej2-angular-grids';
import { finalize } from 'rxjs';
import { Commoncategory } from 'src/app/core/models/database/db.model';
import { CommonCategoriesType, RequestTypeAction } from 'src/app/core/utils/constant';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-xa',
  templateUrl: './xa.component.html',
  styleUrls:['./xa.component.scss']

})
export class XaComponent implements OnInit {
  listCate: Array<any> = [];
  cateDetail: Commoncategory;
  public editSettings?: EditSettingsModel;
  public pageSettings?: PageSettingsModel;
  public toolbarOptions: ToolbarItems[] = [
    'Add',
    'Edit',
    'Delete',
  ];
  public NameValidationRules: Object;
  public TypeValidationRules: Object;
  public DescriptionValidationRules: Object;
  public ParentIdValidationRules: Object;
  fields : Object = {text: 'Name', value: 'Id'}
  public dropdownFields = { text: 'Name', value: 'Id' };
  constructor(private service: CommoncategoryService,
    public changeDetectorRef : ChangeDetectorRef,
    public toastService : ToastrService,
    ) {}
  name: any;
  description: any;
  data: any = [];
  parentIdList: Array<any> = [];
  listType: Array<any> = [];
  selectedParentId: number;
  listName: Array<any> = [];
  AllList: Array<any> = [];
  @ViewChild('grid', { static: false }) public grid: GridComponent;
  ngOnInit(): void {
    this.loadCate();
   this.cateDetail = new Commoncategory();
  this.pageSettings = {pageSize: 10};
    this.editSettings = {
      allowEditing: true,
      allowAdding: true,
      allowDeleting: true,
      mode: 'Dialog',
    };
    this.NameValidationRules= {required : [true, "Vui lòng nhập tên Xã/Phường."]}
    this.loadCate();
  }
  changeStatus(event: any){
    this.name = event.value;
    this.cateDetail.Name = this.name;
  }
  onChange3(args: any): void{
    this.grid.filterByColumn('ParentId','contains',args.value);
  }
  changeStatus2(event: any){
    this.description = event.value;
    this.cateDetail.Description = this.description;
  }

  loadCate() {
    this.service.getCateById(3,2).subscribe((data: any) => {
      this.AllList = data.value;

      this.listCate = data.value.filter(
        (item: any) =>
          item.Type === 3 &&
          this.AllList.some((allItem) => item.ParentId == allItem.Id)
      );

      this.parentIdList = data.value
        .filter((item: any) => item.Type === 2 && item.Name !=null && item.ParentId != null )
        .map((item: any) => ({
          Id: item.Id,
          Name: item.Name,
        }));

    });
  }

  onchange(event: any) {

    this.selectedParentId = event.value;
    this.cateDetail.ParentId= this.selectedParentId;
  }

  getNameByParentId(parentId: number): string {
    const topic: any = this.parentIdList.find((item) => item.Id === parentId);
    return topic ? topic.Name : '';

  }
  actionComplete(args: any) {

    if (((args as any).requestType === 'beginEdit' || (args as any).requestType === 'add')) {
        const dialog = (args as any).dialog;
        dialog.showCloseIcon = false;
        dialog.height = 350;
        dialog.width=550;

        dialog.header = (args as any).requestType === 'beginEdit' ? 'Chỉnh sửa '  : 'Thêm Xã Mới';
    }
}
  actionBegin(args: SaveEventArgs) {
    if (args.action === RequestTypeAction.ADD) {
    this.cateDetail.Type = CommonCategoriesType.COMMUNE;
      if(this.cateDetail.ParentId === undefined){
        if(args.requestType === 'cancel'){
          args.cancel =false;
        }
        else{
        args.cancel =true;
        alert('Hãy chọn 1 Huyện');
        }
      }
       if(this.cateDetail.ParentId !== undefined){
    this.service.CreateCommoncategory(this.cateDetail).subscribe(()=>{
      this.cateDetail = new Commoncategory();
      this.loadCate();

      this.toastService.success('Thêm thành công!', 'Thành công');
      this.changeDetectorRef.markForCheck();

    })
      }
    }

    if (args.action === RequestTypeAction.BEGINEDIT) {
    this.cateDetail = args.data as Commoncategory;
    }

    if(args.action === RequestTypeAction.EDIT){
      this.service.UpdateCommonCategory(this.cateDetail,(args.data as any).Id).subscribe(() =>{
        this.cateDetail = new Commoncategory();
        this.loadCate();

        this.toastService.success('Cập nhật thành công!', 'Thành công');
        this.changeDetectorRef.markForCheck();
      })
    }
    if (args.requestType === 'delete') {
      const x = (args.data as any)[0].Id;
      this.service.DeleteCommonCategory(x).subscribe(
        () => {
          this.toastService.success('Xóa thành công!', 'Thành công');
        },
        (error) => {
          args.cancel = false;
          this.loadCate();
          this.toastService.error('Xóa thất bại, Quận/ Xã này đang được sử dụng!', 'Thất bại');
          args.cancel = false;
        }
      );
    }
  }
}
